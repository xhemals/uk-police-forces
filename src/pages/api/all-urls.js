import { MongoClient } from "mongodb";

export default async function handler(req, res) {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		await client.connect();

		const database = client.db("data"); // Replace with your database name
		const collection = database.collection("forces"); // Replace with your collection name

		const documents = await collection.find({}).toArray();

		function extractUrls(obj) {
			let urls = [];
			for (let key in obj) {
				if (typeof obj[key] === "object") {
					urls = urls.concat(extractUrls(obj[key]));
				} else if (key === "pageUrl") {
					urls.push(obj[key]);
				}
			}
			return urls;
		}

		const urls = documents.flatMap(extractUrls);

		res.status(200).json(urls);
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "Error", message: error.message });
	} finally {
		await client.close();
	}
}
