"use client";

import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { AlertCircle, Check, Loader2, Mail } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionHeading from "@/components/ui/SectionHeading";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { profile } from "@/data/profile";
import { COLORS } from "@/lib/constants";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

function FloatingField({ id, label, type = "text", value, onChange, textarea = false }) {
  const labelRef = useRef(null);
  const underlineRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const animateFocus = (focused) => {
    const method = reducedMotion ? "set" : "to";
    gsap[method](labelRef.current, {
      y: focused ? -22 : 0,
      scale: focused ? 0.85 : 1,
      color: focused ? COLORS.accent : COLORS.textMuted,
      duration: reducedMotion ? 0 : 0.25,
      ease: "power2.out",
    });
    gsap[method](underlineRef.current, {
      scaleX: focused ? 1 : 0,
      duration: reducedMotion ? 0 : 0.3,
      ease: "power2.out",
    });
  };

  const handleFocus = () => animateFocus(true);
  const handleBlur = (event) => {
    if (!event.target.value) animateFocus(false);
  };

  const Field = textarea ? "textarea" : "input";

  return (
    <div className="relative pt-2">
      <Field
        id={id}
        name={id}
        type={textarea ? undefined : type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={textarea ? 4 : undefined}
        required
        // No outline-none here: the global input:focus-visible rule in
        // globals.css supplies the accent-colored ring so keyboard users
        // get a real indicator, on top of (not instead of) the GSAP label
        // animation below.
        className="peer w-full resize-none rounded-sm border-b border-white/15 bg-transparent py-2 text-text"
      />
      <label
        ref={labelRef}
        htmlFor={id}
        style={{ transformOrigin: "left center" }}
        className="pointer-events-none absolute left-0 top-2 font-mono text-sm text-textMuted"
      >
        {label}
      </label>
      <span
        ref={underlineRef}
        style={{ transformOrigin: "left center" }}
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent"
      />
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const buttonRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (status !== "success" || !buttonRef.current || reducedMotion) return;
    gsap.fromTo(
      buttonRef.current,
      { scale: 0.9 },
      { scale: 1, duration: 0.4, ease: "back.out(3)" }
    );
  }, [status, reducedMotion]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error("EmailJS is not configured.");
      }
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="contact-heading" eyebrow="Get in Touch" title="Contact" />

        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <FloatingField id="name" label="Name" value={form.name} onChange={handleChange("name")} />
            <FloatingField
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />
            <FloatingField
              id="message"
              label="Message"
              textarea
              value={form.message}
              onChange={handleChange("message")}
            />

            <div>
              <button
                ref={buttonRef}
                type="submit"
                disabled={status === "submitting"}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm text-bg transition-opacity disabled:opacity-60"
              >
                {status === "submitting" && (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </>
                )}
                {status === "success" && (
                  <>
                    <Check size={16} /> Sent
                  </>
                )}
                {(status === "idle" || status === "error") && "Send Message"}
              </button>

              {/* Always-present live region — the element itself must exist
                  before its content changes for screen readers to reliably
                  announce the update, rather than relying on it being
                  mounted fresh at success/error time. */}
              <div role="status" aria-live="polite" className="mt-4">
                {status === "success" && (
                  <p className="flex items-center gap-2 font-mono text-sm text-accent">
                    <Check size={16} /> Thanks — I&apos;ll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="flex items-center gap-2 font-mono text-sm text-red-400">
                    <AlertCircle size={16} /> Something went wrong — try again, or reach me
                    directly below.
                  </p>
                )}
              </div>
            </div>
          </form>

          <div className="flex flex-col gap-6">
            <p className="text-sm text-textMuted">
              Prefer email or a direct message? Reach me here:
            </p>
            <div className="flex flex-col gap-4 font-mono text-sm">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="hover"
                  className="flex items-center gap-2 text-textMuted transition-colors hover:text-accent"
                >
                  <Mail size={16} /> {profile.email}
                </a>
              )}
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="hover"
                className="flex items-center gap-2 text-textMuted transition-colors hover:text-accent"
              >
                <GithubIcon size={16} /> GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="hover"
                className="flex items-center gap-2 text-textMuted transition-colors hover:text-accent"
              >
                <LinkedinIcon size={16} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
