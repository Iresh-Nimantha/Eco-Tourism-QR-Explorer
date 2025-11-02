import React from "react";
import ClientPlaceDetail from "./ClientPlaceDetail";
import { getPlaceData } from "@/src/lib/getPlaceData";
import { getPlacesByDistrictOrTag } from "@/src/lib/getPlacesByDistrictOrTag";
import { LocationData } from "@/landing/explore/places-grid/types";

type PlaceParamsObj = { placeId: string };

type Props = {
  params: Promise<PlaceParamsObj>;
};

function cleanFirestoreObject<T>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;

  if ("toDate" in obj && typeof (obj as any).toDate === "function") {
    return (obj as any).toDate().toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanFirestoreObject) as any;
  }

  const result: any = {};
  for (const key in obj) {
    result[key] = cleanFirestoreObject((obj as any)[key]);
  }
  return result;
}

export default async function PlaceDetailPage({ params }: Props) {
  const resolvedParams = await params;

  const place = await getPlaceData(resolvedParams.placeId);

  let relatedPlaces: LocationData[] = [];
  if (place) {
    relatedPlaces = await getPlacesByDistrictOrTag(
      place.district ?? "",
      place.tags ?? "",
      resolvedParams.placeId
    );
  }

  return (
    <ClientPlaceDetail
      place={cleanFirestoreObject(place)}
      relatedPlaces={relatedPlaces.map(cleanFirestoreObject)}
      placeId={resolvedParams.placeId}
    />
  );
}
