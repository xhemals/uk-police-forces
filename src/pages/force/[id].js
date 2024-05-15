// React and Next.js imports
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";

// Component imports
import { Table } from "ka-table";

// Style imports
import styles from "./page.module.css";
import "@/components/filters/react-select.css";
import "@/components/table/ka-table.css";

// Function imports
import { SeniorOfficers, SpecificForce, Neighbourhoods } from "@/functions/data-calls";
import { PoliceSocials } from "@/functions/police-socials";

// Other imports
import { networkFor } from "react-social-icons";
import { SortingMode } from "ka-table/enums";
import { decode } from "html-entities";

// Dynamic imports
const Select = dynamic(() => import("react-select").then((mod) => mod.default), { ssr: false });

export async function getServerSideProps({ params }) {
	const id = params.id;
	const force = await SpecificForce(id);
	const seniorOfficers = await SeniorOfficers(id);
	const neighbourhoods = await Neighbourhoods(id);
	return { props: { force, seniorOfficers, neighbourhoods } };
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
			<a href={url} target="_blank" rel="nofollow">
				<PoliceSocials socialUrl={url} />
			</a>
		</div>
	);
}

function officersTable(visibleOfficers) {
	const dataArray = visibleOfficers.map((officer, index) => ({
		name: officer.name,
		rank: officer.rank,
		id: index,
	}));
	return dataArray;
}

function neighbourhoodsTable(neighbourhoods) {
	const dataArray = neighbourhoods.map((neighbourhood, index) => ({
		name: neighbourhood.name,
		id: neighbourhood.id,
	}));
	return dataArray;
}

export default function Force({ force, seniorOfficers, neighbourhoods }) {
	const [visibleOfficers, setVisibleOfficers] = useState(seniorOfficers);

	if (force.description) {
		var descriptionWithoutTags = force.description.replace(/<[^>]+>/g, "");
	}

	const filterByRank = (selectedOptions) => {
		if (selectedOptions.length === 0) {
			setVisibleOfficers(seniorOfficers);
			return;
		}
		setVisibleOfficers(seniorOfficers.filter((officer) => selectedOptions.some((option) => option.value === officer.rank)));
	};

	const OfficersCustomCell = ({ value, force }) => {
		const officerUrl = value.replace(/ /g, "_").toLowerCase();
		return (
			<Link href={`/force/${force}/officers/${officerUrl}`}>
				<div className="ka-url">{value}</div>
			</Link>
		);
	};

	const NeighbourhoodCustomCell = (props) => {
		const { rowData, force } = props;
		const decodedName = decode(rowData.name); // double decode, once here and once in return
		return (
			<Link href={`/force/${force}/neighbourhoods/${rowData.id.replace(/ /g, "_")}`}>
				<div className="ka-url">{decode(decodedName)}</div>
			</Link>
		);
	};

	return (
		<>
			<NextSeo title={force.name} description={descriptionWithoutTags ? descriptionWithoutTags : `Information about ${force.name}`} />
			<NextSeo openGraph={{ images: [{ url: `/api/og?title=${encodeURIComponent(force.name)}`, alt: "UK Police Force Information Logo" }] }} />

			<main className={styles.main}>
				<h1>{force.name}</h1>

				<a className={styles.link} href={force.url} target="_blank" rel="nofollow">
					{force.url}
				</a>
				<div className={styles.socials}>
					{force.engagement_methods.map((method, index) => {
						return socialCheck(method.url, index);
					})}
				</div>
				{descriptionWithoutTags && descriptionWithoutTags != "Force  profile" ? <div className={styles.forceDescription}>{descriptionWithoutTags}</div> : null}
				<div className={styles.information}>
					{neighbourhoods && neighbourhoods.length > 0 ? (
						<div className={styles.neighbourhoods}>
							<h2>Neighbourhoods</h2>
							<Table
								data={neighbourhoodsTable(neighbourhoods)}
								columns={[{ key: "name", title: "Name" }]}
								rowKeyField="id"
								childComponents={{
									tableWrapper: {
										elementAttributes: () => ({
											style: { maxHeight: 600 },
										}),
									},
									cellText: {
										content: (props) => {
											switch (props.column.key) {
												case "name":
													return <NeighbourhoodCustomCell {...props} force={force.id} />;
											}
										},
									},
								}}
								sortingMode={SortingMode.Single}
							/>
						</div>
					) : null}
					<div className={styles.seniorOfficers}>
						<h2>Senior Officers</h2>
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
								<span>
									{visibleOfficers.length} {visibleOfficers.length === 1 ? "officer" : "officers"} found
								</span>
								<Table
									data={officersTable(visibleOfficers)}
									columns={[
										{ key: "name", title: "Name" },
										{ key: "rank", title: "Rank" },
									]}
									rowKeyField="id"
									childComponents={{
										tableWrapper: {
											elementAttributes: () => ({
												style: { maxHeight: 600 },
											}),
										},
										cellText: {
											content: (props) => {
												switch (props.column.key) {
													case "name":
														return <OfficersCustomCell {...props} force={force.id} />;
												}
											},
										},
									}}
									sortingMode={SortingMode.Single}
								/>
							</>
						) : (
							<h4>There are no senior officers listed for {force.name}</h4>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
