// "use client";
// import { useRef, useState } from "react";

// type FormState = {
//   locationName: string;
//   tags: string;
//   description: string;
//   credit: string;
// };

// export default function AddLocationForm({ onClose }: { onClose: () => void }) {
//   const [image, setImage] = useState<File | null>(null);
//   const [generatedName, setGeneratedName] = useState<string>("");
//   const [message, setMessage] = useState("");
//   const [form, setForm] = useState<FormState>({
//     locationName: "",
//     tags: "",
//     description: "",
//     credit: "",
//   });
//   const imageInputRef = useRef<HTMLInputElement>(null);

//   function generateImageName(file: File) {
//     const ext = file.name.split(".").pop() || "png";
//     const now = new Date();
//     const pad = (n: number) => n.toString().padStart(2, "0");
//     const year = now.getFullYear();
//     const month = pad(now.getMonth() + 1);
//     const day = pad(now.getDate());
//     const hour = pad(now.getHours());
//     const min = pad(now.getMinutes());
//     const sec = pad(now.getSeconds());
//     const rand = Math.floor(Math.random() * 10000);
//     return `image_${year}${month}${day}_${hour}${min}${sec}_${rand}.${ext}`;
//   }

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setImage(file);
//     if (file) {
//       const newName = generateImageName(file);
//       setGeneratedName(newName);
//       setMessage(`Selected: ${file.name} ➔ Will be saved as: ${newName}`);
//     } else {
//       setGeneratedName("");
//       setMessage("");
//     }
//   };

//   // Handle text inputs
//   const handleInput = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!image || !generatedName) {
//       setMessage("Please select an image.");
//       return;
//     }

//     // Log only the required fields
//     console.log("Form Data to Upload:", {
//       locationName: form.locationName,
//       description: form.description,
//       customFilename: generatedName,
//       credit: form.credit,
//       tags: form.tags,
//     });

//     try {
//       const formData = new FormData();
//       formData.append("file", image);
//       formData.append("customFilename", generatedName);
//       formData.append("locationName", form.locationName);
//       formData.append("tags", form.tags);
//       formData.append("description", form.description);
//       formData.append("credit", form.credit);

//       const res = await fetch("/api/adminupload", {
//         method: "POST",
//         body: formData,
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         setMessage("Upload failed: " + text);
//       } else {
//         setMessage("Location and image uploaded successfully!");
//         setImage(null);
//         setGeneratedName("");
//         setForm({ locationName: "", tags: "", description: "", credit: "" });
//         if (imageInputRef.current) imageInputRef.current.value = "";
//       }
//     } catch (error) {
//       setMessage("Error uploading file.");
//     }
//   };

//   return (
//     <div className="min-h-screen min-w-full bg-white p-0 m-0 relative">
//       <button
//         className="mb-8 text-gray-500 text-lg font-normal w-fit hover:underline"
//         type="button"
//         onClick={onClose}
//       >
//         &lt; Back
//       </button>
//       <h2 className="text-2xl font-normal text-gray-700 mb-8 mx-auto">
//         Add a Location
//       </h2>
//       <form
//         className="w-full max-w-xl mx-auto flex flex-col space-y-4"
//         onSubmit={onSubmit}
//       >
//         <input
//           type="text"
//           placeholder="Name of the Location"
//           className="border border-gray-300 bg-gray-200 px-4 py-2 placeholder-gray-500 text-gray-700"
//           name="locationName"
//           value={form.locationName}
//           onChange={handleInput}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Tags or specialty of the Location"
//           className="border border-gray-300 bg-gray-200 px-4 py-2 placeholder-gray-500 text-gray-700"
//           name="tags"
//           value={form.tags}
//           onChange={handleInput}
//         />
//         <textarea
//           placeholder="Location Description"
//           className="border border-gray-300 bg-gray-200 px-4 py-2 h-28 placeholder-gray-500 text-gray-700 resize-none"
//           name="description"
//           value={form.description}
//           onChange={handleInput}
//         />
//         <button
//           type="button"
//           className="border border-gray-300 bg-gray-200 px-4 py-2 text-left text-gray-500 text-base"
//           onClick={() => imageInputRef.current?.click()}
//         >
//           Attach Image
//         </button>
//         <input
//           type="file"
//           accept="image/*"
//           ref={imageInputRef}
//           className="hidden"
//           onChange={handleImageSelect}
//         />
//         <input
//           type="text"
//           placeholder="Picture Credit (Optional)"
//           className="border border-gray-300 bg-gray-200 px-4 py-2 placeholder-gray-500 text-gray-700"
//           name="credit"
//           value={form.credit}
//           onChange={handleInput}
//         />
//         <button
//           type="submit"
//           className="mt-6 mx-auto w-2/3 bg-gray-200 border border-gray-300 text-gray-500 px-4 py-2 text-lg"
//         >
//           Add Location
//         </button>
//         {message && (
//           <div className="mt-2 text-gray-500 text-center">{message}</div>
//         )}
//       </form>
//     </div>
//   );
// }

