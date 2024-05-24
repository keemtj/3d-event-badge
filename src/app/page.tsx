"use client";

import React, { FormEvent, useState } from "react";

export default function MainPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `3조 외부팀 3단계 정답: ${inputValue} / 내부팀 다음 단계 문제 접속 링크: /134ekfivjfkejfij`,
      }),
    });

    if (response.ok) {
      setMessage("전송에 성공했습니다.");
    } else {
      setMessage("전송에 실패했습니다.");
    }
  };

  return (
    <div className="flex-col w-full h-full flex items-center justify-center text-black text-[100px] border-purple-500 border-[5px]">
      <div className="border-purple-300 hover:border-purple-600 transition-colors duration-300 border-[1px] hover:border-[2px] rounded-full px-10">
        INVITATION
      </div>
      <div className="text-white">{"NAHKOTKOT.DEV"}</div>
      <form
        onSubmit={handleSubmit}
        className="flex-col w-full h-full flex items-center"
      >
        <input
          className="border-[1px] border-purple-300"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
