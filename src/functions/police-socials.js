import { SocialIcon, networkFor } from "react-social-icons";

export function PoliceSocials({ socialUrl }) {
	const url = new URL(socialUrl);
	let domain = "";
	const lowerUrl = socialUrl.toLowerCase();
	if (lowerUrl.includes("rss") || lowerUrl.includes("xml")) {
		domain = "rss";
	} else {
		domain = url.hostname.split(".").slice(-2, -1)[0];
	}
	return <SocialIcon network={domain} aria-label={domain} as="div" href="#" style={{ width: 30, height: 30 }} />;
}
