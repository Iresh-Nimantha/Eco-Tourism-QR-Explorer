"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "si", label: "සිංහල" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
];

function getTextNodes(element) {
  const textNodes = [];

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Basic filters for empty nodes or nodes inside ignored tags
        if (
          !node.nodeValue ||
          !node.nodeValue.trim() ||
          ["SCRIPT", "STYLE", "INPUT", "TEXTAREA"].includes(
            node.parentElement?.tagName
          )
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip nodes whose parent (or any ancestor) has class 'notranslate'
        let el = node.parentElement;
        while (el) {
          if (el.classList && el.classList.contains("notranslate")) {
            return NodeFilter.FILTER_REJECT;
          }
          el = el.parentElement;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    },
    false
  );

  let currentNode = walker.nextNode();
  while (currentNode) {
    textNodes.push(currentNode);
    currentNode = walker.nextNode();
  }

  return textNodes;
}

function postprocessSinhala(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function translateText(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && Array.isArray(data) && data[0]) {
      const translatedText = data[0].map((segment) => segment[0]).join("");
      return targetLang === "si"
        ? postprocessSinhala(translatedText)
        : translatedText;
    }
    return text;
  } catch (error) {
    console.error("Translation API error:", error);
    return text;
  }
}

export default function Translator() {
  const [targetLang, setTargetLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);

  async function handleTranslatePage() {
    if (targetLang === "en") {
      await Swal.fire({
        icon: "info",
        title: "Reset to English",
        timer: 1500,
        showConfirmButton: false,
        willClose: () => window.location.reload(),
      });
      return;
    }

    try {
      setIsTranslating(true);
      Swal.fire({
        title: `Translating to ${
          LANGUAGES.find((l) => l.code === targetLang)?.label || targetLang
        }...`,
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      const textNodes = getTextNodes(document.body);
      for (const node of textNodes) {
        const originalText = node.nodeValue?.trim() ?? "";
        if (originalText.length > 0) {
          node.nodeValue = await translateText(originalText, targetLang);
        }
      }

      setIsTranslating(false);
      Swal.close();
      await Swal.fire({
        icon: "success",
        title: "Translation Complete",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      setIsTranslating(false);
      Swal.fire({
        icon: "error",
        title: "Translation Failed",
        timer: 1500,
        showConfirmButton: false,
      });
      console.error(error);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        id="language-select"
        className="px-2 py-1 text-sm border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
        disabled={isTranslating}
        aria-label="Select language"
      >
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
      <button
        onClick={handleTranslatePage}
        disabled={isTranslating}
        className={`px-3 py-1 text-sm font-medium text-white rounded-md transition-colors ${
          isTranslating
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
        aria-label="Translate Page"
      >
        {isTranslating ? "Translating..." : "Translate"}
      </button>
    </div>
  );
}
