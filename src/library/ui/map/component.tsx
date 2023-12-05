"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import { Coordinate } from "./types/Coordinate";
import { searchAddress, searchAddressByLocation } from "./utils/searchAddress";

import classNames from "classnames";
import pin from "./res/pin.svg";
import styles from "./style.module.scss";

interface Props {
	className?: string;
	center?: Coordinate;
	address?: string;
	onCenterChanged?: (coordinate: Coordinate, geocode: google.maps.GeocoderResult) => void,
	showCenterMarker?: boolean;
	initialCenter?: "center" | "address",
	mapId?: string;
	markers?: Coordinate[];
}

const DEFAULT_CENTER = {
	lat: -6.902396935560947,
	lng: 107.61875543851787
}

export function Map ({
	className,
	address = "",
	onCenterChanged = () => {},
	showCenterMarker = true,
	initialCenter = "center",
	...props
}: Props) {

	if (typeof window === "undefined") return <></>;

	// Disable on server environment
	const [ domLoaded, setDomLoaded ] = useState<boolean>(false);

	const [ addressCenter ] = useState<Coordinate>(DEFAULT_CENTER);
	const center = useMemo(() => {
		if (initialCenter === "center") {
			return props.center ? props.center : DEFAULT_CENTER;
		} 
		else if (initialCenter === "address") {
			return addressCenter;
		}
		return DEFAULT_CENTER;
	}, [props.center, addressCenter]);

	const mapRef = useRef<HTMLDivElement>(null);
	const centerRef = useRef<Coordinate>(center);


	// Google Maps API states
	const [ map, setMap ] = useState<google.maps.Map | null>(null);
	// const [ marker, setMarker ] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
	// const [ isZooming, setIsZooming ] = useState<boolean>(false);

	// Google Maps loader & libraries 
	const loader = useMemo(() => new Loader({
		apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		version: "weekly",
	}), []);
	const mapsLibrary = useMemo(async () => await loader.importLibrary("maps"), []);
	const markerLibrary = useMemo(async () => await loader.importLibrary("marker"), []);

	// Get map center details
	const getMapCenterDetails = async (center: google.maps.LatLng) => {
		const lat = center.lat();
		const lng = center.lng();
		const results = await searchAddressByLocation({ lat, lng });
		const data = results[0];
		return {
			coordinate: { lat, lng },
			data,
		}
	};

	// Set map center from address
	const setCenterFromAddress = async (mapobject: google.maps.Map) => {
		const searchResults = await searchAddress(address);
		const location = searchResults[0] as google.maps.GeocoderResult;
		if (!location) return;
		const coordinate = {
			lat: location.geometry.location.lat(),
			lng: location.geometry.location.lng(),
		};
		// setAddressCenter(coordinate);
		mapobject.setCenter({lat: coordinate.lat, lng: coordinate.lng});
		loadMarkers(mapobject, coordinate);
	};

	// Load map
	const loadMap = async () => {
		if (!mapRef.current) return;
		const { Map } = await mapsLibrary;
		// const AdvancedMarkerElement = (await markerLibrary).AdvancedMarkerElement;
		const mapObject = new Map(mapRef.current, {
			center,
			zoom: 16,
			disableDefaultUI: true,
			zoomControl: true,
			mapId: props.mapId,
		});
		mapObject.addListener("dragend", async () => {
			const center = mapObject.getCenter();
			if (!center) return;
			const { coordinate, data } = await getMapCenterDetails(center);
			onCenterChanged(coordinate, data);
		});
		mapObject.addListener("zoom_changed", async () => {
			const zoomEndListener = mapObject.addListener("idle", async () => {
				google.maps.event.removeListener(zoomEndListener);
				const center = mapObject.getCenter();
				if (!center) return;
				const { coordinate, data } = await getMapCenterDetails(center);
				onCenterChanged(coordinate, data);
			});
		});
		setMap(mapObject);
		if (initialCenter === "address") setCenterFromAddress(mapObject);
		else loadMarkers(mapObject, center);
	};

	// Load markers
	const loadMarkers = async (mapobject: google.maps.Map, coordinate: Coordinate) => {
		if (initialCenter === "address") {
			const area = document.createElement("div");
			area.className = styles.AreaPin;
			new (await markerLibrary).AdvancedMarkerElement({
				map: mapobject,
				position: { lat: coordinate.lat, lng: coordinate.lng },
				content: area,
			});
		}
		if (props.markers && props.markers.length > 0) {
			for (let item of props.markers) {
				new (await markerLibrary).AdvancedMarkerElement({
					map: mapobject,
					position: { lat: item.lat, lng: item.lng },
				});
			}
		}
	};

	// Initialize component
	useEffect(() => {
		if (typeof window !== "undefined") setDomLoaded(true);
	}, [window]);

	useEffect(() => {
		if (domLoaded) {
			loadMap();
		}
	}, [domLoaded]);

	useEffect(() => {
		if (centerRef.current !== null && center !== centerRef.current) {
			centerRef.current = center;
			if (map) {
				map.setCenter(new google.maps.LatLng(center.lat, center.lng));
			}
		}
	}, [center]);

	// Disable on Server environment
	if (!domLoaded) return <></>;

	// Render UI
	return (
		<div className={classNames(styles.MapContainer, className)}>
			<div className={styles.Map} ref={mapRef} />
			{showCenterMarker && <div className={styles.Pin}>
				<div className={styles.PinImage}>
					<img src={pin} width={48} height={48} alt="" />
				</div>
			</div>}
		</div>
	);

}