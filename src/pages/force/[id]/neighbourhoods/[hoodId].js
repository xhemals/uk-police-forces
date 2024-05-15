import { SpecificNeighbourhood, NeighbourhoodBoundary, NeighbourhoodPriorities, NeighbourhoodEvents } from "@/functions/api-calls";
import { SpecificForce } from "@/functions/data-calls";
import { NextSeo } from "next-seo";
import Link from "next/link";
import styles from "./hood.module.css";
import dynamic from "next/dynamic";
import RenderHTML from "@/functions/render-html";
import { useState } from "react";
import { useEffect } from "react";
import { decode } from "html-entities";

const MapBoundaryWithNoSSR = dynamic(() => import("@/functions/map-boundary"), {
	ssr: false,
});

export async function getServerSideProps({ params }) {
	const id = params.id;
	const hoodId = params.hoodId;
	const force = await SpecificForce(id);
	const neighbourhood = await SpecificNeighbourhood(id, hoodId);
	const boundary = await NeighbourhoodBoundary(id, hoodId);
	const priorities = await NeighbourhoodPriorities(id, hoodId);
	const events = await NeighbourhoodEvents(id, hoodId);
	return { props: { force, neighbourhood, boundary, priorities, events } };
}

export default function Neighbourhood({ force, neighbourhood, boundary, priorities, events }) {
	const [neighbourhoodName, setNeighbourhoodName] = useState();
	if (neighbourhood.description) {
		var descriptionWithoutTags = neighbourhood.description.replace(/<[^>]+>/g, "");
	}

	useEffect(() => {
		const decodedName = decode(neighbourhood.name); // double decode, once here and once in return
		setNeighbourhoodName(decode(decodedName));
	}, []);

	return (
		<>
			<NextSeo title={`${neighbourhoodName} - ${force.name}`} description={descriptionWithoutTags ? descriptionWithoutTags : `Neighbourhood ${neighbourhood.name} in ${force.name}`} />
			<NextSeo openGraph={{ images: [{ url: `/api/og?title=${encodeURIComponent(neighbourhoodName)}`, alt: "UK Police Force Information Logo" }] }} />
			<main className={styles.main}>
				<h1>{neighbourhoodName}</h1>
				<h3>
					Operated by: <Link href={`/force/${force.id}`}>{force.name}</Link>
				</h3>
				<a className={styles.link} href={neighbourhood.url_force} target="_blank" rel="nofollow">
					{neighbourhood.url_force}
				</a>
				<div>
					<RenderHTML html={neighbourhood.description} />
				</div>
				<div className={styles.neighbourhood}>
					<MapBoundaryWithNoSSR boundary={boundary} />
					<div className={styles.info}>
						<div className={styles.contacDetails}>
							<h3>Contact Details</h3>
							{Object.entries(neighbourhood.contact_details).map(([key, value]) => (
								<p key={key}>
									{key.charAt(0).toUpperCase() + key.slice(1)}: {key === "telephone" ? <a href={`tel:${value}`}>{value}</a> : value.includes("@") ? <a href={`mailto:${value}`}>{value}</a> : value}
								</p>
							))}
						</div>
						{neighbourhood.links.length !== 0 ? (
							<div className={styles.links}>
								<h3>Links</h3>
								{neighbourhood.links.map((link, index) => (
									<div key={index} className={styles.link}>
										<a href={link.url} target="_blank" rel="nofollow">
											{link.title}
										</a>
									</div>
								))}
							</div>
						) : null}
					</div>
				</div>
				<div className={styles.prioritiesEvents}>
					{priorities.length !== 0 ? (
						<div className={styles.priorities}>
							<h2>Current Priorities</h2>
							{priorities.map((priority, index) => (
								<div key={index} className={styles.priorityInfo}>
									{priority.issue && (
										<div>
											<h4>Issue</h4>
											<RenderHTML html={priority.issue} />
										</div>
									)}
									{priority.action && (
										<div>
											<h4>Action</h4>
											<RenderHTML html={priority.action} />
										</div>
									)}
								</div>
							))}
						</div>
					) : null}
					{events.length !== 0 ? (
						<div className={styles.events}>
							<h2>Upcoming Events</h2>
							{events.map((event, index) => (
								<div key={index}>
									<h4>{event.title}</h4>
									<RenderHTML html={event.description} />
									<p>Where: {event.address}</p>
									<p>
										When: {new Date(event.start_date).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} -{" "}
										{new Date(event.end_date).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
									</p>
								</div>
							))}
						</div>
					) : null}
				</div>
			</main>
		</>
	);
}
