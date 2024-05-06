import axios from "axios";

export const GetForces = async () => {
	const response = await axios.get(`${process.env.website}/api/data/forces`);
	return response.data;
};

export const SpecificForce = async (id) => {
	const response = await axios.get(`${process.env.website}/api/data/force/${id}`);
	return response.data;
};

export const SeniorOfficers = async (id) => {
	const response = await axios.get(`${process.env.website}/api/data/force/${id}/officers`);
	return response.data;
};

export const Neighbourhoods = async (id) => {
	const response = await axios.get(`${process.env.website}/api/data/force/${id}/neighbourhoods`);
	return response.data;
};
