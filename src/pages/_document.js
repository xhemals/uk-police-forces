import Header from "@/components/layouts/header/header";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<script async src="https://kit.fontawesome.com/c4b491e14f.js" crossOrigin="anonymous"></script>
				</Head>
				<body>
					<Header />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
