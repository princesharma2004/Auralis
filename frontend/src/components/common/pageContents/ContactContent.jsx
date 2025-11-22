import React, { useState } from "react";
import SpotlightCard from "../SpotlightCard";

export default function ContactContent() {
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
    <main className="relative min-h-screen text-slate-200 flex flex-col">
      <div className="relative flex-1 flex items-center justify-center px-6 py-20">
        <SpotlightCard
          className="w-full max-w-3xl rounded-2xl shadow-xl p-1 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <section className="w-full rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden shadow-inner p-8 md:p-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
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
                  <label className="block text-sm text-slate-400 mb-2 transition-colors duration-200">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/10 text-slate-200 placeholder-slate-400 transition-all duration-300 hover:bg-white/7"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2 transition-colors duration-200">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/10 text-slate-200 placeholder-slate-400 transition-all duration-300 hover:bg-white/7"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 transition-colors duration-200">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/10 text-slate-200 placeholder-slate-400 transition-all duration-300 hover:bg-white/7"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 transition-colors duration-200">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/10 text-slate-200 placeholder-slate-400 transition-all duration-300 resize-none hover:bg-white/7"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-400 text-white font-semibold hover:shadow-[0_0_12px_rgba(56,189,248,0.5)] hover:from-indigo-600 hover:to-sky-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          </section>
        </SpotlightCard>
      </div>

      {/* Quote Section */}
      <div className="relative flex items-center justify-center px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 md:w-16 h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent"></div>
            <span className="text-4xl md:text-5xl text-sky-400 font-light">—</span>
            <div className="w-12 md:w-16 h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent"></div>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg leading-tight">
            Transform Your Hiring Journey With Us
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Where candidates discover their dream roles and recruiters find the perfect talent — all powered by intelligent matching
          </p>
        </div>
      </div>
    </main>
  );
}

