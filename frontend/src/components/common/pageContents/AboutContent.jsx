import React from "react";
import SpotlightCard from "../SpotlightCard";

// Custom Team Member Card Component
const TeamMemberCard = ({ name, title, handle, avatarUrl, githubUrl }) => {
  return (
    <div
      className="group relative w-full max-w-[180px] mx-auto cursor-pointer"
      onClick={() => window.open(githubUrl, "_blank")}
    >
      <div className="relative rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-sky-400/30 group-hover:ring-sky-400/60 transition-all duration-300">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/80?text=" + name.charAt(0);
            }}
          />
        </div>

        {/* Name */}
        <h3 className="text-center text-sm font-semibold text-sky-300 mb-1 group-hover:text-sky-200 transition-colors duration-300">
          {name}
        </h3>

        {/* Title */}
        <p className="text-center text-xs text-slate-400 mb-2 group-hover:text-slate-300 transition-colors duration-300">
          {title}
        </p>

        {/* GitHub Handle */}
        <div className="text-center">
          <span className="text-xs text-slate-500 group-hover:text-sky-400 transition-colors duration-300">
            @{handle}
          </span>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300 pointer-events-none" />
      </div>
    </div>
  );
};

export default function AboutContent() {
  return (
    <main className="relative min-h-screen text-slate-200">
      {/* About Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
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
          className="custom-spotlight-card hover:scale-[1.02] transition-all duration-300"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <div>
            <h2 className="text-xl font-semibold text-sky-300 mb-3 transition-colors duration-300">
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
          className="custom-spotlight-card hover:scale-[1.02] transition-all duration-300"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <div>
            <h2 className="text-xl font-semibold text-sky-300 mb-3 transition-colors duration-300">
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
          className="custom-spotlight-card hover:scale-[1.02] transition-all duration-300"
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10 justify-items-center max-w-6xl mx-auto px-4 mt-6">
            <TeamMemberCard
              name="Prince Sharma"
              title="Software Engineer"
              handle="princesharma2004"
              avatarUrl="https://github.com/princesharma2004.png"
              githubUrl="https://github.com/princesharma2004"
            />

            <TeamMemberCard
              name="Yash Goyal"
              title="Software Developer"
              handle="yash825-bit"
              avatarUrl="https://github.com/yash825-bit.png"
              githubUrl="https://github.com/yash825-bit"
            />

            <TeamMemberCard
              name="Sumit Singh"
              title="Programmer"
              handle="SumitSJ-2004"
              avatarUrl="https://github.com/SumitSJ-2004.png"
              githubUrl="https://github.com/SumitSJ-2004"
            />

            <TeamMemberCard
              name="Abhishek Nayak"
              title="Programmer"
              handle="abhisheknayak7785"
              avatarUrl="https://github.com/abhisheknayak7785.png"
              githubUrl="https://github.com/abhisheknayak7785"
            />
          </div>
        </SpotlightCard>
      </section>
    </main>
  );
}

