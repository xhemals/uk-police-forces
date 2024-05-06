import { GetForces, SeniorOfficers, SpecificForce, Neighbourhoods, specificNeighbourhood } from "@/functions/api-calls";
import { MongoClient, ServerApiVersion } from "mongodb";
import Bottleneck from "bottleneck";

// Create a limiter instance
const limiter = new Bottleneck({
	minTime: 67,
	maxConcurrent: 30,
});

const forces = await GetForces();

export default async function handler(req, res) {
	const uri = process.env.MONGODB_URI;

	// Create a MongoClient with a MongoClientOptions object to set the Stable API version
	const client = new MongoClient(uri, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		},
	});

	try {
		await client.connect();

		const database = client.db("data"); // Replace with your database name
		const collection = database.collection("forces"); // Replace with your collection name

		// MongoDB creates a new collection if it doesn't exist
		for (let i = 0; i < forces.length; i++) {
			const force = forces[i];
			console.log(`Updating ${force.name} (${i + 1}/${forces.length})`);
			console.time(force.name + " update time");
			const forceInfo = await getSpecificForceInfo(force);
			const seniorOfficers = await getSeniorOfficers(force);
			const neighbourhoods = await getNeighbourhoods(force);
			// Await the updateOne operation
			await collection.updateOne(
				{ _id: force.id }, // Filter
				{
					$set: {
						name: force.name,
						pageUrl: `/force/${force.id}`,
						info: {
							description: forceInfo.description,
							url: forceInfo.url,
							engagement_methods: forceInfo.engagement_methods,
							telephone: forceInfo.telephone,
							id: forceInfo.id,
							name: forceInfo.name,
						},
						seniorOfficers: { pageUrl: `/force/${force.id}/officers`, officers: seniorOfficers },
						neighbourhoods: neighbourhoods,
					},
				}, // Update
				{ upsert: true } // Options
			);
			console.timeEnd(force.name + " update time");
			// console.log(`${force.name} updated in `);

			// Wait for half a second before the next request
			// await new Promise((resolve) => setTimeout(resolve, 500));
		}

		res.status(200).json({ status: "Success" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Error", message: error.message });
	} finally {
		await client.close();
	}
}

async function getSpecificForceInfo(force) {
	console.log(`   ↳${force.name} info updating...`);
	const forceInfo = await limiter.schedule(() => SpecificForce(force.id));
	console.log(`       ↳ ✓ Complete`);
	return forceInfo;
}

async function getSeniorOfficers(force) {
	console.log(`   ↳${force.name} senior officers updating...`);
	const officers = await limiter.schedule(() => SeniorOfficers(force.id));
	officers.map((officer) => {
		officer.pageUrl = `/force/${force.id}/officers/${officer.name.replace(/ /g, "_").toLowerCase()}`;
	});
	console.log(`       ↳ ✓ Complete`);
	return officers;
}

async function getNeighbourhoods(force) {
	console.log(`   ↳${force.name} neighbourhoods updating...`);
	const neighbourhoods = await limiter.schedule(() => Neighbourhoods(force.id));
	neighbourhoods.map(async (neighbourhood) => {
		neighbourhood.pageUrl = `/force/${force.id}/neighbourhoods/${neighbourhood.id}`;
	});
	console.log(`       ↳ ✓ Complete`);
	return neighbourhoods;
}
