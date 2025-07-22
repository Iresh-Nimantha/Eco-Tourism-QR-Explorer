import React, { useState } from "react";
import UpdateLocationForm from "./UpdateLocationForm";

type DashboardItemCardProps = {
  item: {
    id: string;
    locationName: string;
    description: string;
    tags: string;
    credit: string;
    customFilename: string;
  };
  onDelete: () => void;
};

export default function DashboardItemCard({
  item,
  onDelete,
}: DashboardItemCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [itemState, setItemState] = useState(item);

  return (
    <>
      <div className="border rounded-lg flex flex-col md:flex-row md:items-center justify-between px-6 py-4 shadow-sm bg-white">
        <div>
          <div className="font-bold text-lg mb-2">{itemState.locationName}</div>
          <div className="mb-1 text-sm text-gray-500">{itemState.tags}</div>
          <div className="mb-2 text-gray-700">{itemState.description}</div>
          {itemState.customFilename && !imgErr ? (
            <img
              src={`/uploads/${itemState.customFilename}`}
              alt={itemState.locationName}
              className="w-full h-48 object-cover rounded mt-2 border-2"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center rounded mt-2 border-2 bg-gray-50 text-gray-400">
              No image
            </div>
          )}
          {itemState.credit && (
            <div className="text-xs text-gray-400">
              Credit: {itemState.credit}
            </div>
          )}
        </div>
        <div className="mt-2 md:mt-0 space-x-4">
          <button
            className="border rounded-full px-6 py-1 text-gray-600 hover:bg-gray-100 transition"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="border rounded-full px-6 py-1 text-blue-600 hover:bg-blue-50 transition"
            onClick={() => setEditOpen(true)}
          >
            Edit
          </button>
        </div>
      </div>
      {editOpen && (
        <UpdateLocationForm
          item={itemState}
          onClose={() => setEditOpen(false)}
          onUpdate={(updated) => {
            setItemState(updated);
            setEditOpen(false);
            setImgErr(false);
          }}
        />
      )}
    </>
  );
}
