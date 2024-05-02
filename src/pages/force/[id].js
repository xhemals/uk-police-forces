import { useState } from "react";
import { SeniorOfficerPreview, SeniorOfficers, SpecificForce } from "@/functions/api-calls";
import Header from "@/components/layouts/header/header";
import styles from "./page.module.css";
import "@/app/globals.css";
import { PoliceSocials } from "@/functions/police-socials";
import { networkFor } from "react-social-icons";
import { NextSeo } from "next-seo";
import Link from "next/link";

export async function getServerSideProps({ params }) {
	const id = params.id;
	const force = await SpecificForce(id);
	const seniorOfficers = await SeniorOfficerPreview(id);
	return { props: { force, seniorOfficers } };
}

function socialCheck(url, index) {
	const lowerUrl = url.toLowerCase();
	if (url === "") {
		return;
	}
	if (networkFor(url) === "sharethis") {
		if (lowerUrl.includes("rss") || lowerUrl.includes("xml")) {
			null;
		} else {
			return;
		}
	}
	return (
		<div key={index} className={styles.socialLinks}>
			<a href={url} target="_blank" rel="noreferrer">
				<PoliceSocials socialUrl={url} />
			</a>
		</div>
	);
}

export default function Force({ force, seniorOfficers }) {
	if (force.description) {
		var descriptionWithoutTags = force.description.replace(/<[^>]+>/g, "");
	}

	if (!force) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<NextSeo title={force.name} description={descriptionWithoutTags ? descriptionWithoutTags : `Information about ${force.name}`} />
			<Header />
			<main className={styles.main}>
				<h1>{force.name}</h1>

				<a className={styles.link} href={force.url} target="_blank" rel="noreferrer">
					{force.url}
				</a>
				<div className={styles.socials}>
					{force.engagement_methods.map((method, index) => {
						return socialCheck(method.url, index);
					})}
				</div>
				{descriptionWithoutTags && descriptionWithoutTags != "Force  profile" ? <p>{descriptionWithoutTags}</p> : null}
				<div className={styles.information}>
					{seniorOfficers && seniorOfficers.length > 0 ? (
						<div className={styles.seniorOfficers}>
							<h2>Senior Officers</h2>
							{seniorOfficers.map((officer, index) => (
								<div key={index} className={`officer ${styles.officer}`} name={officer.name}>
									<h3>{officer.name}</h3>
									<div className={styles.officerLine}></div>
									<p>{officer.rank}</p>
								</div>
							))}
							<Link href={`/force/${force.id}/officers`} className={styles.link}>
								View all senior officers
							</Link>
						</div>
					) : null}
				</div>
			</main>
		</>
	);
}
