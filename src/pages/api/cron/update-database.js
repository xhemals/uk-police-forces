import { GetForces, SeniorOfficers, SpecificForce, Neighbourhoods, specificNeighbourhood, GetLastUpdated } from "@/functions/api-calls";
import { DbLastUpdated } from "@/functions/data-calls";
import { MongoClient, ServerApiVersion } from "mongodb";
import Bottleneck from "bottleneck";

// Create a limiter instance
const limiter = new Bottleneck({
	minTime: 67,
	maxConcurrent: 30,
});

const forces = await GetForces();

let taskStatus = {};

export default async function handler(req, res) {
	const authHeader = req.headers["authorization"];
	if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return res.status(401).json({ success: false });
	}
	const taskId = req.query.taskId;
	// The client is starting a new task
	const newTaskId = Date.now().toString();
	taskStatus[newTaskId] = "running";

	// Start the long-running task in a separate process or thread
	startLongRunningTask(newTaskId);

	// Immediately send a response to the client
	res.status(200).json({ taskId: newTaskId });
}

async function startLongRunningTask(taskId) {
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
		const lastUpdated = await DbLastUpdated();
		const APILastUpdated = await limiter.schedule(() => GetLastUpdated());
		const APILastUpdatedDate = new Date(APILastUpdated.date);
		if (lastUpdated !== null) {
			const lastUpdatedDate = new Date(lastUpdated.date);

			if (lastUpdatedDate.getTime() === APILastUpdatedDate.getTime()) {
				console.log("Database is already up to date");
				return;
			}
		}

		await client.connect();

		const database = client.db("data");
		const forceCollection = database.collection("forces");
		const datesCollection = database.collection("dates");

		await datesCollection.updateOne({ _id: "APILastUpdate" }, { $set: { date: APILastUpdatedDate } }, { upsert: true });

		// MongoDB creates a new collection if it doesn't exist
		for (let i = 0; i < forces.length; i++) {
			const force = forces[i];
			console.log(`Updating ${force.name} (${i + 1}/${forces.length})`);
			console.time(force.name + " update time");
			const forceInfo = await getSpecificForceInfo(force);
			const seniorOfficers = await getSeniorOfficers(force);
			const neighbourhoods = await getNeighbourhoods(force);
			// Await the updateOne operation
			await forceCollection.updateOne(
				{ _id: force.id }, // Filter
				{
					$set: {
						name: force.name,
						pageUrl: `/force/${encodeURIComponent(force.id)}`,
						info: {
							description: forceInfo.description,
							url: forceInfo.url,
							engagement_methods: forceInfo.engagement_methods,
							telephone: forceInfo.telephone,
							id: forceInfo.id,
							name: forceInfo.name,
						},
						seniorOfficers: { pageUrl: `/force/${encodeURIComponent(force.id)}/officers`, officers: seniorOfficers },
						neighbourhoods: neighbourhoods,
					},
				}, // Update
				{ upsert: true } // Options
			);
			console.timeEnd(force.name + " update time");
		}

		return (taskStatus[taskId] = "completed");
	} catch (error) {
		console.error(error);
		return;
	} finally {
		await client.close();
	}
}

// export default async function handler(req, res) {

// }

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
		officer.pageUrl = `/force/${force.id}/officers/${encodeURIComponent(officer.name.replace(/ /g, "_").toLowerCase())}`;
	});
	console.log(`       ↳ ✓ Complete`);
	return officers;
}

async function getNeighbourhoods(force) {
	console.log(`   ↳${force.name} neighbourhoods updating...`);
	const neighbourhoods = await limiter.schedule(() => Neighbourhoods(force.id));
	neighbourhoods.map(async (neighbourhood) => {
		neighbourhood.pageUrl = `/force/${force.id}/neighbourhoods/${encodeURIComponent(neighbourhood.id.replace(/ /g, "_"))}`;
	});
	console.log(`       ↳ ✓ Complete`);
	return neighbourhoods;
}
