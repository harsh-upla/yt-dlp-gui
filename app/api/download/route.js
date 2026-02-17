import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const url = searchParams.get("url");
    const itag = searchParams.get("itag");

    if (!url || !itag) {
      return new Response(JSON.stringify({ message: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!ytdl.validateURL(url)) {
      return new Response(JSON.stringify({ message: "Invalid URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      },
    });
    const format = info.formats.find((f) => f.itag == itag);

    if (!format) {
      return new Response(
        JSON.stringify({ message: "Selected quality not available" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const title = info.videoDetails.title
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "_");

    const videoStream = ytdl(url, {
      quality: itag,
    });

    const chunks = [];

    return new Promise((resolve) => {
      videoStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      videoStream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(
          new Response(buffer, {
            headers: {
              "Content-Disposition": `attachment; filename="${title}.mp4"`,
              "Content-Type": "video/mp4",
              "Content-Length": buffer.length,
            },
          }),
        );
      });

      videoStream.on("error", (error) => {
        resolve(
          new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }),
        );
      });
    });
  } catch (error) {
    console.error("Download error:", error.message);
    return new Response(
      JSON.stringify({ message: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
