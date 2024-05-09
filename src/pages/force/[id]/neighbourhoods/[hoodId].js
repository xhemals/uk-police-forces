import { SpecificNeighbourhood, NeighbourhoodBoundary } from "@/functions/api-calls";
import { SpecificForce } from "@/functions/data-calls";
import { NextSeo } from "next-seo";
import Link from "next/link";
import styles from "./hood.module.css";
import dynamic from "next/dynamic";
import RenderHTML from "@/functions/render-html";

const MapBoundaryWithNoSSR = dynamic(() => import("@/functions/map-boundary"), {
	ssr: false,
});

export async function getServerSideProps({ params }) {
	const id = params.id;
	const hoodId = params.hoodId;
	console.log(id, hoodId);
	const force = await SpecificForce(id);
	const neighbourhood = await SpecificNeighbourhood(id, hoodId);
	const boundary = await NeighbourhoodBoundary(id, hoodId);
	return { props: { force, neighbourhood, boundary } };
}

export default function Neighbourhood({ force, neighbourhood, boundary }) {
	if (neighbourhood.description) {
		var descriptionWithoutTags = neighbourhood.description.replace(/<[^>]+>/g, "");
	}
	return (
		<>
			<NextSeo title={`Neighbourhood - ${force.name}`} description={descriptionWithoutTags ? descriptionWithoutTags : `Neighbourhood ${neighbourhood.name} in ${force.name}`} />
			<main className={styles.main}>
				<h1>{neighbourhood.name}</h1>
				<h3>
					Operated by: <Link href={`/force/${force.id}`}>{force.name}</Link>
				</h3>
				<a className={styles.link} href={force.url} target="_blank" rel="noreferrer">
					{neighbourhood.url_force}
				</a>
				<div>
					<RenderHTML html={neighbourhood.description} />
				</div>
				<div className={styles.neighbourhood}>
					<MapBoundaryWithNoSSR boundary={boundary} />
					<div className={styles.info}>
						<h2>Information</h2>
					</div>
					<div className={styles.contacDetails}>
						<h3>Contact Details</h3>
						{Object.entries(neighbourhood.contact_details).map(([key, value]) => (
							<p key={key}>
								{key.charAt(0).toUpperCase() + key.slice(1)}: {key === "telephone" ? <a href={`tel:${value}`}>{value}</a> : value.includes("@") ? <a href={`mailto:${value}`}>{value}</a> : value}
							</p>
						))}
					</div>
					<div className={styles.links}>
						<h3>Links</h3>
						{neighbourhood.links.map((link, index) => (
							<div key={index} className={styles.link}>
								<a href={link.url} target="_blank" rel="noreferrer">
									{link.title}
								</a>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
