import { MongoClient } from "mongodb";

export default async function handler(req, res) {
	const id = req.query.id; // Access the id parameter from the request query
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		await client.connect();

		const database = client.db("data"); // Replace with your database name
		const collection = database.collection("forces"); // Replace with your collection name

		const force = await collection.findOne({ _id: id }, { projection: { _id: 0, info: 1 } });

		res.status(200).json(force.info);
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Error", message: error.message });
	} finally {
		await client.close();
	}
}
