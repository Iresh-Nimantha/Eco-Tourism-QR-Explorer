import { NextRequest, NextResponse } from "next/server";

// Use environment variable for API key
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

interface RequestBody {
  text?: string;
  image?: string; // Base64 encoded image string without mime prefix
}

const ECO_EXPLORER_SYSTEM_PROMPT = `
You are Eco Tourism, a friendly virtual eco-tourism guide and digital assistant for Sri Lanka's eco-tourism platform. Your personality and guidelines:

PERSONALITY:
- Friendly, knowledgeable, supportive, and eco-conscious
- Always enthusiastic about nature and sustainable travel
- Patient and helpful, never rushing users
- Use emojis occasionally to be more engaging (🌿🌍🦋🏞️🌱)

EXPERTISE:
- Sri Lankan eco-tourism sites, national parks, and natural attractions
- Wildlife, flora, and fauna identification
- Sustainable travel practices and eco-friendly tips
- Local culture and environmental conservation
- Place identification from photos

RESPONSES SHOULD:
- Be warm and welcoming
- Promote eco-friendly and responsible tourism
- Provide practical, actionable information
- Include suggestions for sustainable practices when relevant
- Be concise but informative
- Always maintain respect for local communities and environment

SPECIAL FEATURES:
- When users upload images, try to identify locations, wildlife, or plants
- Provide eco-tourism recommendations based on user interests
- Offer sustainable travel tips
- Help with platform navigation and support

Remember: You're here to empower every visitor with instant access to Sri Lanka's rich eco-tourism experiences while promoting environmental consciousness and responsible travel.
`;

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    if (!API_KEY) {
      console.error("Gemini API key is not configured");
      return NextResponse.json(
        { error: "Server configuration error: API key missing" },
        { status: 500 }
      );
    }

    // Parse request body
    const data = (await req.json()) as RequestBody;
    const { text, image } = data;

    // Validate input
    if (!text && !image) {
      return NextResponse.json(
        { error: "No text or image provided" },
        { status: 400 }
      );
    }

    const parts: Array<{
      text?: string;
      inlineData?: { mimeType: string; data: string };
    }> = [];

    // Add system prompt
    parts.push({ text: ECO_EXPLORER_SYSTEM_PROMPT });

    // Add user text if provided
    if (text) {
      parts.push({ text: `User message: ${text}` });
    }

    // Add image analysis prompt and data if provided
    if (image) {
      // Attempt to infer mimeType from base64 data or default to common formats
      const mimeType = image.startsWith("/9j/") ? "image/jpeg" : "image/png"; // Basic heuristic
      parts.push({
        text: "Please analyze this image and provide eco-tourism insights, location identification if possible, or relevant information about any wildlife, plants, or natural features you can see.",
      });
      parts.push({
        inlineData: {
          mimeType,
          data: image,
        },
      });
    }

    // Make request to Gemini API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check for API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status} - ${errorText}` },
        { status: 500 }
      );
    }

    // Parse API response
    const result = await response.json();
    const reply =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hello! I'm Eco Tourism 🌿 I'm here to help you discover Sri Lanka's amazing eco-tourism experiences. How can I assist you today?";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error.name, error.message);
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
