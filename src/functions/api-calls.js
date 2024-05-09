import axios from "axios";

export const GetLastUpdated = async () => {
	const response = await axios.get("https://data.police.uk/api/crime-last-updated");
	return response.data;
};

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

export const SpecificNeighbourhood = async (id, neighbourhoodId) => {
	const response = await axios.get(`https://data.police.uk/api/${id}/${neighbourhoodId}`);
	return response.data;
};

export const NeighbourhoodTeam = async (id, neighbourhoodId) => {
	const response = await axios.get(`https://data.police.uk/api/${id}/${neighbourhoodId}/people`);
	return response.data;
};

export const NeighbourhoodBoundary = async (id, neighbourhoodId) => {
	const response = await axios.get(`https://data.police.uk/api/${id}/${neighbourhoodId}/boundary`);
	const boundaries = [];
	response.data.map((boundary) => {
		boundaries.push([boundary.latitude, boundary.longitude]);
	});
	return boundaries;
};
