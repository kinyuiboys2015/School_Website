import Link from "next/link";
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiFacebook,
  FiMail,
  FiUsers,
} from "react-icons/fi";

const alumniHighlights = [
  {
    icon: FiUsers,
    title: "Reconnect",
    description:
      "Keep in touch with former classmates, teachers, and the wider Kinyui Boys community.",
  },
  {
    icon: FiAward,
    title: "Give Back",
    description:
      "Support mentorship, career conversations, school projects, and opportunities for current students.",
  },
  {
    icon: FiBookOpen,
    title: "Share Your Story",
    description:
      "Celebrate alumni achievements and show current learners the many paths available after school.",
  },
];

export default function AlumniPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-24 pt-28 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.32),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,116,144,0.26),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-200">
            <FiUsers className="h-4 w-4" />
            Old boys community
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Kinyui Boys Alumni
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            The school journey continues through the friendships, service, and
            shared experience of every former Kinyui Boys student.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.facebook.com/KinyuiBoysHighSchool/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-400"
            >
              <FiFacebook className="h-5 w-5" />
              Join on Facebook
            </a>
            <a
              href="mailto:kinyuiboys2015@gmail.com?subject=Kinyui%20Boys%20Alumni"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
            >
              <FiMail className="h-5 w-5" />
              Contact the school
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {alumniHighlights.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div className="inline-flex rounded-2xl bg-orange-100 p-3 text-orange-700">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-amber-500 p-8 text-white sm:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
              Stay involved
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Help the next generation soar.
            </h2>
            <p className="mt-4 leading-7 text-orange-50">
              Alumni can contribute through mentorship, career guidance,
              professional networks, and support for school initiatives.
            </p>
            <Link
              href="/pages/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Start a conversation
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
