import { MongoClient } from "mongodb";

export default async function handler(req, res) {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		await client.connect();

		const database = client.db("data"); // Replace with your database name
		const collection = database.collection("forces"); // Replace with your collection name

		const forces = await collection.find({}, { projection: { _id: 1, name: 1 } }).toArray();

		res.status(200).json(forces);
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Error", message: error.message });
	} finally {
		await client.close();
	}
}
