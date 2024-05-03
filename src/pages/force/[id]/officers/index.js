import { useState } from "react";
import { SeniorOfficers, SpecificForce } from "@/functions/api-calls";
import Header from "@/components/layouts/header/header";
import styles from "./page.module.css";
import "@/components/filters/react-select.css";
import { NextSeo } from "next-seo";
import Link from "next/link";
import makeAnimated from "react-select/animated";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select").then((mod) => mod.default), { ssr: false });

export async function getServerSideProps({ params }) {
	const id = params.id;
	const force = await SpecificForce(id);
	const seniorOfficers = await SeniorOfficers(id);
	return { props: { force, seniorOfficers } };
}

function getRankFilters(seniorOfficers) {
	let options = [];
	seniorOfficers.map((officer) => {
		if (!options.some((option) => option.value === officer.rank)) {
			options.push({ value: officer.rank, label: officer.rank });
		}
	});
	return options;
}

export default function Force({ force, seniorOfficers }) {
	const [visibleOfficers, setVisibleOfficers] = useState(seniorOfficers);

	const filterByRank = (selectedOptions) => {
		if (selectedOptions.length === 0) {
			setVisibleOfficers(seniorOfficers);
			return;
		}
		setVisibleOfficers(seniorOfficers.filter((officer) => selectedOptions.some((option) => option.value === officer.rank)));
	};

	return (
		<>
			<NextSeo title={`Officers - ${force.name}`} description={`Senior officers from ${force.name}`} />
			<Header />
			<main className={styles.main}>
				<h1>
					<Link href={`/force/${force.id}`}>{force.name}</Link> Senior Officers
				</h1>
				<div className={styles.seniorOfficers}>
					{seniorOfficers && seniorOfficers.length > 0 ? (
						<>
							<div className={styles.filterArea}>
								<div className={styles.rankFilter}>
									<span>
										<h3>Rank</h3>
									</span>
									<Select
										blurInputOnSelect
										isMulti
										options={getRankFilters(seniorOfficers)}
										name="Rank"
										unstyled
										className="react-select-container"
										classNamePrefix="react-select"
										onChange={(selectedOptions) => {
											filterByRank(selectedOptions);
										}}
									/>
								</div>
							</div>
							<div className={`${styles.officersDisplay}`}>
								{visibleOfficers.map((officer, index) => (
									<div key={index} className={`officer ${styles.officer}`} name={officer.name}>
										<h3>{officer.name}</h3>
										<h6>{officer.rank}</h6>
										{officer.bio ? <div className={styles.bio} dangerouslySetInnerHTML={{ __html: officer.bio }}></div> : null}
									</div>
								))}
							</div>
						</>
					) : (
						<h4>There are no senior officers listed for {force.name}</h4>
					)}
				</div>
			</main>
		</>
	);
}
