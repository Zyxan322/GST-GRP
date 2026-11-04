import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Suspense, lazy } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState } from "react";

const QuoteRequestForm = lazy(() =>
  import("@/components/QuoteRequestForm").then((m) => ({ default: m.QuoteRequestForm })),
);

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { items, removeItem, updateQuantity, clearCart, getItemCount } = useCart();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const count = getItemCount();

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-l border-white/10 bg-[#111116] text-foreground p-0 flex flex-col"
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-display text-xl text-white flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Your Quote List
                {count > 0 && (
                  <span className="text-xs font-bold bg-primary/15 text-primary rounded-full px-2.5 py-0.5">
                    {count}
                  </span>
                )}
              </SheetTitle>
            </div>
            <SheetDescription className="text-foreground/65 text-sm">
              Review the services you have selected and request a custom quote.
            </SheetDescription>
          </SheetHeader>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-7 h-7 text-foreground/30" />
                </div>
                <p className="font-display text-lg text-foreground/60">Your cart is empty</p>
                <p className="text-sm text-foreground/55 mt-1">
                  Add the services you are interested in and we will prepare a quote.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-primary/35 hover:bg-primary/[0.04]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-[14px] font-semibold text-white leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[12px] text-foreground/65 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-foreground/50 hover:text-red-300 hover:border-red-300/30 hover:bg-red-400/10 transition-all"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs uppercase tracking-wider text-foreground/45 font-medium">
                        Qty
                      </span>
                      <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-foreground/50 hover:text-white disabled:opacity-30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-[13px] font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-foreground/50 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer actions */}
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-white/10 bg-black/20 space-y-3">
              <button
                onClick={() => {
                  onOpenChange(false);
                  setTimeout(() => setQuoteOpen(true), 300);
                }}
                className="cta-button w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300"
              >
                Request Quote
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={clearCart}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-foreground/70 px-5 py-2.5 text-sm font-medium hover:text-red-300 hover:border-red-300/30 hover:bg-red-400/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Cart
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {quoteOpen && (
        <Suspense fallback={null}>
          <QuoteRequestForm open onOpenChange={setQuoteOpen} />
        </Suspense>
      )}
    </>
  );
}
