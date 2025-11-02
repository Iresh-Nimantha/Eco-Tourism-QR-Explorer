import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/lib/firebase";
import { PlaceWithImage, PlaceData } from "@/src/types/place";

export const getPlaceData = async (
  placeId: string
): Promise<PlaceWithImage | null> => {
  const docRef = doc(db, "locations", placeId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data() as PlaceData;
  const customFilename = data.customFilename;

  let imageUrl: string | null = null;

  // Case 1: Full external URL
  if (customFilename?.startsWith("http")) {
    imageUrl = customFilename;
  }

  // Case 2: Firebase-hosted image
  else if (customFilename) {
    imageUrl = `https://firebasestorage.googleapis.com/v0/b/eco-tourism-qr-explorer.appspot.com/o/places%2F${encodeURIComponent(
      customFilename
    )}?alt=media`;
  }

  return {
    ...data,
    imageUrl,
  };
};
