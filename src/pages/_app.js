import React from "react";
import RootLayout from "@/app/layout";
import "@/components/layouts/header/header.css";
import "@/components/layouts/footer/footer.css";
import Footer from "@/components/layouts/footer/footer";
import { DbLastUpdated } from "@/functions/data-calls";
import Header from "@/components/layouts/header/header";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps, lastUpdated }) {
	return (
		<>
			<DefaultSeo
				openGraph={{
					images: [
						{
							url: "/api/og",
							alt: "UK Police Force Information Logo",
						},
					],
				}}
			/>
			<Analytics />
			<Header />
			<RootLayout>
				<Component {...pageProps} />
			</RootLayout>
			<Footer lastUpdated={lastUpdated} />
		</>
	);
}

MyApp.getInitialProps = async () => {
	const result = await DbLastUpdated();
	return { lastUpdated: result.date };
};

export default MyApp;
