import Link from "next/link";
import Image from "next/image";

const Header = () => (
	<header className="Header">
		<Link href="/">
			<Image src="/logo-full-removebg.png" width="322" height="84" />
		</Link>
	</header>
);

export default Header;
