import DOMPurify from "isomorphic-dompurify";

export default function RenderHTML({ html }) {
	const cleanHtml = DOMPurify.sanitize(html);
	return <span dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
