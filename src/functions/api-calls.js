import axios from "axios";

export const GetForces = async () => {
	const response = await axios.get("https://data.police.uk/api/forces");
	return response.data;
};

export const SpecificForce = async (id) => {
	const response = await axios.get(`https://data.police.uk/api/forces/${id}`);
	return response.data;
};

export const SeniorOfficers = async (id) => {
	const response = await axios.get(`https://data.police.uk/api/forces/${id}/people`);
	return response.data;
};

export const SpecificSeniorOfficer = async (id, name) => {
	const response = await axios.get(`https://data.police.uk/api/forces/${id}/people`);
	const officerInfo = response.data.filter((officer) => officer.name === name);
	return officerInfo[0];
};

export const Neighbourhoods = async (id) => {
	const response = await axios.get(`https://data.police.uk/api/${id}/neighbourhoods`);
	return response.data;
};
