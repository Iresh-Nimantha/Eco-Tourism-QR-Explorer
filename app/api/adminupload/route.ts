import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
const REPO = "Iresh-Nimantha/test-img-upload";
const BRANCH = "main";
const PATH = "images"; // repo folder

// Function to check if file exists in GitHub
async function checkFileExists(filename: string) {
  const url = `https://api.github.com/repos/${REPO}/contents/${PATH}/${filename}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });
  return response.ok;
}


export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const customFilename = formData.get("customFilename") as string;

  // Get additional location data
  const locationName = formData.get("locationName") as string;
  const description = formData.get("description") as string;
  const tags = formData.get("tags") as string;
  const credit = formData.get("credit") as string;

  if (!file || !customFilename) {
    return NextResponse.json(
      { success: false, error: "Missing file or filename" },
      { status: 400 }
    );
  }

  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString("base64");

    // GitHub API upload
    const githubUrl = `https://api.github.com/repos/${REPO}/contents/${PATH}/${customFilename}`;
    const githubRes = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload ${customFilename}`,
        content: base64Content,
        branch: BRANCH,
      }),
    });

    if (!githubRes.ok) {
      const data = await githubRes.json().catch(() => ({}));
      console.error("GitHub error:", data);
      return NextResponse.json(
        { success: false, error: data.message || "GitHub upload failed" },
        { status: 500 }
      );
    }

    const data = await githubRes.json();
    if (!data || !data.content) {
      return NextResponse.json(
        { success: false, error: "Invalid GitHub response" },
        { status: 500 }
      );
    }

    // Get permanent GitHub image URL
    const imageUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${PATH}/${customFilename}`;
    const githubFileUrl = data.content.html_url || "";

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        githubUrl: githubFileUrl,
        sha: data.content.sha,
        message: "Image uploaded successfully to GitHub",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
