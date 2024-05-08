// React and Next.js imports
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";

//other imports
import DOMPurify from "isomorphic-dompurify";

// Component imports
import Header from "@/components/layouts/header/header";

// Style imports
import styles from "./page.module.css";

// Function imports
import { SpecificForce, SpecificSeniorOfficer } from "@/functions/data-calls";
import RenderHTML from "@/functions/render-html";

export async function getServerSideProps({ params }) {
	const { id, officer } = params;
	const officerName = officer
		.replace(/_/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	const officerInfo = await SpecificSeniorOfficer(id, officerName);
	const force = await SpecificForce(id);
	return { props: { officerName, officerInfo, force } };
}

export default function Force({ officerName, officerInfo, force }) {
	const cleanBio = DOMPurify.sanitize(officerInfo.bio);
	return (
		<>
			<NextSeo title={`${officerName} - ${force.name}`} description={officerInfo.bio ? officerInfo.bio.replace(/<[^>]*>/g, "") : `Information about ${officerName} from ${force.name}`} />
			<main className={styles.main}>
				<h1>{officerName}</h1>
				<h3>
					<Link href={`/force/${force.id}`}>{force.name}</Link>
				</h3>
				<div>
					<RenderHTML html={officerInfo.bio} />
				</div>
			</main>
		</>
	);
}
