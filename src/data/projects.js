export const projects = [
  {
    id: "sg-krashi",
    title: "SG Krashi — Smart Agriculture Ecosystem Platform",
    duration: "2 months",
    liveUrl: "https://sg-krashi-client.vercel.app/",
    role: "Solo project — architected, built, and deployed independently",
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "MUI",
      "Java 21",
      "Spring Boot",
      "Spring Security",
      "JWT",
      "Hibernate",
      "MySQL",
      "Razorpay",
      "Google Gemini",
      "Cloudinary",
      "Brevo",
      "Railway",
      "Vercel",
    ],
    problem:
      "Small multi-line agriculture businesses (organic farming, dairy, equipment rental, farm stays, a product store, and a crop marketplace) typically run as disconnected operations with no shared customer accounts, inventory, or admin visibility across lines.",
    solution:
      "A single platform unifying six business verticals under shared authentication, cart/checkout, booking, and admin infrastructure — built solo across 20 formally-scoped modules against a written architecture document, with real Razorpay payments, Cloudinary media, and Brevo transactional email in production.",
    architecture:
      "React 19/TypeScript/Vite/MUI frontend, Spring Boot/Java 21/MySQL backend, deployed on Vercel + Railway. A generic booking engine (shared bookable_type/bookable_id schema) powers both Equipment Rental and Farm Stay with zero core-logic changes between them — validated by git diff showing the second vertical required only additive changes.",
    features: [
      "AI Crop Doctor: photo-based crop disease diagnosis via Google Gemini, with confidence bands (not fabricated percentages), a declared-crop mismatch cross-check, and a retrieval-augmented (RAG) knowledge layer grounding responses in a curated agricultural knowledge base.",
      "Recommendation system combining content-based similar-items with order co-occurrence collaborative filtering.",
      "Predictive analytics: linear-regression revenue forecasting and velocity-based stock-out risk detection.",
      "Admin dashboard with full catalog, order, booking, inquiry, and audit-log management across all six verticals.",
    ],
    challenges: [
      "A correctly-acquired booking lock still let a race condition through under MySQL's REPEATABLE READ isolation — fixed by making the overlap check itself a locking read.",
      "A deactivated account's JWT kept working until a deliberate test — reusing its token — surfaced the gap no code review had caught.",
      'A diseased soybean leaf was misdiagnosed as "Cherry — Healthy" at 99.71% confidence, exposing gaps in the training data — resolved by migrating to Gemini with confidence bands and a crop-mismatch cross-check.',
      "The hosting platform silently blocked outbound SMTP — diagnosed via identical failures on two ports, resolved by switching email to an HTTPS API.",
    ],
    impact:
      "A real, live platform running six business lines for an actual agriculture business — not a tutorial project.",
  },
  {
    id: "cross-border-compliance",
    title: "Cross-Border Ingredient Safety & Compliance System",
    duration: "1 month",
    stack: ["Python", "FastAPI", "Streamlit", "LangChain", "ChromaDB", "PaddleOCR", "OpenCV", "Pydantic"],
    problem:
      "Food products sold across countries must comply with different, hard-to-track ingredient regulations, and manual compliance checking is slow and error-prone.",
    solution:
      "Built an AI-powered platform that extracts ingredient text from product labels via PaddleOCR/OpenCV, normalizes 18,000+ ingredients to official INS/E numbers, and runs evidence-based compliance checks through a LangChain-based RAG pipeline backed by ChromaDB — flagging banned, restricted, and permitted ingredients per market with cited regulatory evidence.",
    impact:
      "Generates explainable, auditable compliance reports (PDF/JSON/CSV) instead of manual cross-referencing — the kind of tool a regulatory or food-safety team could actually use.",
    role: "Team project — collaborative build across the full stack",
  },
  {
    id: "bharat-fix",
    title: "Bharat Fix",
    duration: "1 month",
    stack: ["Java", "Spring Boot", "React", "MySQL", "Spring Security", "JWT", "Google Maps API"],
    problem:
      "Civic/local complaint reporting is fragmented, with no clear tracking between citizens, staff, and admins.",
    solution:
      "A complaint management system where users register and track complaints with Google Maps location pinning, while staff and admins manage, assign, and resolve them through role-based access (User/Staff/Admin), secured via OTP-based authentication, Spring Security, and JWT.",
    impact:
      "Full RESTful API architecture with real role separation and workload management — production patterns, not a CRUD toy.",
    role: "Team project — collaborative build across the full stack",
  },
  {
    id: "flight-booking",
    title: "Flight Booking System",
    duration: "1 month",
    stack: ["Spring Boot", "React", "Node.js"],
    problem:
      "Simulating real-world flight booking operations requires clean separation between search, booking, user management, and admin flight-data control.",
    solution:
      "A microservices-based web application enabling users to search flights and make bookings, with a separate admin capability to manage flight data — built with an emphasis on clean architecture and scalable, RESTful API design.",
    impact:
      "Demonstrates microservices decomposition and API design discipline applicable directly to backend/full-stack roles.",
    role: "Team project — collaborative build across the full stack",
  },
];
