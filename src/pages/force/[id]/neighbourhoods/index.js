// React and Next.js imports
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
import { Neighbourhoods, SpecificForce } from "@/functions/data-calls";

// Other imports
import { SortingMode } from "ka-table/enums";
import { decode } from "html-entities";

export async function getServerSideProps({ params }) {
	const id = params.id;
	const force = await SpecificForce(id);
	const neighbourhoods = await Neighbourhoods(id);
	return { props: { force, neighbourhoods } };
}

function neighbourhoodsTable(neighbourhoods) {
	const dataArray = neighbourhoods.map((neighbourhood, index) => ({
		name: neighbourhood.name,
		id: neighbourhood.id,
	}));
	return dataArray;
}

export default function Force({ force, neighbourhoods }) {
	const NeighbourhoodCustomCell = (props) => {
		const { rowData, force } = props;
		const decodedName = decode(rowData.name); // double decode, once here and once in return
		return (
			<Link href={`/force/${force}/neighbourhoods/${rowData.id.replace(/ /g, "_").toLowerCase()}`}>
				<div className="ka-url">{decode(decodedName)}</div>
			</Link>
		);
	};

	return (
		<>
			<NextSeo title={`Neighbourhoods - ${force.name}`} description={`Neighbourhoods covered by ${force.name}`} />
			<NextSeo openGraph={{ images: [{ url: `/api/og?title=${encodeURIComponent(force.name)}%20Neighbourhoods`, alt: "UK Police Force Information Logo" }] }} />
			<main className={styles.main}>
				<h1>
					<Link href={`/force/${force.id}`}>{force.name}</Link> Neighbourhoods
				</h1>
				<div className={styles.neighbourhoods}>
					<Table
						data={neighbourhoodsTable(neighbourhoods)}
						columns={[{ key: "name", title: "Name" }]}
						rowKeyField="id"
						childComponents={{
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
			</main>
		</>
	);
}
