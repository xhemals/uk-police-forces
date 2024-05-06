export const getServerSideProps = async ({ res }) => {
	const response = await fetch(`${process.env.website}/api/all-urls`);
	const posts = await response.json();

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${posts
				.map(
					(post) => `
                <url>
                    <loc>${`${process.env.website}${post}`}</loc>
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
