import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiExternalLink,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { prisma } from "../../../../libs/prisma";

const getAlumni = async (id) => {
  const alumniId = Number(id);
  if (!Number.isInteger(alumniId) || alumniId <= 0) return null;

  return prisma.alumni.findFirst({
    where: { id: alumniId, isActive: true },
    include: {
      images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
    },
  });
};

const getImages = (alumni) => {
  const images = Array.isArray(alumni?.images) ? [...alumni.images] : [];
  if (alumni?.image && !images.some((image) => image.url === alumni.image)) {
    images.unshift({
      url: alumni.image,
      altText: alumni.title,
      caption: null,
    });
  }
  return images.filter((image) => image?.url);
};

export async function generateMetadata({ params }) {
  const alumni = await getAlumni(params.id);
  if (!alumni) return { title: "Alumni Profile" };

  return {
    title: `${alumni.title} | Kinyui Boys Alumni`,
    description:
      alumni.story ||
      `Discover the Kinyui Boys alumni journey of ${alumni.title}.`,
  };
}

export default async function AlumniProfilePage({ params }) {
  const alumni = await getAlumni(params.id);
  if (!alumni) notFound();

  const images = getImages(alumni);
  const heroImage = images[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {heroImage ? (
          <img
            src={heroImage.url}
            alt={heroImage.altText || alumni.title}
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/55" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <Link
            href="/alumini"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
          >
            <FiArrowLeft /> Alumni Directory
          </Link>

          <div className="mt-12 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
              <FiUsers /> Kinyui Boys Alumni
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {alumni.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-slate-200">
              {alumni.graduationYear ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <FiCalendar className="text-orange-300" />
                  Class of {alumni.graduationYear}
                </span>
              ) : null}
              {alumni.currentRole || alumni.organization ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <FiBriefcase className="text-orange-300" />
                  {[alumni.currentRole, alumni.organization]
                    .filter(Boolean)
                    .join(" at ")}
                </span>
              ) : null}
              {alumni.location ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <FiMapPin className="text-orange-300" />
                  {alumni.location}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:px-8">
        <div className="space-y-8">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
              Alumni Journey
            </p>
            <h2 className="mt-3 text-2xl font-black">The story after Kinyui Boys</h2>
            <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
              {alumni.story ||
                "This alumni story is being prepared for the Kinyui Boys community."}
            </p>
          </article>

          {images.length > 0 ? (
            <section>
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
                  Profile Gallery
                </p>
                <h2 className="mt-2 text-2xl font-black">Moments and milestones</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {images.map((image, index) => (
                  <figure
                    key={`${image.url}-${index}`}
                    className={`overflow-hidden rounded-3xl border border-slate-200 bg-white ${
                      index === 0 ? "sm:col-span-2" : ""
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `${alumni.title} profile image ${index + 1}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      className={`w-full object-cover ${
                        index === 0 ? "max-h-[620px]" : "aspect-[4/3]"
                      }`}
                    />
                    {image.caption ? (
                      <figcaption className="px-5 py-4 text-sm font-semibold text-slate-600">
                        {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          {alumni.achievement ? (
            <div className="rounded-3xl bg-orange-600 p-6 text-white shadow-lg">
              <FiAward className="h-8 w-8 text-orange-100" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-orange-100">
                Alumni Achievement
              </p>
              <p className="mt-3 text-base font-bold leading-7">
                {alumni.achievement}
              </p>
            </div>
          ) : null}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Kinyui Boys Community
            </p>
            <h2 className="mt-3 text-xl font-black">Alumni Profile</h2>
            <dl className="mt-5 space-y-4 text-sm">
              {alumni.graduationYear ? (
                <div>
                  <dt className="font-black text-slate-400">Graduation Year</dt>
                  <dd className="mt-1 font-bold text-slate-800">
                    {alumni.graduationYear}
                  </dd>
                </div>
              ) : null}
              {alumni.currentRole ? (
                <div>
                  <dt className="font-black text-slate-400">Current Role</dt>
                  <dd className="mt-1 font-bold text-slate-800">
                    {alumni.currentRole}
                  </dd>
                </div>
              ) : null}
              {alumni.organization ? (
                <div>
                  <dt className="font-black text-slate-400">Organization</dt>
                  <dd className="mt-1 font-bold text-slate-800">
                    {alumni.organization}
                  </dd>
                </div>
              ) : null}
            </dl>

            {alumni.website ? (
              <a
                href={alumni.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
              >
                Visit External Website <FiExternalLink />
              </a>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
