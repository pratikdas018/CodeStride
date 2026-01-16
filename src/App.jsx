import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Github,
  Linkedin,
  ExternalLink,
  Download,
} from "lucide-react";
// If you choose EmailJS (no backend), install once: npm i @emailjs/browser
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_df3o81k";
const EMAILJS_VISITOR_TEMPLATE_ID = "template_visitor_alert";
const EMAILJS_CONTACT_TEMPLATE_ID = "template_3cl97i5";
const EMAILJS_PUBLIC_KEY = "EIAbfqJCZvoUsPzeX";




export default function Portfolio() {
  // --- Theme toggler (with no-flash on first paint) ---
  const [showOffer, setShowOffer] = useState(null);
  const OFFER_LETTER_DRIVE_URL =
    "https://drive.google.com/drive/folders/1vQ2rTmOmw692DxreyN2wRw-f-LR9QC0S";

  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (_) {
      return false;
    }
  });

  const sendVisitorEmail = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const visitorData = {
        ip: data.ip || "Unknown",
        country: data.country_name || "Unknown",
        city: data.city || "Unknown",
        device: /Mobi|Android/i.test(navigator.userAgent)
          ? "Mobile"
          : "Desktop",
        browser: navigator.userAgent,
        os: navigator.platform,
        screen: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer || "Direct",
        page: window.location.pathname,
        time: new Date().toLocaleString(),
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_VISITOR_TEMPLATE_ID,
        visitorData,
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("Visitor email failed:", error);
    }
  };


  useEffect(() => {
    const sent = sessionStorage.getItem("visitor_sent");

    if (!sent) {
      sendVisitorEmail();
      sessionStorage.setItem("visitor_sent", "true");
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Persist changes & update <html> class
  useLayoutEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", dark);
    } catch (_) {
      // ignore
    }
  }, [dark]);

  const toggleTheme = () => {
    setDark((prev) => {
      const newTheme = !prev;
      try {
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      } catch (_) { }
      return newTheme;
    });
  };

  // --- Links / assets ---
  const githubUrl = "https://github.com/pratikdas018";
  const linkedinUrl = "https://www.linkedin.com/in/pratik-das-sonu-7201a328b/";
  const resumeUrl = "/pratik's Resume.pdf"; // place your PDF in /public

  // --- Projects (ensure images are in /public/projects/*) ---
  const projects = [
    {
      id: 1,
      title: "TalkSy - Real-time Chat App",
      desc: "Full-stack real-time chat app with WebSocket, authentication and multimedia support. Scalable rooms, presence indicators and typing status.",
      tech: ["React", "Node.js", "Socket.io", "MongoDB"],
      img: "/projects/talksy.png", // <— your actual image
      link: "https://realtimetalk-frontend.onrender.com",
    },
    {
      id: 2,
      title: "Vingo Real-time Food-delivery-App",
      desc: "A full-stack food delivery platform with real-time tracking, restaurant listings, and a responsive UI. Built with React.js, Node.js, Express, and MongoDB.",
      tech: ["React", "Express", "Node.js", "Socket.io", "JWT", "MongoDB"],
      img: "/projects/vingo.png", // <— your actual image
      link: "https://food-delivery-vingo-frontend.onrender.com",
    },
    {
      id: 3,
      title: "TalkNex - AI Voice Assistant",
      desc: "An AI-based voice assistant similar to Google Assistant that allows users to talk via voice commands, set a custom assistant name and image, and interact naturally.",
      tech: ["React", "Web Speech API", "JavaScript", "AI Logic"],
      img: "/projects/talknex.png",
      link: "https://github.com/pratikdas018/talkNex",
    },

    {
      id: 4,
      title: "LMS – Learning Management System",
      desc: "A full-stack Learning Management System that supports role-based access for students and admins, task assignment, progress tracking, and secure authentication.",
      tech: ["React", "Node.js", "Express", "MongoDB", "JWT"],
      img: "/projects/lms.png", 
      link: "https://codelms-net.vercel.app/",
    },

    {
      id: 5,
      title: "Resume Shortlister (ATS Skill Match Analyzer)",
      desc: "A resume analysis tool that compares user skills with job descriptions and calculates an exact match percentage, highlighting missing and matched skills.",
      tech: ["React", "JavaScript", "Text Analysis", "ATS Logic"],
      img: "/projects/resume-shortlister.png",
      link: "https://github.com/pratikdas018/resume-shortlister", // replace if repo is different
    },
    

  ];

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // --- Contact form (EmailJS) ---
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  async function onSubmitContact(e) {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    setSentOk(null);
    setErrMsg("");

    try {
      // name/email/message inputs must be named exactly like your EmailJS template variables
      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONTACT_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      if (result?.status === 200) {
        setSentOk(true);
        formRef.current.reset();
      } else {
        setSentOk(false);
        setErrMsg("Unexpected response from email service.");
      }
    } catch (err) {
      setSentOk(false);
      setErrMsg(err?.text || err?.message || "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg">PC</div>
          <div>
            <div className="text-sm font-medium">Pratik Ch: Das</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Full Stack Web Developer</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="group p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
            aria-pressed={dark}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={variants}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Pratik Ch: Das</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              Final-year B.Tech CSE student &amp; Full Stack Web Developer building performant, accessible
              and delightful web applications. I craft end-to-end solutions — from sleek, responsive
              UIs to scalable backend systems.
            </p>

            <div className="flex items-center gap-4">
              <a
                href={resumeUrl}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:scale-[1.02] transform transition"
                download
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                View Projects
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="flex gap-3 items-center text-sm text-slate-600 dark:text-slate-300">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                <span>Open to internships &amp; freelance</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative">
              {/* Round profile */}
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img src="/profile.jpg" alt="Pratik" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-md border border-slate-100 dark:border-slate-800 text-xs">
                Full Stack • Problem Solver
              </div>
            </div>
          </motion.div>
        </section>

        {/* ABOUT + SKILLS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={variants}
          >
            <h2 className="text-2xl font-semibold">About Me</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              I'm Pratik — a final-year B.Tech CSE student with a passion for building full-stack
              applications. I focus on clean user interfaces, robust server-side logic and pragmatic
              engineering that solves real user problems. I like to learn new technologies quickly and
              iterate fast to deliver measurable impact.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">Focus Areas</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Real-time applications (WebSockets)</li>
                  <li>API design &amp; performance</li>
                  <li>Responsive &amp; accessible UI</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium">What I bring</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>End-to-end product thinking</li>
                  <li>Fast debugging &amp; test-driven fixes</li>
                  <li>Practical UX decisions</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.aside
            className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            variants={variants}
          >
            <h3 className="text-lg font-semibold">Technical Skills</h3>

            <div className="mt-2">
              <h4 className="text-sm font-medium">Frontend</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "React",
                  "Next.js",
                  "TailwindCSS",
                  "TypeScript",
                  "Redux/RTK",
                  "Framer Motion",
                ].map((s) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium">Backend &amp; Tools</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Node.js",
                  "Express",
                  "MongoDB",
                  "Postgres",
                  "Socket.io",
                  "Docker",
                ].map((s) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.aside>
        </section>

        {/* WORK EXPERIENCE */}
        <section className="mt-12">
          <motion.h2
            className="text-2xl font-semibold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Work Experience
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saiket Systems */}
            <motion.div
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-md"
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold">Web Development Intern</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Saiket Systems • Internship
              </p>

              <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
                <li>Worked on real-world web development projects using React and modern UI practices</li>
                <li>Built responsive and user-friendly interfaces following industry standards</li>
                <li>Collaborated with mentors and followed structured task-based development</li>
                <li>Improved debugging, code optimization, and deployment skills</li>
              </ul>
              <a
                href={OFFER_LETTER_DRIVE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
              >
                View Details
              </a>

            </motion.div>

            {/* Dynamix Networks */}
            <motion.div
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-md"
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold">Web Development Intern</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Dynamix Networks • Internship
              </p>

              <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
                <li>Developed full-stack features using MERN stack</li>
                <li>Worked on authentication, REST APIs, and database integration</li>
                <li>Implemented real-time and interactive components</li>
                <li>Maintained GitHub repositories and shared progress on LinkedIn</li>
              </ul>
              <a
                href={OFFER_LETTER_DRIVE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
              >
                View Details
              </a>

            </motion.div>
          </div>
        </section>


        {/* PROJECTS */}
        <section id="projects" className="mt-12">
          <motion.h2
            className="text-2xl font-semibold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Selected Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <motion.article
                key={p.id}
                className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                variants={variants}
              >
                <a href={p.link} target="_blank" rel="noreferrer" className="block">
                  <div className="h-44 md:h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={p.img} // <- now uses each project's own image
                      alt={p.title}
                      className="w-full h-full object-cover brightness-95 hover:scale-105 transform transition duration-500"
                      loading="lazy"
                    />
                  </div>
                </a>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{p.desc}</p>
                    </div>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-md border border-slate-200 dark:border-slate-800"
                    >
                      Live
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Education + Resume CTA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={variants}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">Education</h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-md">
              <h3 className="font-medium">B.Tech — Computer Science &amp; Engineering</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Makaut University— Expected 2026</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Relevant coursework: Data Structures, Algorithms, Databases, Distributed Systems</p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={variants}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">Resume</h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-md flex flex-col gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">Download a clean PDF resume that highlights projects, impact metrics and technical skills.</p>
              <div className="flex gap-3">
                <a href={resumeUrl} download className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white shadow hover:scale-[1.02] transition">
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>

                <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  View GitHub
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CONTACT */}
        <section className="mt-12">
          <motion.h2 className="text-2xl font-semibold mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            Contact
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-md">
              <h3 className="font-medium mb-2">Get in touch</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">I’m open to internships, freelance projects and collaboration. Drop a message and I’ll respond promptly.</p>

              {/* EmailJS contact form */}
              <form ref={formRef} onSubmit={onSubmitContact} className="space-y-4">
                <div>
                  <label className="text-sm">Name</label>
                  <input name="name" required className="w-full mt-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                </div>

                <div>
                  <label className="text-sm">Email</label>
                  <input name="email" type="email" required className="w-full mt-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                </div>

                <div>
                  <label className="text-sm">Message</label>
                  <textarea name="message" rows={5} required className="w-full mt-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white shadow hover:scale-[1.02] transition disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Send Message"}
                  </button>
                  {sentOk === true && <span className="text-sm text-emerald-600">Sent! Check your inbox.</span>}
                  {sentOk === false && <span className="text-sm text-rose-600">{errMsg}</span>}
                </div>
              </form>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-md flex flex-col gap-4">
              <h3 className="font-medium">Other ways to reach me</h3>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p>Email: pratikdassonu@gmail.com</p>
                <p>Location: Kolkata, India</p>
                <p>Open to remote &amp; on-site roles</p>
              </div>

              <div className="flex gap-3 mt-4">
                <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-16 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <div>© {new Date().getFullYear()} Pratik Ch: Das — Built with React & Tailwind</div>
        </footer>
      </main>
    </div>
  );
}