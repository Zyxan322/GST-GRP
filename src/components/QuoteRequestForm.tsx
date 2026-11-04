import { FormEvent, useState } from "react";
import { InquiryThanks } from "@/components/InquiryThanks";
import { submitInquiry, type InquiryResult } from "@/lib/inquiry";
import { CheckCircle2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";

export function QuoteRequestForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { items, clearCart } = useCart();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);

  const close = (v: boolean) => {
    onOpenChange(v);
    if (!v) setTimeout(() => setResult(null), 200);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);

    const data = new FormData(event.currentTarget);
    const selectedServices = items
      .map((item) => `✓ ${item.name}${item.quantity > 1 ? ` (×${item.quantity})` : ""}`)
      .join("\n");

    const body = [
      `── IT Services Quote Request ──`,
      ``,
      `Name: ${data.get("fullName")}`,
      `Company: ${data.get("companyName") || "N/A"}`,
      `Email: ${data.get("email")}`,
      `Phone/WhatsApp: ${data.get("phone") || "N/A"}`,
      ``,
      `── Selected Services ──`,
      selectedServices,
      ``,
      `── Project Details ──`,
      data.get("details") || "Not provided",
      ``,
      `Budget: ${data.get("budget") || "Not specified"}`,
      `Timeline: ${data.get("timeline") || "Not specified"}`,
    ].join("\n");

    const outcome = await submitInquiry({
      subject: "IT Services Quote Request — GST International",
      body,
      replyTo: String(data.get("email") ?? ""),
    });
    clearCart();
    setSending(false);
    setResult(outcome);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border border-white/10 bg-[#111116] text-foreground shadow-2xl shadow-black/50">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">Request a Quote</DialogTitle>
          <DialogDescription className="text-foreground/65">
            Tell us about your project — our team will review your requirements and respond with a
            custom quotation.
          </DialogDescription>
        </DialogHeader>

        {result && <InquiryThanks result={result} onClose={() => close(false)} dark />}

        {/* Selected services */}
        {!result && items.length > 0 && (
          <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Selected Services ({items.length})
            </div>
            <div className="space-y-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-[13px] text-foreground/80"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-xs text-primary bg-primary/10 rounded px-1.5 py-0.5 font-medium">
                      ×{item.quantity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="qr-fullName" className="text-foreground/80">
                  Full Name *
                </Label>
                <Input
                  id="qr-fullName"
                  name="fullName"
                  required
                  placeholder="Your full name"
                  className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qr-companyName" className="text-foreground/80">
                  Company Name
                </Label>
                <Input
                  id="qr-companyName"
                  name="companyName"
                  placeholder="Company name"
                  className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="qr-email" className="text-foreground/80">
                  Email Address *
                </Label>
                <Input
                  id="qr-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qr-phone" className="text-foreground/80">
                  Phone / WhatsApp
                </Label>
                <Input
                  id="qr-phone"
                  name="phone"
                  placeholder="+966 …"
                  className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qr-details" className="text-foreground/80">
                Project Details / Requirements
              </Label>
              <Textarea
                id="qr-details"
                name="details"
                rows={3}
                placeholder="Describe your project scope, goals, and any specific requirements…"
                className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="qr-budget" className="text-foreground/80">
                  Budget (optional)
                </Label>
                <Input
                  id="qr-budget"
                  name="budget"
                  placeholder="e.g. $5,000 – $15,000"
                  className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qr-timeline" className="text-foreground/80">
                  Timeline (optional)
                </Label>
                <Input
                  id="qr-timeline"
                  name="timeline"
                  placeholder="e.g. 2–3 months"
                  className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="cta-button w-full transition-all duration-300 flex items-center gap-2"
            >
              {sending ? (
                "Sending…"
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Request
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
