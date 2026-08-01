export const projects = [
  {
    id: "cross-border-compliance",
    title: "Cross-Border Ingredient Safety & Compliance System",
    duration: "2 months",
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
    duration: "2 months",
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
    duration: "2 months",
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
