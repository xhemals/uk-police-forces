import { ImageResponse } from "@vercel/og";

export const config = {
	runtime: "edge",
};

export default async function handler(request) {
	const { searchParams } = request.nextUrl;
	const title = searchParams.get("title");
	if (!title) {
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				background: "#232F3A",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				fontSize: 32,
				fontWeight: 600,
			}}>
			<img width="644" src={`${process.env.website}/logo-full-removebg.png`} />
		</div>;
	}

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					fontSize: 60,
					color: "white",
					background: "#232F3A",
					width: "100%",
					height: "100%",
					paddingTop: 50,
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
				}}>
				<img width="644" src={`${process.env.website}/logo-full-removebg.png`} />
				<p style={{ width: "800px", padding: "1rem" }}>{title}</p>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
