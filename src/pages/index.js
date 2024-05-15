// React and Next.js imports
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Function imports
import { GetForces } from "@/functions/data-calls";

// Style imports
import styles from "@/app/page.module.css";

// Other imports
import { NextSeo } from "next-seo";

export async function getServerSideProps() {
	const forces = await GetForces();
	return { props: { forces } };
}

export default function Home({ forces }) {
	const [search, setSearch] = useState("");
	const [visibleForces, setVisibleForces] = useState(forces);

	const handleInput = (e) => {
		setSearch(e.target.value);
		setVisibleForces(forces.filter((force) => force.name.toLowerCase().includes(e.target.value.toLowerCase())));
	};

	return (
		<>
			<NextSeo title="UK Police Force Information" description="Discover comprehensive profiles of all police forces across the United Kingdom, including key contact details and personnel information." />
			<NextSeo openGraph={{ images: [{ url: `/api/og?title=Police%20Forces`, alt: "UK Police Force Information Logo" }] }} />
			<main className={styles.main}>
				<div className={styles.description}>
					<h1>Police Forces</h1>
					<div className={styles.searchBar}>
						<input className={styles.search} type="text" value={search} placeholder="Search..." onInput={(e) => handleInput(e)} />
						<i aria-hidden className={`fa fa-search ${styles.searchIcon}`}></i>
					</div>
					<div className={styles.forcesList}>
						{visibleForces.map((force) => (
							<Link href={`/force/${force._id}`} className={`force ${styles.force}`} key={force._id}>
								{force.name}
							</Link>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
