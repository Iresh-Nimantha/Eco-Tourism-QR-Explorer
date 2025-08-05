import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../app/lib/config";
import { LocationData } from "@/landing/explore/places-grid/types";

/**
 * Fetch related places by district or tags excluding the current place.
 * @param district string - district name
 * @param tagsCSV string - comma-separated tags string
 * @param excludePlaceId string - placeId to exclude from results
 * @param limitCount number - max number of results (default 4)
 */
export async function getPlacesByDistrictOrTag(
  district: string,
  tagsCSV: string,
  excludePlaceId: string,
  limitCount = 4
): Promise<LocationData[]> {
  const tags = tagsCSV
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const placesRef = collection(db, "locations");

  // Query places by district
  const qDistrict = query(
    placesRef,
    where("district", "==", district),
    limit(limitCount + 1) // fetch one extra to filter out current place if needed
  );

  const snapshotDistrict = await getDocs(qDistrict);
  let candidates: LocationData[] = snapshotDistrict.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<LocationData, "id">),
  }));

  // If not enough candidates, fetch places by tags (client-side filtering due to Firestore limitations)
  if (candidates.length < limitCount && tags.length > 0) {
    const qTags = query(placesRef, limit(limitCount + 10)); // fetching some extra to filter locally
    const snapshotTags = await getDocs(qTags);

    const tagCandidates = snapshotTags.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LocationData, "id">),
      }))
      .filter((place) => {
        if (!place.tags) return false;
        const placeTags = place.tags.toLowerCase();
        return tags.some((tag) => placeTags.includes(tag));
      });

    candidates = candidates.concat(tagCandidates);
  }

  // Exclude current place & remove duplicates
  const uniqueCandidatesMap = new Map<string, LocationData>();
  for (const place of candidates) {
    if (place.id !== excludePlaceId && !uniqueCandidatesMap.has(place.id)) {
      uniqueCandidatesMap.set(place.id, place);
    }
  }

  // Return up to limitCount places
  return Array.from(uniqueCandidatesMap.values()).slice(0, limitCount);
}
