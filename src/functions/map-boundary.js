import React from "react";
import { MapContainer, TileLayer, Polygon, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NeighbourhoodLocations } from "./api-calls";

function MapBoundary({ boundary }) {
	const bounds = L.latLngBounds(boundary);
	const center = bounds.getCenter();

	const pinIcon = L.icon({
		iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
		iconSize: [32, 32],
		iconAnchor: [16, 32],
	});

	return (
		<MapContainer bounds={bounds} style={{ height: "400px", width: "400px" }}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
			<Polygon pathOptions={{ color: "blue" }} positions={boundary} />
		</MapContainer>
	);
}

export default MapBoundary;
