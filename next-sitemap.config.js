/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.website,
	generateRobotsTxt: true,
	exclude: ["/api/*", "/server-sitemap.xml"],
	sitemapSize: 500,
	robotsTxtOptions: {
		additionalSitemaps: [
			`${process.env.website}/server-sitemap.xml`, // <==== Add here
		],
		policies: [
			{
				userAgent: "*",
				allow: "/",
				disallow: "/api",
			},
		],
	},
};
