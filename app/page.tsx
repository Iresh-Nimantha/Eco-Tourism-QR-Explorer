// pages/index.tsx
import Head from "next/head";

import Navbar from "../landing/Navbar";
import HeroSection from "../landing/HeroSection";
import HowItWorksSection from "../landing/HowItWorksSection";
import AboutUsSection from "../landing/AboutUsSection";

import Footer from "../landing/Footer"; // 1. Import the new component
import EcoExplorerChat from "./admin/components/ChatWidget";
import ContactForm from "../landing/ContactForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Eco Tourism</title>
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>
      <div className="bg-white overflow-auto hide-scrollbar h-screen">
        <Navbar />
        <HeroSection />
        <HowItWorksSection />
        <AboutUsSection />
        <ContactForm />
        <EcoExplorerChat />
        <Footer />
      </div>
    </>
  );
}
// export async function getStaticProps() {
//   return {
//     props: {}, // No props needed for client-side component
//   };
// }
