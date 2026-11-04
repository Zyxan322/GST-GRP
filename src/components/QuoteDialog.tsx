import { FormEvent, useState } from "react";
import { InquiryThanks } from "@/components/InquiryThanks";
import { submitInquiry, type InquiryResult } from "@/lib/inquiry";
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

export function QuoteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
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
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Project: ${data.get("message")}`,
    ].join("\n");

    const outcome = await submitInquiry({
      subject: "Quote request — GST Group",
      body,
      replyTo: String(data.get("email") ?? ""),
    });
    setSending(false);
    setResult(outcome);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md border border-white/10 bg-[#111116] text-foreground shadow-2xl shadow-black/50">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">Request a Quote</DialogTitle>
          <DialogDescription className="text-foreground/65">
            Tell us about your project — our engineers reply within one business day.
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <InquiryThanks result={result} onClose={() => close(false)} dark />
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="q-name" className="text-foreground/80">
                Full name
              </Label>
              <Input
                id="q-name"
                name="name"
                required
                placeholder="Your name"
                className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="q-email" className="text-foreground/80">
                  Email
                </Label>
                <Input
                  id="q-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="q-phone" className="text-foreground/80">
                  Phone
                </Label>
                <Input
                  id="q-phone"
                  name="phone"
                  type="tel"
                  pattern="[+0-9\\s\\-()]{6,20}"
                  title="Enter a valid phone number"
                  placeholder="+966 …"
                  className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-message" className="text-foreground/80">
                Project details
              </Label>
              <Textarea
                id="q-message"
                name="message"
                required
                rows={3}
                placeholder="Scope, location, timeline…"
                className="bg-white/5 border-white/15 text-white placeholder:text-foreground/45 focus:border-primary focus:ring-primary resize-none"
              />
            </div>
            <Button type="submit" disabled={sending} className="cta-button w-full">
              {sending ? "Sending…" : "Send request"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
