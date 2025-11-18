// src/pages/Features.jsx
import React from "react";
import FeatureCard from "../components/common/FeatureCard";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    id: "ai-match",
    title: "AI-Powered Matching",
    description:
      "Our ML model ranks and surfaces jobs that best fit a candidate’s skills and experience, saving time for both sides.",
    icon: "🤖",
  },
  {
    id: "dashboards",
    title: "Smart Dashboards",
    description:
      "Role-specific dashboards show personalized recommendations, application status, and top candidates at a glance.",
    icon: "📊",
  },
  {
    id: "secure-auth",
    title: "Secure Authentication",
    description:
      "Role-based sign-up/login with JWT or HttpOnly cookies, and best-practice session handling.",
    icon: "🔒",
  },
  {
    id: "resume-parse",
    title: "Resume Parsing",
    description:
      "Extract skills and experience from uploaded resumes to improve match accuracy and speed up profile setup.",
    icon: "📄",
  },
  {
    id: "analytics",
    title: "Recruiter Analytics",
    description:
      "Track funnel metrics, candidate quality, and time-to-hire with built-in charts and export options.",
    icon: "📈",
  },
  {
    id: "collaboration",
    title: "Team Collaboration",
    description:
      "Shortlist, comment, and share candidate profiles inside the platform to speed up hiring decisions.",
    icon: "🤝",
  },
];

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Powerful features to hire faster
        </h1>
        <p className="mt-4 text-gray-600">
          Everything you need to find the right fit — for candidates and
          recruiters. Explore a few highlights below.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/signup"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            Get started
          </Link>
          <Link
            to="/jobs"
            className="inline-block border border-gray-200 px-5 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Browse jobs
          </Link>
        </div>
      </header>

      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.id}
            title={f.title}
            description={f.description}
            icon={f.icon}
          />
        ))}
      </section>

      <section className="mt-12 bg-gradient-to-r from-blue-50 to-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Want a demo?</h3>
          <p className="text-gray-600 mt-1">
            Contact our team to see how JobPortal can fit into your hiring
            workflow.
          </p>
        </div>
        <div>
          <a
            href="mailto:sales@jobportal.example"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Request demo
          </a>
        </div>
      </section>
    </div>
  );
}
