import React from "react";
import MainLayout from "../layouts/MainLayout";
import Aurora from "../components/common/Aurora";
import SpotlightCard from "../components/common/SpotlightCard";
import ProfileCard from "../components/common/ProfileCard";

export default function About() {
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
        <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
          <h1 className="text-3xl md:text-4xl text-center bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
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
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div>
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
          </SpotlightCard>

          {/* Divider */}
          <div className="mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent"></div>

          {/* Story */}
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div>
              <h2 className="text-xl font-semibold text-sky-300 mb-3">
                Our Story
              </h2>
              <p className="text-slate-300 text-[15px] leading-relaxed">
                The journey of{" "}
                <span className="text-sky-400 font-medium">Auralis</span> began
                with a vision — to bridge the gap between talent and
                opportunity. What started as a simple idea evolved into an
                intelligent platform where{" "}
                <span className="text-sky-400 font-medium">
                  AI meets human potential
                </span>{" "}
                empowering recruiters and candidates alike to connect faster,
                smarter, and more meaningfully than ever before.
              </p>
            </div>
          </SpotlightCard>

          {/* Divider */}
          <div className="mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent"></div>

          {/* Cast */}
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div>
              <h2 className="text-xl font-semibold text-sky-300 mb-3">
                Our Cast
              </h2>
              <p className="text-slate-300 text-[15px] leading-relaxed">
                Behind <span className="text-sky-400 font-medium">Auralis</span>{" "}
                stands a passionate team of innovators, engineers, and dreamers
                dedicated to redefining how the world connects talent with
                opportunity. Our{" "}
                <span className="text-sky-400 font-medium">Cast</span> is driven
                by creativity, powered by AI, and united by a single vision — to
                make recruitment more human, more intelligent, and more
                impactful.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center">
              <ProfileCard
                name="Prince Sharma"
                title="Software Engineer"
                handle="princesharma2004"
                contactText="Github Profile"
                iconUrl="https://github.com/princesharma2004.png"
                avatarUrl="https://github.com/princesharma2004.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() =>
                  window.open("https://github.com/princesharma2004", "_blank")
                }
              />

              <ProfileCard
                name="Yash Goyal"
                title="Frontend Developer"
                handle="yash825-bit"
                contactText="Github Profile"
                iconUrl="https://github.com/yash825-bit.png"
                avatarUrl="https://github.com/yash825-bit.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() =>
                  window.open("https://github.com/yash825-bit", "_blank")
                }
              />

              <ProfileCard
                name="Sumit Singh"
                title="Frontend Developer"
                handle="SumitSJ-2004"
                contactText="Github Profile"
                iconUrl="https://github.com/SumitSJ-2004.png"
                avatarUrl="https://github.com/SumitSJ-2004.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() =>
                  window.open("https://github.com/SumitSJ-2004", "_blank")
                }
              />
            </div>
          </SpotlightCard>
        </section>
      </main>
    </MainLayout>
  );
}
