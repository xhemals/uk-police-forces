// const headerStyle = {
// 	backgroundColor: "blue",
// 	color: "white",
// 	width: "100%",
// 	height: "50px",
// };

import Link from "next/link";
import "./header.css";

const Header = () => (
	<header className="Header">
		<Link href="/">Home</Link>
	</header>
);

export default Header;
