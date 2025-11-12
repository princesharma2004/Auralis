import React from "react";
import MainLayout from "../layouts/MainLayout";
import Aurora from "../components/common/Aurora";

export default function About() {
  return (
    <MainLayout>
      <main className="relative min-h-screen text-slate-200 overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0}
            amplitude={0.6}
            speed={2}
          />
        </div>

        {/* Black lower wave overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black rounded-t-[40%]" />

        {/* About Section */}
        <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold font-extrabold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
            About Us
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-3xl text-slate-100 text-[16px] leading-relaxed">
            <strong className="text-sky-300">Auralis Job Portal</strong> is an
            AI-powered hiring platform built to connect the right candidates
            with the right opportunities. Moving beyond traditional
            keyword-based job searches, Auralis uses{" "}
            <span className="text-sky-400 font-medium">
              intelligent resume–job matching
            </span>{" "}
            to analyze skills, experience, and job descriptions — ensuring
            relevance, fairness, and efficiency in every match.
          </p>

          {/* Divider */}
          <div className="mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent"></div>

          {/* Mission */}
          <div className="mt-14 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-8 max-w-3xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-sky-300 mb-3">
              Our Mission
            </h2>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              Our mission is to transform the recruitment landscape through{" "}
              <span className="text-sky-400 font-medium">
                Artificial Intelligence
              </span>
              . Auralis aims to make hiring faster, smarter, and fairer —
              helping recruiters find the perfect candidates effortlessly, and
              enabling job seekers to discover roles that truly match their
              potential.
            </p>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
