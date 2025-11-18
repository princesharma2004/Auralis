import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Aurora from "../components/common/Aurora";
import SpotlightCard from "../components/common/SpotlightCard";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    alert("Thank you for reaching out! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

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

      <main className="relative min-h-screen text-slate-200 flex items-center justify-center px-6 py-20 overflow-hidden">
        <SpotlightCard
          className="w-full max-w-3xl rounded-2xl shadow-xl p-1 ring-1 ring-white/10"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <section className="w-full rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden shadow-inner p-8 md:p-12 transition-transform hover:-translate-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
              Contact Us
            </h1>

            <p className="text-center text-slate-400 text-sm mt-3">
              Have a question, feedback, or collaboration idea? We'd love to
              hear from you.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-200 placeholder-slate-400 transition"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-200 placeholder-slate-400 transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-200 placeholder-slate-400 transition"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-200 placeholder-slate-400 transition resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-400 text-white font-semibold hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all"
              >
                Send Message
              </button>
            </form>
          </section>
        </SpotlightCard>
      </main>
    </MainLayout>
  );
}

import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Aurora from "../components/common/Aurora";
import SpotlightCard from "../components/common/SpotlightCard";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    alert("Thank you for reaching out! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

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

      <main className="relative min-h-screen text-slate-200 flex items-center justify-center px-6 py-20 overflow-hidden">
        <SpotlightCard
          className="w-full max-w-3xl rounded-2xl shadow-xl p-1 ring-1 ring-white/10"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <section className="w-full rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden shadow-inner p-8 md:p-12 transition-transform hover:-translate-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
              Contact Us
            </h1>

            <p className="text-center text-slate-400 text-sm mt-3">
              Have a question, feedback, or collaboration idea? We'd love to
              hear from you.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-200 placeholder-slate-400 transition"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-200 placeholder-slate-400 transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-200 placeholder-slate-400 transition"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-200 placeholder-slate-400 transition resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-400 text-white font-semibold hover:shadow-[0_0_8px_rgba(56,189,248,0.35)] transition-all"
              >
                Send Message
              </button>
            </form>
          </section>
        </SpotlightCard>
      </main>
    </MainLayout>
  );
}
