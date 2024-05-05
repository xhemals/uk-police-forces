// React and Next.js imports
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";

// Component imports
import Header from "@/components/layouts/header/header";

// Style imports
import styles from "./page.module.css";

// Function imports
import { SpecificForce, SpecificSeniorOfficer } from "@/functions/api-calls";

export async function getServerSideProps({ params }) {
	const { id, officer } = params;
	const officerName = officer
		.replace(/_/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	const officerInfo = await SpecificSeniorOfficer(id, officerName);
	const force = await SpecificForce(id);
	// const force = await SpecificForce(id);
	// const seniorOfficers = await SeniorOfficers(id);
	return { props: { officerName, officerInfo, force } };
}

export default function Force({ officerName, officerInfo, force }) {
	return (
		<>
			<NextSeo title={`${officerName} - ${force.name}`} description={officerInfo.bio ? officerInfo.bio : `Information about ${officerName} from ${force.name}`} />
			{/* <Header /> */}
			<main className={styles.main}>
				<h1>{officerName}</h1>
				<h2>{officerInfo.bio}</h2>
				<h3>{force.name}</h3>
			</main>
		</>
	);
}
