import { NextSeo } from "next-seo";
import styles from "./disclaimer.module.css";
import { DbLastUpdated } from "@/functions/data-calls";

export async function getServerSideProps({ params }) {
	const lastUpdated = await DbLastUpdated();
	return { props: { lastUpdated } };
}

export default function Disclaimer({ lastUpdated }) {
	const lastUpdatedFormatted = `${new Date(lastUpdated.date).toLocaleString("default", { month: "long" })} ${new Date(lastUpdated.date).getFullYear()}`;
	return (
		<>
			<NextSeo title="Disclaimer" />
			<main className={styles.main}>
				<h1>Disclaimer</h1>
				<div className={styles.disclaimer}>
					<p>
						This website is an independent service and is not affiliated with, endorsed by, or in any way associated with the UK Police Force. While we strive to keep the information up to date and correct, we make no representations or
						warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the data provided by the API. Any reliance you place on such information is therefore strictly at your
						own risk. This website may contain links to other websites which are not under our control. We have no control over the nature, content, and availability of those sites.
					</p>
					<p>Last update from data.police.uk: {lastUpdatedFormatted}</p>
				</div>
			</main>
		</>
	);
}
