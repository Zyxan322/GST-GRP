import { SectionEyebrow, SectionTitle } from "@/components/Section";
import {
  Receipt,
  FileCheck,
  Truck,
  Wallet,
  Repeat,
  Headphones,
  ClipboardCheck,
  Mail,
  Layers,
  Brain,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface OdooFeature {
  num: string;
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
}

const ODOO_FEATURES: OdooFeature[] = [
  {
    num: "01",
    title: "POS & ZATCA E-Invoicing",
    description:
      "Complete POS solutions with ZATCA-compliant invoicing, sales, payments, returns and reporting.",
    badge: "ZATCA Compliance",
    icon: Receipt,
  },
  {
    num: "02",
    title: "Iqama & Document Expiry",
    description:
      "Track employee documents, Iqama expiry dates, alerts, renewals and important deadlines.",
    badge: "Document Alerts",
    icon: FileCheck,
  },
  {
    num: "03",
    title: "Vehicle Management",
    description:
      "Manage vehicles, registration & insurance expiry, maintenance, fuel costs, expenses and complete vehicle history.",
    badge: "Fleet History",
    icon: Truck,
  },
  {
    num: "04",
    title: "Cash & Petty Cash Management",
    description:
      "Control daily cash, petty cash, expenses, approvals, transactions and complete cash reporting.",
    badge: "Financial Control",
    icon: Wallet,
  },
  {
    num: "05",
    title: "Company Subscription Management",
    description:
      "Manage recurring subscriptions, renewals, contracts, payments and expiry notifications.",
    badge: "Contract Renewal",
    icon: Repeat,
  },
  {
    num: "06",
    title: "Help Desk & Support",
    description:
      "Centralized ticket management, assignments, priorities, status tracking and customer support.",
    badge: "SLA Helpdesk",
    icon: Headphones,
  },
  {
    num: "07",
    title: "Daily Work Reporting",
    description:
      "Monitor employee activities, daily tasks, work reports, progress and management performance insights.",
    badge: "Activity Tracking",
    icon: ClipboardCheck,
  },
  {
    num: "08",
    title: "Business Email System",
    description:
      "Centralized business communication with organized emails, internal communication and customer correspondence.",
    badge: "Unified Mail",
    icon: Mail,
  },
  {
    num: "09",
    title: "Custom ERP & CRM",
    description:
      "Build your own business ecosystem with customized ERP, CRM, workflows, dashboards and automation.",
    badge: "Custom Ecosystem",
    icon: Layers,
  },
  {
    num: "10",
    title: "AI-Powered Integration",
    description:
      "Connect AI with your business processes for smarter insights, automation, recommendations and intelligent decision-making.",
    badge: "Smart AI Engine",
    icon: Brain,
  },
  {
    num: "11",
    title: "HR Check-In & Check-Out",
    description:
      "Track employee attendance, working hours, check-in/check-out, shifts, leaves and attendance reports.",
    badge: "Attendance Sync",
    icon: Clock,
  },
];

export function OdooFeatureEcosystem() {
  return (
    <section
      id="odoo-ecosystem"
      className="light-band relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 xl:px-10"
    >
      <div className="mx-auto max-w-[1536px]">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <SectionEyebrow>Odoo Capabilities</SectionEyebrow>
          <SectionTitle>More Than ERP. A Smarter Business Ecosystem.</SectionTitle>
          <p className="text-foreground/65 max-w-3xl mx-auto text-base leading-relaxed">
            Explore the specialized Odoo solutions we can integrate and customize to streamline
            operations, improve control, and connect your entire business.
          </p>
        </div>

        {/* Editorial Feature Grid (Text + UI, NO IMAGES) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ODOO_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.num}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#0e121a]/80 backdrop-blur-md border border-white/10 p-5 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-[#131924]/90 hover:shadow-primary/5"
              >
                <div>
                  {/* Top Bar: Minimal Icon + Number + Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#080a0f] transition-all duration-300">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-foreground/40 group-hover:text-primary transition-colors">
                        {feat.num}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold tracking-wide text-foreground/80 bg-white/[0.05] border border-white/10 rounded-full px-2.5 py-0.5 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-[15px] font-semibold text-white leading-snug tracking-tight group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-foreground/60 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
