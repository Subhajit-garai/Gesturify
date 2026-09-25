"use client";

import React, { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <section id="contact" className="py-16 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <span className="section-tag">Get in Touch</span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-3">Community &amp; Inquiries</h2>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              Have suggestions for new sign language lexicons, educational curricula, or accessibility improvements? We welcome feedback from educators and community advocates.
            </p>

            <div className="space-y-3 text-xs font-mono text-zinc-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>support@gesturify.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>Open Source Accessibility Initiative</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-500 mb-1" htmlFor="contact-name">
                      Your Name
                    </label>
                    <input type="text" id="contact-name" required className="input-minimal" placeholder="e.g. Alex Morgan" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-500 mb-1" htmlFor="contact-email">
                      Email Address
                    </label>
                    <input type="email" id="contact-email" required className="input-minimal" placeholder="alex@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1" htmlFor="contact-role">
                    I Am A
                  </label>
                  <select id="contact-role" className="input-minimal">
                    <option value="learner">Sign Language Learner</option>
                    <option value="muted">Muted / Deaf Individual</option>
                    <option value="educator">Accessibility Educator / Interpreter</option>
                    <option value="developer">Developer / Researcher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1" htmlFor="contact-message">
                    Message or Feedback
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    className="input-minimal"
                    placeholder="Share your suggestions, feature requests, or questions..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full sm:w-auto cursor-pointer">
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
              </form>

              {submitted && (
                <div className="mt-4 p-3 bg-zinc-100 border border-zinc-300 rounded-lg text-xs font-mono text-zinc-800">
                  ✓ Thank you for reaching out! Your message has been received.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
