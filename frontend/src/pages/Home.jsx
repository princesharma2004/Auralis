import React from "react";
import MainLayout from "../layouts/MainLayout";
import Aurora from "../components/common/Aurora";
import TextType from "../components/common/TextType";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Aurora Background */}
      <div className="bg-black absolute inset-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0}
          amplitude={0.6}
          speed={2}
        />
      </div>

      {/* Overlay Text */}
      <div className="flex flex-col items-center justify-center h-screen text-center text-white relative z-10">
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
          Welcome to Auralis
        </h1>

        <TextType
          text={[
            "Discover your next opportunity in a world of innovation and creativity.",
            "A Platform Where Intelligence Meets Opportunity.",
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className="text-blue-400"
        />

        <button
          onClick={() => navigate("/signup")}
          className="group mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-white group-hover:text-blue-400">
            Get Started
          </span>
          <span className="text-white transform translate-x-0 opacity-15 group-hover:translate-x-2 group-hover:opacity-100 group-hover:text-blue-400 transition-all duration-300">
            →
          </span>
        </button>
      </div>
    </MainLayout>
  );
}
