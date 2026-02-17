import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

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
    // console.log("quality not available");
    return new Response(
      JSON.stringify({ message: "Selected quality not available" })
    );
  }

  const title = info.videoDetails.title
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "_");

  const nodeStream = ytdl(url, {
    quality: itag,
  });

  let okStream = Readable.toWeb(nodeStream);

  return new Response(okStream, {
    headers: {
      "Content-Disposition": `attachment; filename="${title}.mp4"`,
      "Content-Type": "video/mp4",
      "Content-Length": format.contentLength,
    },
  });
}
