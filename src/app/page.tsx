import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="w-full h-full flex items-center justify-center text-black text-[100px] border-purple-500 border-[5px]">
      <Link
        href="/invited"
        className="border-purple-300 hover:border-purple-600 transition-colors duration-300 border-[1px] hover:border-[2px] rounded-full px-10"
      >
        <button type="button">초대장</button>
      </Link>
    </div>
  );
}
