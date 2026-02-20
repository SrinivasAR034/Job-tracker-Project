"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#F7F6F3] px-4 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#111111] leading-tight tracking-tight">
          Stop Missing The Right Jobs.
        </h1>

        <p className="font-sans text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Precision-matched job discovery delivered daily at 9AM.
          <br />
          No noise. Just relevance.
        </p>

        <div className="pt-4">
          <Link href="/settings">
            <Button className="h-12 px-8 text-base bg-[#8B0000] hover:bg-[#8B0000]/90 text-white rounded-full transition-all hover:scale-105 shadow-md">
              Start Tracking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
