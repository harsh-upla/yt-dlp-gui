import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <>
      <nav className="h-[10vh] text-white bg-[#6a2727] flex items-center justify-around">
        <Link href={"/"} className="headtext text-4xl font-bold flex items-center justify-center w-fit ">
          Yt-Dlp
        </Link>
        <Link className="bg-[#795050] px-5 py-1  flex gap-3 items-center rounded-lg" href={"/github"}>
          <img src="/github.svg" className="size-12" alt="github" />
          <span className="text-xl">Github</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
