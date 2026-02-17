"use client";
import { useEffect, useState } from "react";
import { MdContentPasteGo } from "react-icons/md";
import { InfinitySpin } from "react-loader-spinner";
import { FaDownload } from "react-icons/fa6";

export default function Home() {
  const [url, seturl] = useState("");
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [fetched, setfetched] = useState(false);
  const [thumbNail, setthumbNail] = useState("");
  const [title, settitle] = useState("");
  const [formats, setformats] = useState([
    {
      itag: 18,
      container: "mp4",
      quality: "360p",
      codecs: "avc1.42001E, mp4a.40.2",
      bitrate: "696.66KB",
      audioBitrate: "96KB",
    },
    {
      itag: 137,
      container: "mp4",
      quality: "1080p",
      codecs: "avc1.640028",
      bitrate: "4.53MB",
      audioBitrate: null,
    },
    {
      itag: 248,
      container: "webm",
      quality: "1080p",
      codecs: "vp9",
      bitrate: "2.52MB",
      audioBitrate: null,
    },
    {
      itag: 136,
      container: "mp4",
      quality: "720p",
      codecs: "avc1.4d4016",
      bitrate: "2.2MB",
      audioBitrate: null,
    },
    {
      itag: 247,
      container: "webm",
      quality: "720p",
      codecs: "vp9",
      bitrate: "1.44MB",
      audioBitrate: null,
    },
    {
      itag: 135,
      container: "mp4",
      quality: "480p",
      codecs: "avc1.4d4014",
      bitrate: "1.1MB",
      audioBitrate: null,
    },
    {
      itag: 134,
      container: "mp4",
      quality: "360p",
      codecs: "avc1.4d401e",
      bitrate: "593.26KB",
      audioBitrate: null,
    },
    {
      itag: 140,
      container: "mp4",
      quality: null,
      codecs: "mp4a.40.2",
      bitrate: null,
      audioBitrate: "128KB",
    },
  ]);
  const [fetchedFormats, setfetchedFormats] = useState([]);
  // const [optForm, setoptForm] = useState({})
  const [selectedItag, setselectedItag] = useState("");
  const [videoURL, setvideoURL] = useState("")

  const handleFetchdata = async () => {
    if (!url) {
      seterror("not valid URL !!!");
      return;
    } else {
      seterror("");
    }

    setloading(true);
    setfetched(false);
    const res = await fetch("/api/fetchdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    let response = await res.json();

    if (response) {
      // console.log(response.result);
      // console.log(response.result.videoDetails.title); //works
      let details = response.result.videoDetails;
      // console.log(details);
      // console.log(details.thumbnails.at(-1).url);
      setthumbNail(details.thumbnails.at(-1).url);
      settitle(details.title);
      // console.log(response.result.formats);
    } else {
      seterror("response not fetched");
      return;
    }
    let rawFormats = response.result.formats;
    // .filter((item) => {
    // return (item.itag != null && item.hasVideo == true && item.hasAudio == true);
    // });
    // console.log(rawFormats);

    const hasVideoFormats = rawFormats.filter((item) => {
      return item.hasVideo === true;
    });
    const hasAudioFormats = rawFormats.filter((item) => {
      return item.hasAudio === true;
    });
    const hasFullFormats = rawFormats.filter((item) => {
      return item.hasAudio === true && item.hasVideo === true;
    });
    // console.log(
    //   "npcFormats",
    //   rawFormats.filter((item) => {
    //     return item.hasVideo === false && item.hasAudio == false;
    //   }),
    // );
    // console.log("hasvideo", hasVideoFormats);
    // console.log("hasAudio", hasAudioFormats);
    // console.log("hasFull", hasFullFormats);

    // let filteredFormats = rawFormats
    //   .map((item, index) => {
    //     return { itag: item.itag, quality: item.qualityLabel };
    //   })
    //   .filter((item) => {
    //     return item.quality != null;
    //   });

    // console.log("filteredformats",filteredFormats);

    // let availableFormats = [
    //   ...new Map(filteredFormats.map((item) => [item.itag, item])).values(),
    // ];

    // console.log(availableFormats);
    // setfetchedFormats(hasFullFormats);
    // console.log(fetchedFormats);
    setvideoURL(response.result.videoUrl)
    if (!thumbNail.length < 4 && title.length < 2) {
      setloading(false);
      setfetched(true);
    }
    
  };

  const pasteUrl = async () => {
    const text = await navigator.clipboard.readText();
    seturl(text);
  };

  const handleDownload = () => {
    if (!selectedItag) {
      seterror("select any quality !!!");
      return;
    }
    window.location.href = `/api/download?url=${encodeURIComponent(url)}&itag=${selectedItag}`;
  };

  return (
    <div className="bg-[#fadcdcb2] min-h-[90vh]">
      <h1 className="text-2xl font-bold text-center pt-5">
        Just paste the link and Watch any video without ads.
      </h1>

      <div className="pt-10">
        <div className="flex p-10 gap-3 justify-center">
          <input
            className="bg-white px-5 rounded-sm w-[40vw]"
            placeholder="Enter Link "
            onChange={(e) => {
              seturl(e.target.value);
            }}
            type="text"
            name="url"
            value={url}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFetchdata();
              }
            }}
          />
          <button
            onClick={() => {
              pasteUrl();
            }}
            className="bg-[#6a2727] text-white px-3 py-1 rounded-sm hover:bg-[#6e4242] cursor-pointer"
          >
            <MdContentPasteGo />
          </button>
          <button
            onClick={() => {
              handleFetchdata();
            }}
            className="bg-[#6a2727] text-white px-3 py-1 rounded-sm hover:bg-[#6e4242] cursor-pointer"
          >
            search
          </button>
        </div>
        <div className="text-red-500 text-center">{error}</div>
      </div>
      <div className="flex items-center justify-center flex-col">
        {loading && <InfinitySpin color="#6a2727" />}
        {!loading && fetched ? (
          <div className="flex flex-col items-center justify-center">
            <video className="w-[90vw]" src={videoURL} controls></video>
            {/* <h1 className="font-bold text-xl underline mb-5">Video Details</h1>
            <img
              className="w-xl h-80"
              src={thumbNail ?? "thumbnail not fetched"}
              alt="thumbnail not fetched !!"
            />
            <h1 className="text-2xl font-extralight">Title : {title}</h1>
            <div className="">
              <select
                className="bg-white px-4 py-1 rounded-lg"
                value={selectedItag}
                onChange={(e) => {
                  setselectedItag(e.target.value);
                }}
                name="quality"
              >
                <option value="">Select quality</option>
                {formats.length > 0 &&
                  formats.map((format) => {
                    return (
                      <option
                        className=""
                        key={format.itag}
                        value={format.itag}
                      >
                        {format.quality ?? ""}
                        {`(${format.container ?? ""})`}
                      </option>
                    );
                  })}
              </select>
              <button
                onClick={() => {
                  handleDownload();
                }}
                className="cursor-pointer flex gap-2 items-center justify-center bg-[#6a2727] rounded-lg px-4 py-1 mt-4 text-white text-xl"
              >
                Download
                <FaDownload />
              </button>
            </div> */}
          </div>
        ) : (
          <div className="">Fetched data will show here.</div>
        )}
        {/* <ul className="list-disc flex flex-col items-start justify-center">
          Please Note :<li>This only works for one video at a time ...</li>
          <li>playlist download is not supported ...</li>
          <li>
            if you face any error while loading just refresh and paste link
            again ...
          </li>
        </ul> */}
      </div>
    </div>
  );
}
