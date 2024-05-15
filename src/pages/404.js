// pages/404.js
import Link from "next/link";
import React from "react";

export default function Custom404() {
	return (
		<main style={{ textAlign: "center" }}>
			<h1>404 - Page Not Found</h1>
			<h1>
				<Link href="/">Home</Link>
			</h1>
		</main>
	);
}
