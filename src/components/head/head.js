import Head from "next/head";
import Script from "next/script";

export function ForceHead({ force }) {
	return (
		<Head>
			<title>{force.name}</title>
			{force.description ? <meta name="description" content={force.description.replace(/<[^>]+>/g, "")} /> : null}
		</Head>
	);
}

export function Scripts() {
	return <Script src="https://kit.fontawesome.com/c4b491e14f.js" crossorigin="anonymous"></Script>;
}
