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

export const SpecificSeniorOfficer = async (id) => {};

export const SeniorOfficerPreview = async (id) => {
	const response = await axios.get(`https://data.police.uk/api/forces/${id}/people`);
	const officers = response.data;
	if (officers.length < 3) {
		return officers;
	}
	let randomOfficers = [];
	while (randomOfficers.length < 3) {
		let randomIndex = Math.floor(Math.random() * officers.length);
		if (randomOfficers.indexOf(officers[randomIndex]) === -1) {
			randomOfficers.push(officers[randomIndex]);
		}
	}
	return randomOfficers;
};
