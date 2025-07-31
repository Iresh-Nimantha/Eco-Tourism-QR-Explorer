// src/app/places/[placeId]/page.tsx
import { getPlaceData } from "@/src/lib/getPlaceData";
import Image from "next/image";
import ClientNavbar from "@/components/ClientNavbarWrapper";

type PlaceProps = {
  params: {
    placeId: string;
  };
};

export default async function PlaceDetail({ params }: PlaceProps) {
  const place = await getPlaceData(params.placeId);

  if (!place) {
    return (
      <div className="p-10 text-red-500">
        <h1 className="text-2xl font-bold">Place not found</h1>
        <p>The place ID "{params.placeId}" does not exist in the database.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <ClientNavbar />

      {/* Space below fixed navbar */}
      <div style={{ paddingTop: "74px" }}>
        {/* Image Section */}
        {place.imageUrl && (
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] relative px-[10px]">
            {place.imageUrl.includes("firebasestorage.googleapis.com") ? (
              <Image
                src={place.imageUrl}
                alt={place.name}
                width={750}
                height={400}
                className="rounded-lg shadow w-full h-full object-cover"
              />
            ) : (
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover rounded-lg shadow"
              />
            )}
          </div>
        )}

        {/* Content Section with responsive spacing */}
        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {place.locationName || place.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {place.description}
          </p>
        </div>
      </div>
    </div>
  );
}
