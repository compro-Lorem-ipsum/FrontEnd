/**
 * Decodes an encoded polyline string into an array of [latitude, longitude] coordinates.
 * This is an implementation of the Google Maps Encoded Polyline Algorithm Format.
 * 
 * @param encoded - The encoded polyline string
 * @returns Array of [lat, lng] arrays
 */
export const decodePolyline = (encoded: string): [number, number][] => {
  if (!encoded) return [];
  
  const poly: [number, number][] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    
    // Decode latitude
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    
    // Decode longitude
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    const finalLat = lat / 1e5;
    const finalLng = lng / 1e5;
    poly.push([finalLat, finalLng]);
  }

  return poly;
};
