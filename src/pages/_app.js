import React from "react";
import RootLayout from "@/app/layout";
import "@/components/layouts/header/header.css";
import "@/components/layouts/footer/footer.css";
import Footer from "@/components/layouts/footer/footer";
import { DbLastUpdated } from "@/functions/data-calls";
import Header from "@/components/layouts/header/header";

function MyApp({ Component, pageProps, lastUpdated }) {
	return (
		<>
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
