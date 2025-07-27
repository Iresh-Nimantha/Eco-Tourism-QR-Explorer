'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LocationData } from './types';
import PlaceCard from './placeCard';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ExplorePage() {
  const [places, setPlaces] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Web default

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(8);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      const querySnapshot = await getDocs(collection(db, 'locations'));
      const data: LocationData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<LocationData, 'id'>)
      }));
      setPlaces(data);
      setLoading(false);
    };

    fetchPlaces();
  }, []);

  if (loading) return <LoadingSpinner />;

  const filteredPlaces = places.filter((place) => {
    const search = searchTerm.toLowerCase();
    return (
      place.locationName.toLowerCase().includes(search) ||
      place.description?.toLowerCase().includes(search) ||
      place.district?.toLowerCase().includes(search) ||
      place.tags?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlaces = filteredPlaces.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div className="p-4">
        {/* 🔠 Title */}
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
          Explore Eco-Tourism Places
        </h2>

        {/* 🔍 Search */}
        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Search by name, district or keyword..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* 🗂️ Cards */}
        <div className="flex flex-wrap justify-center gap-4 box-border mx-auto max-w-screen-lg px-8">
          {paginatedPlaces.map((place) => (
            <div
              key={place.id}
              className="w-full max-[639px]:basis-[47%] sm:basis-[48%] lg:basis-[23%] flex"
            >
              <div className="w-full">
                <PlaceCard place={place} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📄 Pagination */}
      <div className="mt-auto py-6">
        <div className="flex justify-center items-center space-x-4 text-lg font-medium">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="disabled:text-gray-300"
          >
            ←
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-2 ${
                currentPage === index + 1
                  ? 'text-black font-bold underline'
                  : 'text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="disabled:text-gray-300"
          >
            →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
