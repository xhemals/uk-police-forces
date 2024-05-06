/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.website || "https://example.com",
	generateRobotsTxt: true, // (optional)
	exclude: ["/api/*", "/server-sitemap.xml"],
	sitemapSize: 500,
	robotsTxtOptions: {
		additionalSitemaps: [
			`${process.env.website}/server-sitemap.xml`, // <==== Add here
		],
	},
};
