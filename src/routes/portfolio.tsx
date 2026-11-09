import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/Section";
import { Tilt } from "@/components/Tilt";
import { ProjectIllustration } from "@/components/ProjectIllustration";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import kafdImage from "@/assets/iking abdullah.jfif?url";
import neomImage from "@/assets/NEOM, Saudi Arabia.jpg?url";
import redSeaImage from "@/assets/Red Sea, Saudi Arabia.jfif?url";
import jubailImage from "@/assets/Jubail, Saudi Arabia.jfif?url";
import businessBayImage from "@/assets/Business Bay Tower Façade.jfif?url";
import dubaiMarinaImage from "@/assets/Dubai Marina Residences.jpg?url";
import mefscoImage from "@/assets/MEFSCO Industrial Plant.jfif?url";
import arascoImage from "@/assets/ARASCO Plant.jfif?url";
import saudiCeramicsImage from "@/assets/Saudi Ceramics.jfif?url";
import yamamaCementImage from "@/assets/Yamama Cement.jfif?url";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — GST Group" },
      {
        name: "description",
        content: "Selected projects from GST Group — KAFD, NEOM, Red Sea Global, SABIC and more.",
      },
      { property: "og:title", content: "Portfolio — GST Group" },
      {
        property: "og:description",
        content: "25+ years of complex projects delivered on time with superior quality.",
      },
    ],
  }),
  component: Portfolio,
});

const PROJECTS = [
  {
    name: "King Abdullah Financial District (KAFD)",
    loc: "Riyadh, Saudi Arabia",
    scope: "Glass balustrades, aluminum systems, metal works",
    img: kafdImage,
    tag: "Iconic",
  },
  {
    name: "NEOM — The Line",
    loc: "NEOM, Saudi Arabia",
    scope: "Steel structures, staircases, infrastructure",
    img: neomImage,
    tag: "Mega",
  },
  {
    name: "Red Sea Development",
    loc: "Red Sea, Saudi Arabia",
    scope: "Steel structures, façades, finishing",
    img: redSeaImage,
    tag: "Tourism",
  },
  {
    name: "SABIC Facilities",
    loc: "Jubail, Saudi Arabia",
    scope: "Steel structures, drainage, stainless works",
    img: jubailImage,
    tag: "Industrial",
  },
  {
    name: "Business Bay Tower Façade",
    loc: "Dubai, UAE",
    scope: "Unitized curtain wall, aluminum cladding",
    img: businessBayImage,
    tag: "Dubai",
  },
  {
    name: "Dubai Marina Residences",
    loc: "Dubai, UAE",
    scope: "Glass balustrades, interior fitout, MEP",
    img: dubaiMarinaImage,
    tag: "Dubai",
  },
  {
    name: "MEFSCO Industrial Plant",
    loc: "Riyadh, Saudi Arabia",
    scope: "Metal fabrication, fencing, road works",
    img: mefscoImage,
    tag: "Industrial",
  },
  {
    name: "ARASCO Plant",
    loc: "Al-Kharj, Saudi Arabia",
    scope: "Stainless steel drains, fencing, railings",
    img: arascoImage,
    tag: "Industrial",
  },
  {
    name: "Saudi Ceramics",
    loc: "Riyadh, Saudi Arabia",
    scope: "Structural & metal works",
    img: saudiCeramicsImage,
    tag: "Industrial",
  },
  {
    name: "Yamama Cement",
    loc: "Riyadh, Saudi Arabia",
    scope: "Civil and metal works",
    img: yamamaCementImage,
    tag: "Industrial",
  },
];

function Portfolio() {
  return (
    <div className="min-h-screen">
      <Header />
      <PageHero
        eyebrow="Our Portfolio"
        title={
          <>
            Built across the Kingdom.
            <br />
            Trusted across the region.
          </>
        }
        subtitle="A selection of milestone projects delivered for leading developers, contractors and industrial groups."
      />
      <section className="px-3 sm:px-6 lg:px-8 xl:px-10 pb-32">
        <div className="mx-auto max-w-[1536px] grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p) => (
            <Tilt key={p.name} className="rounded-3xl overflow-hidden glass">
              <article className="group relative h-full">
                <div className="aspect-[4/3] overflow-hidden">
                  {p.img ? (
                    <ResponsiveImage
                      src={p.img}
                      alt={`${p.name} project`}
                      loading="lazy"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-full object-cover opacity-85 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                    />
                  ) : (
                    <ProjectIllustration />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>
                <div className="absolute top-4 left-4 glass rounded-full text-xs uppercase tracking-[0.2em] px-3 py-1 text-primary tilt-layer-sm">
                  {p.tag}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 space-y-1 tilt-layer">
                  <div className="text-xs uppercase tracking-[0.25em] text-primary">{p.loc}</div>
                  <h3 className="font-display text-lg text-white">{p.name}</h3>
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-xs text-foreground/70">{p.scope}</p>
                    <Link
                      to="/services"
                      aria-label={`Details for ${p.name}`}
                      className="shrink-0 text-xs text-white/90 font-medium hover:text-white border-b-2 border-primary pb-1"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            </Tilt>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
