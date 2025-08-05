import React, { Suspense } from "react";
import ExplorePage from "./explore";
import Navbar from "@/landing/Navbar";
import EcoTourismChatWidget from "../admin/components/ChatWidget";

export default function Page() {
  return (
    <div>
      <div className="pb-16 hide-scrollbar">{/* <Navbar /> */}</div>
      <EcoTourismChatWidget />
      <Suspense fallback={<div>Loading explore page...</div>}>
        <ExplorePage />
      </Suspense>
    </div>
  );
}
