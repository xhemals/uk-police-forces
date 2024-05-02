import React from "react";
import RootLayout from "@/app/layout"; // adjust the import path as needed
import { Scripts } from "@/components/head/head";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<RootLayout>
				<Component {...pageProps} />
			</RootLayout>
		</>
	);
}

export default MyApp;
