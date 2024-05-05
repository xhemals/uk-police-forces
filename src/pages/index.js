// React and Next.js imports
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Function imports
import { GetForces } from "@/functions/api-calls";

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
			<NextSeo title="Police Forces" description="A list of all police forces in the UK" />
			<main className={styles.main}>
				<div className={styles.description}>
					<h1>Police Forces</h1>
					<div className={styles.searchBar}>
						<input className={styles.search} type="text" value={search} placeholder="Search..." onInput={(e) => handleInput(e)} />
						<i aria-hidden className={`fa fa-search ${styles.searchIcon}`}></i>
					</div>
					<div className={styles.forcesList}>
						{visibleForces.map((force) => (
							<Link href={`/force/${force.id}`} className={`force ${styles.force}`} key={force.id}>
								{force.name}
							</Link>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
