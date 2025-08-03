import React from 'react';
import { LocationData } from './types';

type Props = {
  place: LocationData;
};

export default function PlaceCard({ place }: Props) {
  return (
    <div className="w-[150px] sm:w-[160px] md:w-[180px] lg:w-[200px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">

      
      {/* 📷 Image with bottom overlay */}
      <div className="relative h-[205px] sm:h-[215px] md:h-[225px] lg:h-[235px]">
        <img
          src={`https://firebasestorage.googleapis.com/v0/b/eco-tourism-qr-explorer.appspot.com/o/${encodeURIComponent(place.customFilename)}?alt=media`}
          alt={place.locationName}
          className="w-full h-full object-cover"
        />


        {/* 🌚 Bottom Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent px-3 py-2">
          <h3 className="text-sm font-semibold text-white truncate">
            {place.locationName}
          </h3>
          <p className="text-[10px] text-gray-200 line-clamp-2">
            {place.description}
          </p>
        </div>
      </div>
    </div>
  );
}
// src={`/uploads/${place.customFilename}`}
// src={`https://firebasestorage.googleapis.com/v0/b/eco-tourism-qr-explorer.appspot.com/o/${encodeURIComponent(place.customFilename)}?alt=media`}