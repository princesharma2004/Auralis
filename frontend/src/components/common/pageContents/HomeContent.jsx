import React from "react";
import TextType from "../TextType";
import { useNavigate } from "react-router-dom";

export default function HomeContent() {
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay Text */}
      <div className="flex flex-col items-center justify-center h-screen text-center text-white relative z-10 animate-fade-in-up">
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg mb-6">
          Welcome to Auralis
        </h1>

        <div className="mb-8">
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
        </div>

        <button
          onClick={() => navigate("/signup")}
          className="group mt-8 px-8 py-4 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95"
        >
          <span className="text-white group-hover:text-blue-400 transition-colors duration-300 font-medium">
            Get Started
          </span>
          <span className="text-white transform translate-x-0 opacity-15 group-hover:translate-x-2 group-hover:opacity-100 group-hover:text-blue-400 transition-all duration-300 text-xl">
            →
          </span>
        </button>
      </div>
    </>
  );
}

