// Europe's Bride — dashboard data (demo/seed values, EB_DATA shape from the approved v2 design).
// In production this document lives in the Supabase `dashboard_state` table (single jsonb row)
// and is the one thing Joshua edits for the monthly update. This file is the demo-mode fallback
// and the seed source for `npm run seed`.
export const DEMO_DATA = {
  meta: {
    business: "Europe's Bride",
    tagline: "Growth Intelligence",
    period: "Last 30 days",
    lastSync: "2 min ago",
    bookingValue: 450
  },

  kpis: {
    sessions: { value: 2847, trend: 34 },
    aiReferrals: { value: 142, trend: 86 },
    gbpActions: { value: 535, trend: 28 },
    bookings: { value: 23, trend: 21 }
  },

  sessionsTrend: [412, 448, 396, 487, 522, 561, 538, 612, 648, 701, 692, 758],
  weekLabels: ["Mar 23", "Mar 30", "Apr 6", "Apr 13", "Apr 20", "Apr 27", "May 4", "May 11", "May 18", "May 25", "Jun 1", "Jun 8"],

  sources: [
    { label: "Organic Search", value: 1167, color: "var(--accent)" },
    { label: "Direct", value: 512, color: "rgba(244,241,234,0.5)" },
    { label: "Social", value: 484, color: "var(--accent2)" },
    { label: "AI Referrals", value: 142, color: "var(--accent3)" },
    { label: "Referral", value: 314, color: "rgba(139,124,246,0.45)" },
    { label: "Paid", value: 228, color: "rgba(94,234,212,0.35)" }
  ],

  ai: {
    total: 142,
    share: 5.0,
    citations: 38,
    trend: [4, 6, 5, 9, 11, 14, 12, 17, 19, 24, 26, 31],
    engines: [
      { label: "ChatGPT", value: 64 },
      { label: "Perplexity", value: 38 },
      { label: "Gemini", value: 27 },
      { label: "Copilot", value: 13 }
    ],
    topQueries: [
      "custom wedding dress Lexington KY",
      "European style bridal gowns near me",
      "bespoke bridal gown designer Kentucky"
    ]
  },

  gbp: {
    views: 5420,
    searchAppearances: 4180,
    actions: [
      { label: "Website clicks", value: 312, max: 312 },
      { label: "Direction requests", value: 134, max: 312 },
      { label: "Phone calls", value: 89, max: 312 }
    ],
    rating: 5.0,
    reviews: 57,
    newReviews: 6
  },

  bookings: [
    { name: "Madison R.", service: "Bridal Appointment", source: "Google Search", date: "Jun 9" },
    { name: "Chloe T.", service: "Custom Gown Consult", source: "ChatGPT", date: "Jun 8" },
    { name: "Amara W.", service: "Bridal Appointment", source: "Instagram", date: "Jun 7" },
    { name: "Sofia M.", service: "Fitting — Bespoke", source: "Google Business", date: "Jun 5" },
    { name: "Emily K.", service: "Bridal Appointment", source: "Direct", date: "Jun 4" },
    { name: "Hannah L.", service: "Custom Gown Consult", source: "Perplexity", date: "Jun 2" },
    { name: "Grace P.", service: "Bridal Appointment", source: "Google Search", date: "Jun 1" }
  ],

  strategy: [
    {
      id: "seo",
      title: "SEO Foundation",
      desc: "Make Europe's Bride the answer when Central Kentucky searches for bridal.",
      tasks: [
        { id: "seo1", title: "Technical site audit & fixes", status: "done" },
        { id: "seo2", title: "Keyword research — bridal & custom gown intent", status: "done" },
        { id: "seo3", title: "On-page optimization (titles, meta, schema)", status: "done" },
        { id: "seo4", title: "Local landing page — Lexington / Central KY", status: "done" },
        { id: "seo5", title: "Bridal style guide content hub", status: "progress" },
        { id: "seo6", title: "Image optimization + descriptive alt text", status: "done" },
        { id: "seo7", title: "Internal linking structure", status: "done" },
        { id: "seo8", title: "Backlink outreach — wedding vendors & blogs", status: "upcoming" }
      ]
    },
    {
      id: "crm",
      title: "CRM Setup",
      desc: "Every inquiry tracked, followed up, and attributed to revenue.",
      tasks: [
        { id: "crm1", title: "CRM platform selection & setup", status: "done" },
        { id: "crm2", title: "Appointment booking pipeline", status: "done" },
        { id: "crm3", title: "Automated follow-up sequences", status: "progress" },
        { id: "crm4", title: "Lead source tracking — $450 booking attribution", status: "done" },
        { id: "crm5", title: "Review request automation", status: "upcoming" }
      ]
    },
    {
      id: "gbp",
      title: "Google Business Profile",
      desc: "Own the map pack for bridal in the region.",
      tasks: [
        { id: "gbp1", title: "Profile verification & category tuning", status: "done" },
        { id: "gbp2", title: "Service & product listings", status: "done" },
        { id: "gbp3", title: "Photo gallery refresh", status: "done" },
        { id: "gbp4", title: "Weekly posts cadence", status: "done" },
        { id: "gbp5", title: "Q&A seeding", status: "progress" },
        { id: "gbp6", title: "Review response workflow", status: "done" }
      ]
    }
  ],

  reports: [
    {
      month: "May 2026",
      updated: "Updated Jun 2, 2026",
      summary: "Strongest month on record. Organic visibility continued to climb after the on-page optimization push, and AI assistants are now actively recommending Europe's Bride for custom gown queries in Central Kentucky. Booking volume followed — 23 appointments attributed, with AI referrals converting at the highest rate of any channel.",
      metrics: [
        { label: "Sessions", value: "2,847", trend: "+34%" },
        { label: "Bookings", value: "23", trend: "+21%" },
        { label: "Revenue attributed", value: "$10,350", trend: "+21%" },
        { label: "AI referrals", value: "142", trend: "+86%" }
      ],
      wins: [
        "Ranked top 3 for \"custom wedding dress Lexington KY\"",
        "ChatGPT and Perplexity now cite Europe's Bride in bridal recommendations — 38 citations tracked",
        "GBP phone calls up 28% month over month",
        "6 new five-star reviews (5.0 average)"
      ],
      next: [
        "Launch backlink outreach to wedding vendors & regional blogs",
        "Turn on review request automation in the CRM",
        "Publish first 4 articles of the bridal style guide hub"
      ]
    },
    {
      month: "April 2026",
      updated: "Updated May 3, 2026",
      summary: "Foundation month. Technical SEO fixes shipped, the Lexington landing page went live, and the CRM booking pipeline started attributing revenue. Early AI referral traffic appeared for the first time.",
      metrics: [
        { label: "Sessions", value: "2,124", trend: "+18%" },
        { label: "Bookings", value: "19", trend: "+12%" },
        { label: "Revenue attributed", value: "$8,550", trend: "+12%" },
        { label: "AI referrals", value: "76", trend: "+58%" }
      ],
      wins: [
        "Lexington / Central KY landing page live",
        "CRM pipeline launched — every booking now source-tagged",
        "First tracked AI citations (12) for bespoke gown queries"
      ],
      next: [
        "Complete on-page optimization across all pages",
        "GBP photo gallery refresh & weekly post cadence",
        "Begin bridal style guide content planning"
      ]
    },
    {
      month: "March 2026",
      updated: "Updated Apr 2, 2026",
      summary: "Kickoff. Baseline audit completed, keyword strategy approved, and Google Business Profile verified with corrected categories and service listings.",
      metrics: [
        { label: "Sessions", value: "1,802", trend: "—" },
        { label: "Bookings", value: "17", trend: "—" },
        { label: "Revenue attributed", value: "$7,650", trend: "—" },
        { label: "AI referrals", value: "48", trend: "—" }
      ],
      wins: [
        "Full technical & competitive audit delivered",
        "GBP verified, categories and services corrected",
        "Keyword map approved — bridal + custom gown intent"
      ],
      next: [
        "Ship technical fixes from the audit",
        "Build the Lexington landing page",
        "Select and configure the CRM"
      ]
    }
  ]
};
