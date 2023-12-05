import { Loader } from "@googlemaps/js-api-loader";
import { Location } from "@/library/interfaces";

export async function searchAddress(address: string) {

	const loader = new Loader({
		apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		version: "weekly",
	});

	const result = await loader.importLibrary("geocoding");
	const geocoder = new result.Geocoder();
	const { results } = await geocoder.geocode({
		address,
		componentRestrictions: {
			country: "ID",
		}
	});

	return results;

}

export async function searchAddressByLocation(location: Location) {

	const loader = new Loader({
		apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		version: "weekly",
	});

	const result = await loader.importLibrary("geocoding");
	const geocoder = new result.Geocoder();
	const { results } = await geocoder.geocode({
		location: new google.maps.LatLng(location.lat, location.lng),
	});

	return results;

}