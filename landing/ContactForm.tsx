"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser"; // or "@emailjs/browser"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

    try {
      await emailjs.send(serviceId, templateId, formData, publicKey);
      MySwal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for reaching out. We'll get back to you soon.",
        confirmButtonColor: "#10b981",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 "
      id="contact"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl px-6 py-10 sm:px-10 sm:py-14 border border-emerald-100 flex flex-col gap-7"
        style={{ minWidth: 300 }}
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-emerald-900 mb-2 text-center">
          Contact Us
        </h2>
        <p className="text-center text-emerald-700 text-base sm:text-lg mb-2">
          We'd love to hear from you. Fill out this form and we’ll get in touch!
        </p>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-800 shadow-sm w-full bg-emerald-50 focus:bg-white transition outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-800 shadow-sm w-full bg-emerald-50 focus:bg-white transition outline-none"
        />

        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-800 shadow-sm w-full bg-emerald-50 focus:bg-white transition resize-none outline-none"
        />

        <button
          type="submit"
          disabled={sending}
          className={`mt-2 w-full py-3 rounded-xl font-bold text-lg text-white border-white/10 bg-emerald-900/90 shadow-lg backdrop-blur-md dark:bg-emerald-900/95 ${
            sending ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
          }`}
        >
          {sending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
