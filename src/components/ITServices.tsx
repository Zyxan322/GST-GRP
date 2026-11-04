import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/Section";
import { IT_SERVICES, IT_SERVICE_CATEGORIES, type ITService } from "@/data/it-services";
import { useCart } from "@/hooks/useCart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveImage } from "@/components/ResponsiveImage";

function ServiceCard({ service }: { service: ITService }) {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(service.id);
  const Icon = service.icon;

  const handleAdd = () => {
    if (inCart) return;
    addItem({
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      className={`it-service-card group relative flex flex-col rounded-2xl bg-white/[0.04] border overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)] ${
        service.category === "odoo"
          ? "border-[#b98ba8]/25 hover:border-[#b98ba8]/60"
          : "border-white/10 hover:border-primary/50"
      }`}
    >
      {/* Visual Header Banner matching Specialized Services style */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <ResponsiveImage
          src={service.img}
          alt={service.name}
          loading="lazy"
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 img-scrim" />

        {/* Floating Glass Icon Badge */}
        <div className="on-dark absolute top-3.5 left-3.5 w-10 h-10 rounded-xl glass-strong grid place-items-center text-white tilt-layer-sm shadow-md group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Odoo / IT badge */}
        {service.category === "odoo" ? (
          <span className="on-dark absolute top-3.5 right-3.5 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-white bg-[#714B67] border border-[#875A7B]/60 rounded-full px-3 py-1 shadow-md backdrop-blur-md">
            Odoo
          </span>
        ) : (
          <span className="on-dark absolute top-3.5 right-3.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-white/90 bg-black/40 border border-white/20 rounded-full px-2.5 py-0.5 backdrop-blur-md">
            IT Service
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-white leading-snug tracking-tight group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <p className="mt-2 text-[13px] text-foreground/65 leading-relaxed line-clamp-3">
            {service.description}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          disabled={inCart}
          className={`mt-5 inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-300
            ${
              inCart
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/25 cursor-default"
                : "bg-primary text-primary-foreground border border-primary hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97]"
            }`}
        >
          {inCart || justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function ITServices() {
  const odooServices = IT_SERVICES.filter((s) => s.category === "odoo");
  const itServices = IT_SERVICES.filter((s) => s.category === "it");

  return (
    <section
      id="it-services"
      className="light-band relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 xl:px-10"
    >
      <div className="mx-auto max-w-[1536px]">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <SectionEyebrow>Digital Solutions</SectionEyebrow>
          <SectionTitle>IT Services</SectionTitle>
          <p className="text-foreground/65 max-w-2xl mx-auto text-base">
            Professional digital solutions designed to help your business grow, operate smarter, and
            stay ahead.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="odoo" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-white/[0.04] border border-white/10 rounded-full p-1 h-auto">
              {IT_SERVICE_CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="rounded-full px-6 py-2.5 text-sm font-medium text-foreground/60 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                >
                  {cat.label}
                  <span className="ml-2 text-xs font-bold bg-white/10 data-[state=active]:bg-primary/15 data-[state=active]:text-primary text-foreground/45 rounded-full px-2 py-0.5">
                    {cat.id === "odoo" ? odooServices.length : itServices.length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="odoo">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {odooServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="it">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {itServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
