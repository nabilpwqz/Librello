import { addPayment } from "@/lib/actions/payment";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, MapPin, Package, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { getUserSession } from "@/lib/core/session";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    bookId?: string;
    title?: string;
    fee?: string;
    cover?: string;
    librarianEmail?: string;
  }>;
}

export default async function Success({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id || `direct_${Date.now()}`;
  const currentUser = await getUserSession().catch(() => null);

  let bookTitle = params.title || "Archival Masterwork";
  let bookCover =
    params.cover ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";
  let bookId = params.bookId || "";
  let amount = Number(params.fee) || 4.5;
  let customerEmail = currentUser?.email || params.librarianEmail || "reader@librello.org";
  let userName = currentUser?.name || "Sanctuary Reader";

  // If a Stripe session ID is present and not a direct/courtesy mock ID, retrieve it
  if (sessionId && !sessionId.startsWith("direct_") && !sessionId.startsWith("courtesy_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "payment_intent"],
      });

      if (session.status === "open") {
        return redirect("/");
      }

      if (session.metadata) {
        bookTitle = session.metadata.title || bookTitle;
        bookCover = session.metadata.cover || bookCover;
        bookId = session.metadata.bookId || bookId;
        amount = Number(session.metadata.fee) || amount;
        userName = session.metadata.userName || userName;
        customerEmail = session.customer_details?.email || session.metadata.userEmail || customerEmail;
      }
    } catch (stripeErr) {
      console.warn("Stripe session retrieval notice (using local record):", stripeErr);
    }
  }

  // Record payment in background
  try {
    await addPayment({
      sessionId,
      bookId,
      bookTitle,
      bookCover,
      userId: currentUser?.id || null,
      userName,
      userEmail: customerEmail,
      librarianId: "curator-01",
      librarianEmail: params.librarianEmail || "curator@librello.org",
      amount,
    });
  } catch (err) {
    console.warn("Circulation record notice:", err);
  }

  // Calculate return date (+14 days)
  const returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const trackingCode = `LIB-${sessionId.slice(-6).toUpperCase() || "789120"}`;

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-2xl w-full p-8 md:p-12 text-center space-y-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

        {/* Status Icon */}
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-sm">
          <CheckCircle2 size={36} />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="editorial-badge !text-[10px] mb-2">
            <Sparkles size={11} className="text-primary mr-1" /> Archival Dispatch Authorized
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">
            Circulation Confirmed
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto pt-1 leading-relaxed">
            Your physical volume has been allocated from the stacks and queued for white-glove packaging.
          </p>
        </div>

        {/* Volume Summary Card */}
        <div className="p-4 rounded-2xl bg-card-soft/50 border border-border/80 text-left flex items-center gap-4">
          <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-border shadow-sm">
            <img src={bookCover} alt={bookTitle} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Physical Volume Loan
            </span>
            <h3 className="font-serif font-bold text-foreground text-base truncate">
              {bookTitle}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Tracking: <span className="font-mono font-semibold text-foreground">{trackingCode}</span></span>
              <span>•</span>
              <span>Due: <span className="font-semibold text-foreground">{returnDate}</span></span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
              Circulation Fee
            </span>
            <span className="text-lg font-serif font-bold text-foreground">
              ${amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Dispatch Progress Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block flex items-center gap-1.5">
              <Package size={13} className="text-primary" />
              Volume Packaging
            </span>
            <span className="text-xs font-semibold text-foreground">
              Sealed in Archive Sleeve
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block flex items-center gap-1.5">
              <Truck size={13} className="text-emerald-500" />
              Sanctuary Courier
            </span>
            <span className="text-xs font-semibold text-emerald-500">
              Dispatched within 24h
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block flex items-center gap-1.5">
              <Clock size={13} className="text-primary" />
              Pre-Paid Return
            </span>
            <span className="text-xs font-semibold text-foreground">
              Return Envelope Included
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/dashboard/user/myReadingList"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-card hover:bg-card-soft text-foreground text-xs font-bold uppercase tracking-wider transition-all text-center"
          >
            View on Reading Shelf
          </Link>

          <Link
            href="/dashboard/user"
            className="btn-primary w-full sm:w-auto text-center text-xs font-bold uppercase tracking-wider px-7 py-3 flex items-center justify-center gap-2 rounded-xl shadow-lg"
          >
            <BookOpen size={15} />
            Sanctuary Member Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
