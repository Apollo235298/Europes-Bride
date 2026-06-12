// Europe's Bride — dashboard data (EB_DATA shape from the approved v2 design).
// In production this document lives in the Supabase `dashboard_state` table (single jsonb row)
// and is the one thing Joshua edits for the monthly update. This file is the demo-mode fallback
// and the seed source for `npm run seed`.
//
// HONEST-DATA RULES (June 2026): analytics (GA4), Search Console, and the CRM are not live yet,
// so traffic / AI / booking metrics are zero and the UI shows "setup in progress" states instead
// of charts. Only verified facts go in here — no projected or illustrative numbers.
export const DEMO_DATA = {
  meta: {
    business: "Europe's Bride",
    tagline: "Growth Intelligence",
    period: "Phase 1 · Month 1",
    lastSync: "June 12, 2026",
    bookingValue: 450
  },

  // trend: null = no prior period to compare against yet (renders as a neutral chip).
  kpis: {
    sessions: { value: 0, trend: null },
    aiReferrals: { value: 0, trend: null },
    gbpActions: { value: 0, trend: null },
    bookings: { value: 0, trend: null }
  },

  // All-zero = Google Analytics not connected yet; TrafficPanel shows its setup state.
  sessionsTrend: [0, 0, 0, 0],
  weekLabels: ["May 18", "May 25", "Jun 1", "Jun 8"],

  sources: [
    { label: "Organic Search", value: 0, color: "var(--accent)" },
    { label: "Direct", value: 0, color: "rgba(244,241,234,0.5)" },
    { label: "Social", value: 0, color: "var(--accent2)" },
    { label: "AI Referrals", value: 0, color: "var(--accent3)" },
    { label: "Referral", value: 0, color: "rgba(139,124,246,0.45)" },
    { label: "Paid", value: 0, color: "rgba(94,234,212,0.35)" }
  ],

  ai: {
    total: 0,
    share: 0,
    citations: 0,
    trend: [0, 0, 0, 0],
    engines: [
      { label: "ChatGPT", value: 0 },
      { label: "Perplexity", value: 0 },
      { label: "Gemini", value: 0 },
      { label: "Copilot", value: 0 }
    ],
    topQueries: []
  },

  // rating + reviews are live facts from the profile; views/actions stay 0 until
  // profile insights are pulled for the Month 1 report.
  gbp: {
    views: 0,
    searchAppearances: 0,
    actions: [
      { label: "Website clicks", value: 0, max: 0 },
      { label: "Direction requests", value: 0, max: 0 },
      { label: "Phone calls", value: 0, max: 0 }
    ],
    rating: 5.0,
    reviews: 57,
    newReviews: null
  },

  // Empty until the CRM goes live and starts attributing appointments.
  bookings: [],

  // Mirrors the Phase 1 deliverables tracker in PROJECT-MEMORY.md — keep the two in sync.
  strategy: [
    {
      id: "gbp",
      title: "Google Business Profile",
      desc: "Build on the profile's biggest strength — a perfect 5.0 stars across 57 reviews.",
      tasks: [
        { id: "gbp1", title: "Full profile audit", status: "done" },
        { id: "gbp2", title: "New category: Clothing Alterations (in Google review)", status: "progress" },
        { id: "gbp3", title: "Keyword-tuned business description", status: "upcoming" },
        { id: "gbp4", title: "Complete the profile attributes", status: "upcoming" },
        { id: "gbp5", title: "Link Facebook & social profiles", status: "upcoming" },
        { id: "gbp6", title: "Gown collections & services listings", status: "upcoming" },
        { id: "gbp7", title: "Photo gallery additions", status: "upcoming" },
        { id: "gbp8", title: "Regular Google Posts", status: "upcoming" },
        { id: "gbp9", title: "Review requests & responses workflow", status: "upcoming" }
      ]
    },
    {
      id: "tracking",
      title: "Website & Tracking",
      desc: "Measure everything first, then tune the site with small, safe improvements.",
      tasks: [
        { id: "trk1", title: "Google Analytics setup", status: "upcoming" },
        { id: "trk2", title: "Google Search Console setup", status: "upcoming" },
        { id: "trk3", title: "Conversion tracking (calls, forms, bookings)", status: "upcoming" },
        { id: "trk4", title: "Page-by-page SEO review (titles, descriptions, headings)", status: "upcoming" },
        { id: "trk5", title: "Website wording & call-to-action refinements", status: "upcoming" }
      ]
    },
    {
      id: "crm",
      title: "CRM & Follow-Up",
      desc: "Every inquiry tracked and followed up — automatically.",
      tasks: [
        { id: "crm1", title: "CRM platform selected — GoHighLevel", status: "done" },
        { id: "crm2", title: "Account setup & configuration", status: "upcoming" },
        { id: "crm3", title: "Lead pipeline build", status: "upcoming" },
        { id: "crm4", title: "Automated follow-up emails", status: "upcoming" },
        { id: "crm5", title: "Appointment reminder emails", status: "upcoming" },
        { id: "crm6", title: "Website inquiry form → CRM connection", status: "upcoming" }
      ]
    }
  ],

  reports: [
    {
      month: "Month 1 · June 2026",
      updated: "Updated June 12, 2026 · full report arrives June 30",
      summary: "Foundation month, in progress. The engagement kicked off May 18 with a full audit of the Google Business Profile — already the business's strongest asset at a perfect 5.0 stars across 57 reviews. The first profile improvement (a Clothing Alterations category) is in Google's review queue, the CRM platform has been chosen, and analytics setup is next so that from Month 2 onward every report is backed by real numbers.",
      metrics: [
        { label: "Google rating", value: "5.0★", trend: "57 reviews" },
        { label: "Profile roadmap", value: "9 steps", trend: "1 underway" },
        { label: "CRM platform", value: "Chosen", trend: "GoHighLevel" },
        { label: "First full report", value: "Jun 30", trend: "on schedule" }
      ],
      wins: [
        "Engagement kicked off May 18 — project systems and reporting workspace in place",
        "Full Google Business Profile audit completed",
        "Clothing Alterations category submitted to Google (in review)",
        "CRM platform chosen: GoHighLevel",
        "Nine-step profile improvement roadmap mapped out"
      ],
      next: [
        "Google Analytics and Search Console live on the website",
        "GoHighLevel account setup and lead pipeline",
        "Profile: confirm the new category, set July 4th hours, refresh the description",
        "First full monthly report — June 30"
      ]
    }
  ]
};
