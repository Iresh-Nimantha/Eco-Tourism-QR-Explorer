import React from "react";
import ExplorePage from "./explore";
import Navbar from "@/landing/Navbar";
import EcoTourismChatWidget from "../admin/components/ChatWidget";

export default function page() {
  return (
    <div>
      <div className="pb-16  hide-scrollbar">{/* <Navbar /> */}</div>
      <EcoTourismChatWidget />
      <ExplorePage />
    </div>
  );
}
