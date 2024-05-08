import axios from "axios";
const api_key = process.env.MONGO_API_KEY;
const api_url = process.env.MONGO_API_URL;
const dataSource = "mongodb-atlas";
const database = "data";
const collection = "forces";
const contentType = "application/json";

export const GetForces = async () => {
	const response = await axios.post(
		`${api_url}/action/find`,
		{
			dataSource: dataSource,
			database: database,
			collection: collection,
			projection: {
				_id: 1,
				name: 1,
			},
		},
		{
			headers: {
				"Content-Type": contentType,
				apiKey: `${api_key}`,
			},
		}
	);

	return response.data.documents;
};

export const SpecificForce = async (id) => {
	const response = await axios.post(
		`${api_url}/action/findOne`,
		{
			dataSource: dataSource,
			database: database,
			collection: collection,
			filter: {
				_id: id,
			},
			projection: {
				_id: 0,
				info: 1,
			},
		},
		{
			headers: {
				"Content-Type": contentType,
				apiKey: `${api_key}`,
			},
		}
	);

	return response.data.document.info;
};

export const SeniorOfficers = async (id) => {
	const response = await axios.post(
		`${api_url}/action/findOne`,
		{
			dataSource: dataSource,
			database: database,
			collection: collection,
			filter: {
				_id: id,
			},
			projection: {
				_id: 0,
				seniorOfficers: 1,
			},
		},
		{
			headers: {
				"Content-Type": contentType,
				apiKey: `${api_key}`,
			},
		}
	);

	return response.data.document.seniorOfficers.officers;
};

export const Neighbourhoods = async (id) => {
	const response = await axios.post(
		`${api_url}/action/findOne`,
		{
			dataSource: dataSource,
			database: database,
			collection: collection,
			filter: {
				_id: id,
			},
			projection: {
				_id: 0,
				neighbourhoods: 1,
			},
		},
		{
			headers: {
				"Content-Type": contentType,
				apiKey: `${api_key}`,
			},
		}
	);

	return response.data.document.neighbourhoods;
};

export const DbLastUpdated = async () => {
	const response = await axios.post(
		`${api_url}/action/findOne`,
		{
			dataSource: dataSource,
			database: database,
			collection: "dates",
			filter: {
				_id: "APILastUpdate",
			},
			projection: {
				_id: 0,
				date: 1,
			},
		},
		{
			headers: {
				"Content-Type": contentType,
				apiKey: `${api_key}`,
			},
		}
	);

	return response.data.document;
};

export const SpecificSeniorOfficer = async (id, name) => {
	const response = await axios.post(
		`${api_url}/action/findOne`,
		{
			dataSource: dataSource,
			database: database,
			collection: collection,
			filter: {
				_id: id,
			},
			projection: {
				_id: 0,
				seniorOfficers: 1,
			},
		},
		{
			headers: {
				"Content-Type": contentType,
				apiKey: `${api_key}`,
			},
		}
	);

	const officerInfo = response.data.document.seniorOfficers.officers.filter((officer) => officer.name === name);
	return officerInfo[0];
};
