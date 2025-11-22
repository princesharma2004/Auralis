import React from "react";
import MainLayout from "../layouts/MainLayout";
import Aurora from "../components/common/Aurora";
import SpotlightCard from "../components/common/SpotlightCard";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    id: "ai-match",
    title: "AI-Powered Matching",
    description:
      "Our advanced ML model analyzes resumes and job descriptions to rank and surface jobs that best fit a candidate's skills and experience. This intelligent matching saves time for both candidates and recruiters, ensuring more relevant connections.",
    icon: "🤖",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "dashboards",
    title: "Smart Dashboards",
    description:
      "Role-specific dashboards provide personalized recommendations, real-time application status updates, and top candidate insights at a glance. Each user gets a tailored experience designed for their needs.",
    icon: "📊",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "secure-auth",
    title: "Secure Authentication",
    description:
      "Enterprise-grade security with role-based sign-up and login. We use JWT tokens and HttpOnly cookies with best-practice session handling to keep your data safe and secure.",
    icon: "🔒",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "resume-parse",
    title: "Resume Parsing",
    description:
      "Intelligent resume parsing extracts skills, experience, and qualifications automatically. This improves match accuracy and speeds up profile setup, eliminating manual data entry.",
    icon: "📄",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "analytics",
    title: "Recruiter Analytics",
    description:
      "Comprehensive analytics dashboard tracks funnel metrics, candidate quality scores, and time-to-hire statistics. Built-in charts and export options help you make data-driven hiring decisions.",
    icon: "📈",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "collaboration",
    title: "Team Collaboration",
    description:
      "Streamline your hiring process with built-in collaboration tools. Shortlist candidates, add comments, and share profiles with your team to speed up hiring decisions and improve communication.",
    icon: "🤝",
    color: "from-teal-500 to-blue-500",
  },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <main className="relative min-h-screen text-slate-200 overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={0.6}
            speed={2}
          />
        </div>

        {/* Black lower wave overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black rounded-t-[40%]" />

        {/* Features Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg mb-4">
              Powerful Features
            </h1>
            <p className="max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed">
              Everything you need to find the right fit — for candidates and
              recruiters. Explore our intelligent features designed to transform
              the hiring experience.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {FEATURES.map((feature) => (
              <SpotlightCard
                key={feature.id}
                className="custom-spotlight-card"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-sky-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-slate-300 text-[15px] leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Divider */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent mx-auto mb-12"></div>

          {/* CTA Section */}
          <SpotlightCard
            className="custom-spotlight-card max-w-4xl mx-auto"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-sky-300 mb-4">
                Ready to Transform Your Hiring Process?
              </h2>
              <p className="text-slate-300 text-[16px] leading-relaxed mb-6">
                Join Auralis today and experience the future of intelligent job
                matching. Whether you're a candidate looking for your dream job
                or a recruiter seeking top talent, we've got you covered.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => navigate("/signup/candidate")}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up as Candidate
                </button>
                <button
                  onClick={() => navigate("/signup/recruiter")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up as Recruiter
                </button>
              </div>
            </div>
          </SpotlightCard>
        </section>
      </main>
    </MainLayout>
  );
}

