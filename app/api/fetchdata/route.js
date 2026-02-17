import ytdl from "@distube/ytdl-core";

export async function POST(request) {
  try {
    const body = await request.json();
    const url = body.url;

    if (!url || !ytdl.validateURL(url)) {
      return Response.json({ message: "not valid url" });
    }

    const x = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      },
    });

    // if (x) {
    return Response.json({
      success: true,
      error: false,
      message: "Data fetched successfully",
      result: x,
    });
    // } else {
    //   return Response.json({
    //     success: false,
    //     error: true,
    //     message: "some error ",
    //   });
    // }
  } catch (error) {
    console.error("Fetch error:", error.message);
    return Response.json(
      {
        success: false,
        error: true,
        message: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
