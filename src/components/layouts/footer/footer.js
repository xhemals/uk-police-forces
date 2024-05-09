import { DbLastUpdated } from "@/functions/data-calls";
import Link from "next/link";

export default function Footer({ lastUpdated }) {
	const currentYear = new Date().getFullYear();
	const lastUpdatedFormatted = `${new Date(lastUpdated).toLocaleString("default", { month: "long" })} ${new Date(lastUpdated).getFullYear()}`;
	return (
		<footer className="footer">
			<div className="row-1">
				<div className="footer-copyright">
					&copy; {currentYear} <Link href="https://github.com/xhemals">xhemals</Link>
				</div>
				<div className="last-updated">Last updated {lastUpdatedFormatted}</div>
			</div>
			<div className="row-2">
				<div className="disclaimer">
					<p>
						Disclaimer: This website is an independent service and is not affiliated with, endorsed by, or in any way associated with the UK Police Force. <Link href="/disclaimer">Read more.</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
