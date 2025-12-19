"use client";

import { useEffect } from "react";

export default function KakaoProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const Kakao = (window as any).Kakao;
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

    if (!Kakao || !key) return;

    if (!Kakao.isInitialized()) {
      Kakao.init(key);
      console.log("✅ Kakao initialized");
    }
  }, []);

  return null;
}
