import axios from "axios";

export const getServerSideProps = async ({ res }) => {
	const response = await axios.get("https://data.police.uk/api/forces");
	const forces = response.data;

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${forces
				.map(
					(force) => `
				<url>
					<loc>${`http://localhost:3000/forces/${force.id}`}</loc>
					<lastmod>${new Date().toISOString()}</lastmod>
					<changefreq>monthly</changefreq>
					<priority>0.7</priority>
				</url>
			`
				)
				.join("")}
		</urlset>
	`;

	res.setHeader("Content-Type", "text/xml");
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
};

const ServerSitemap = () => {};

export default ServerSitemap;
