import { useState } from "react";
import { SeniorOfficers, SpecificForce } from "@/functions/api-calls";
import Header from "@/components/layouts/header/header";
import styles from "./page.module.css";
import "@/app/globals.css";
import { PoliceSocials } from "@/functions/police-socials";
import { networkFor } from "react-social-icons";
import { NextSeo } from "next-seo";

export async function getServerSideProps({ params }) {
	const id = params.id;
	const force = await SpecificForce(id);
	const seniorOfficers = await SeniorOfficers(id);
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
	const [search, setSearch] = useState("");
	const [visibleOfficers, setVisibleOfficers] = useState(seniorOfficers);
	if (force.description) {
		var descriptionWithoutTags = force.description.replace(/<[^>]+>/g, "");
	}

	if (!force) {
		return <div>Loading...</div>;
	}

	const handleInput = (e) => {
		setSearch(e.target.value);
		setVisibleOfficers(seniorOfficers.filter((officer) => officer.name.toLowerCase().includes(e.target.value.toLowerCase())));
	};

	return (
		<>
			<NextSeo title={`Officers - ${force.name}`} description={descriptionWithoutTags ? descriptionWithoutTags : `Information about ${force.name}`} />
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
				{seniorOfficers && seniorOfficers.length > 0 ? (
					<div className={styles.seniorOfficers}>
						<h2>Senior Officers</h2>
						<div className={styles.searchBar}>
							<input className={styles.search} type="text" value={search} placeholder="Search..." onInput={(e) => handleInput(e)} />
							<i aria-hidden className={`fa fa-search ${styles.searchIcon}`}></i>
						</div>
						<div className={`masonry ${styles.officersDisplay}`}>
							{visibleOfficers.map((officer, index) => (
								<div key={index} className={`officer ${styles.officer}`} name={officer.name}>
									<h3>{officer.name}</h3>
									<h6>{officer.rank}</h6>
									{officer.bio ? <div className={styles.bio} dangerouslySetInnerHTML={{ __html: officer.bio }}></div> : null}
								</div>
							))}
						</div>
					</div>
				) : null}
			</main>
		</>
	);
}
