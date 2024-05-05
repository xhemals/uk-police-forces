// React and Next.js imports
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";

// Component imports
import Header from "@/components/layouts/header/header";
import { Table } from "ka-table";

// Style imports
import styles from "./page.module.css";
import "@/components/filters/react-select.css";
import "@/components/table/ka-table.css";

// Function imports
import { SeniorOfficers, SpecificForce, Neighbourhoods } from "@/functions/api-calls";

// Other imports
import { SortingMode } from "ka-table/enums";

// Dynamic imports
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

function tableData(visibleOfficers) {
	const dataArray = visibleOfficers.map((officer, index) => ({
		name: officer.name,
		rank: officer.rank,
		id: index,
	}));
	return dataArray;
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

	const CustomCell = ({ value, force }) => {
		const officerUrl = value.replace(/ /g, "_").toLowerCase();
		return (
			<Link href={`/force/${force}/officers/${officerUrl}`}>
				<div className="ka-url">{value}</div>
			</Link>
		);
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
							<span>
								{visibleOfficers.length} {visibleOfficers.length === 1 ? "officer" : "officers"} found
							</span>
							<Table
								data={tableData(visibleOfficers)}
								columns={[
									{ key: "name", title: "Name" },
									{ key: "rank", title: "Rank" },
								]}
								rowKeyField="id"
								childComponents={{
									cellText: {
										content: (props) => {
											switch (props.column.key) {
												case "name":
													return <CustomCell {...props} force={force.id} />;
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
			</main>
		</>
	);
}