"use client";
import { useRef, useState } from "react";
import { addLocationToFirebase } from "../../firebase/firestoreService"; // adjust import path as needed
import HeaderNav from "./HeaderNav";

type FormState = {
  locationName: string;
  tags: string;
  description: string;
  credit: string;
};

export default function AddLocationForm({ onClose }: { onClose: () => void }) {
  const [image, setImage] = useState<File | null>(null);
  const [generatedName, setGeneratedName] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    locationName: "",
    tags: "",
    description: "",
    credit: "",
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  function generateImageName(file: File) {
    const ext = file.name.split(".").pop() || "png";
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const min = pad(now.getMinutes());
    const sec = pad(now.getSeconds());
    const rand = Math.floor(Math.random() * 10000);
    return `image_${year}${month}${day}_${hour}${min}${sec}_${rand}.${ext}`;
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const newName = generateImageName(file);
      setGeneratedName(newName);
      setMessage(`Selected: ${file.name} ➔ Will be saved as: ${newName}`);
    } else {
      setGeneratedName("");
      setMessage("");
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!image || !generatedName) {
      setMessage("Please select an image.");
      return;
    }
    setLoading(true);

    try {
      // 1. Upload the image file to /api/adminupload (saves to /public/uploads)
      const formData = new FormData();
      formData.append("file", image);
      formData.append("customFilename", generatedName);

      const imgRes = await fetch("/api/adminupload", {
        method: "POST",
        body: formData,
      });
      const imgResult = await imgRes.json();

      if (!imgRes.ok || !imgResult.success) {
        setMessage(
          "Image upload failed: " + (imgResult.error || imgRes.statusText)
        );
        setLoading(false);
        return;
      }

      // 2. After successful image upload, save metadata to Firestore
      const locationDoc = {
        locationName: form.locationName,
        description: form.description,
        customFilename: generatedName,
        credit: form.credit,
        tags: form.tags,
      };
      await addLocationToFirebase(locationDoc);

      setMessage("Location and image uploaded successfully!");
      setImage(null);
      setGeneratedName("");
      setForm({ locationName: "", tags: "", description: "", credit: "" });
      if (imageInputRef.current) imageInputRef.current.value = "";
    } catch (error) {
      setMessage("Error uploading file.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-full bg-white p-0 m-0 relative">
      <HeaderNav />
      <button
        className="mb-8 text-gray-500 text-lg font-normal w-fit hover:underline"
        type="button"
        onClick={onClose}
        disabled={loading}
      >
        &lt; Back
      </button>
      <h2 className="text-2xl font-normal text-gray-700 mb-8 mx-auto">
        Add a Location
      </h2>
      <form
        className="w-full max-w-xl mx-auto flex flex-col space-y-4"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Name of the Location"
          className="border border-gray-300 bg-gray-200 px-4 py-2 placeholder-gray-500 text-gray-700"
          name="locationName"
          value={form.locationName}
          onChange={handleInput}
          required
        />
        <input
          type="text"
          placeholder="Tags or specialty of the Location"
          className="border border-gray-300 bg-gray-200 px-4 py-2 placeholder-gray-500 text-gray-700"
          name="tags"
          value={form.tags}
          onChange={handleInput}
        />
        <textarea
          placeholder="Location Description"
          className="border border-gray-300 bg-gray-200 px-4 py-2 h-28 placeholder-gray-500 text-gray-700 resize-none"
          name="description"
          value={form.description}
          onChange={handleInput}
        />
        <button
          type="button"
          className="border border-gray-300 bg-gray-200 px-4 py-2 text-left text-gray-500 text-base"
          onClick={() => imageInputRef.current?.click()}
          disabled={loading}
        >
          Attach Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="hidden"
          onChange={handleImageSelect}
        />
        <input
          type="text"
          placeholder="Picture Credit (Optional)"
          className="border border-gray-300 bg-gray-200 px-4 py-2 placeholder-gray-500 text-gray-700"
          name="credit"
          value={form.credit}
          onChange={handleInput}
        />
        <button
          type="submit"
          className="mt-6 mx-auto w-2/3 bg-gray-200 border border-gray-300 text-gray-500 px-4 py-2 text-lg"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Location"}
        </button>
        {message && (
          <div className="mt-2 text-gray-500 text-center">{message}</div>
        )}
      </form>
    </div>
  );
}
