export type Lang = "en" | "es";

export const translations = {
  en: {
    brand: "PULSE",
    langLabel: "EN",
    hero: {
      eyebrow: "Enterprise Product Intelligence",
      title: "Turn Market Intelligence into Engineering Decisions.",
      subtitle:
        "PULSE continuously discovers product opportunities. FLOW validates them with real market evidence. Together they generate engineering-ready recommendations ready for execution.",
      pill1: "Enterprise Product Intelligence",
      pill2: "AI Cognitive Analysis",
      pill3: "Engineering Ready",
      cta: "Start Experience",
    },
    phases: {
      p01: "Connect Workspace",
      p02: "Strategic Brief",
      p03: "Context Clarification",
      p04: "Cognitive Intelligence",
      p05: "FLOW Validation",
      p06: "Product Blueprint",
      p07: "Delivery Hub",
    },
    timelineLabel: "Cognitive Process",
    p1: {
      title: "Connect your Product Workspace",
      desc: "Connect your engineering ecosystem so PULSE understands your product context before starting the analysis.",
      jira: "Jira Software",
      jiraDesc: "Sync epics, issues and roadmap signals",
      status: "Status",
      notConnected: "Not Connected",
      connect: "Connect Jira Workspace",
      connecting: "Establishing secure connection…",
      connected: "Connected Successfully",
      connectedDetail:
        "Workspace successfully connected. PULSE is ready to start the strategic analysis.",
      more: "More integrations coming soon",
      soon: "Coming Soon",
      continue: "Continue",
    },
    p2: {
      title: "What strategic challenge would you like PULSE to analyze?",
      subtitle:
        "Describe your business challenge, strategic initiative or product opportunity.",
      placeholder:
        "Example:\nWe want to identify enterprise opportunities supported by real market evidence.",
      starters: "Strategic Starters",
      startersHint: "Tap a starter to prefill",
      cta: "Start Strategic Analysis",
      opts: [
        "Analyze how our competitors are using AI Agents in technical recruiting and identify validated opportunities we are missing.",
        "Evaluate the product strategy of the fastest-growing workforce platforms and recommend opportunities supported by market evidence.",
        "Identify feature gaps between our product and enterprise competitors validating demand through public evidence.",
        "Generate a strategic product analysis including competitive benchmarking, market validation, business risks, confidence scoring and engineering execution.",
      ],
      optLabels: [
        "Competitive AI Recruiting Scan",
        "Workforce Platform Strategy",
        "Enterprise Feature Gap Analysis",
        "Full Strategic Product Analysis",
      ],
    },
    p3: {
      title: "A few questions before we begin",
      subtitle:
        "PULSE will use these answers to shape the cognitive analysis. No competitor input required — PULSE discovers them automatically.",
      q1: "What is your primary objective?",
      q1opts: ["Increase Revenue", "Improve User Adoption", "Reduce Churn", "Expand Enterprise Sales"],
      q2: "Who is your primary customer?",
      q2opts: ["Startup", "SMB", "Mid Market", "Enterprise"],
      q3: "What is your current product maturity?",
      q3opts: ["Early Product", "Growth", "Scale", "Enterprise Platform"],
      cta: "Start Cognitive Analysis",
    },
    transition: {
      l1: "Understanding your business context…",
      l2: "Preparing Cognitive Analysis…",
      l3: "Discovering your competitive landscape…",
    },
    footer1: "Powered by PULSE Cognitive Intelligence",
    footer2: "Enterprise Product Intelligence Platform",
  },
  es: {
    brand: "PULSE",
    langLabel: "ES",
    hero: {
      eyebrow: "Inteligencia de Producto Enterprise",
      title: "Convierte la Inteligencia de Mercado en Decisiones de Ingeniería.",
      subtitle:
        "PULSE descubre continuamente oportunidades de producto. FLOW las valida con evidencia real de mercado. Juntos generan recomendaciones listas para ingeniería y ejecución.",
      pill1: "Inteligencia de Producto Enterprise",
      pill2: "Análisis Cognitivo con IA",
      pill3: "Listo para Ingeniería",
      cta: "Iniciar Experiencia",
    },
    phases: {
      p01: "Conectar Workspace",
      p02: "Brief Estratégico",
      p03: "Clarificación de Contexto",
      p04: "Inteligencia Cognitiva",
      p05: "Validación FLOW",
      p06: "Blueprint de Producto",
      p07: "Delivery Hub",
    },
    timelineLabel: "Proceso Cognitivo",
    p1: {
      title: "Conecta tu Workspace de Producto",
      desc: "Conecta tu ecosistema de ingeniería para que PULSE entienda el contexto de tu producto antes de iniciar el análisis.",
      jira: "Jira Software",
      jiraDesc: "Sincroniza épicas, issues y señales del roadmap",
      status: "Estado",
      notConnected: "No Conectado",
      connect: "Conectar Workspace de Jira",
      connecting: "Estableciendo conexión segura…",
      connected: "Conectado Correctamente",
      connectedDetail:
        "Workspace conectado correctamente. PULSE está listo para iniciar el análisis estratégico.",
      more: "Más integraciones próximamente",
      soon: "Próximamente",
      continue: "Continuar",
    },
    p2: {
      title: "¿Qué reto estratégico quieres que PULSE analice?",
      subtitle:
        "Describe tu reto de negocio, iniciativa estratégica u oportunidad de producto.",
      placeholder:
        "Ejemplo:\nQueremos identificar oportunidades enterprise respaldadas por evidencia real de mercado.",
      starters: "Puntos de partida estratégicos",
      startersHint: "Toca uno para completar",
      cta: "Iniciar Análisis Estratégico",
      opts: [
        "Analiza cómo nuestros competidores están usando Agentes de IA en reclutamiento técnico e identifica oportunidades validadas que estamos perdiendo.",
        "Evalúa la estrategia de producto de las plataformas workforce de mayor crecimiento y recomienda oportunidades respaldadas por evidencia de mercado.",
        "Identifica brechas de features entre nuestro producto y competidores enterprise validando demanda con evidencia pública.",
        "Genera un análisis estratégico de producto incluyendo benchmarking competitivo, validación de mercado, riesgos de negocio, scoring de confianza y ejecución de ingeniería.",
      ],
      optLabels: [
        "Escaneo Competitivo de IA en Recruiting",
        "Estrategia de Plataformas Workforce",
        "Análisis de Brechas Enterprise",
        "Análisis Estratégico Completo",
      ],
    },
    p3: {
      title: "Algunas preguntas antes de comenzar",
      subtitle:
        "PULSE usará estas respuestas para dar forma al análisis cognitivo. No necesitas indicar competidores — PULSE los descubre automáticamente.",
      q1: "¿Cuál es tu objetivo principal?",
      q1opts: ["Aumentar Ingresos", "Mejorar Adopción", "Reducir Churn", "Expandir Ventas Enterprise"],
      q2: "¿Quién es tu cliente principal?",
      q2opts: ["Startup", "SMB", "Mid Market", "Enterprise"],
      q3: "¿Cuál es la madurez actual de tu producto?",
      q3opts: ["Producto Inicial", "Crecimiento", "Escala", "Plataforma Enterprise"],
      cta: "Iniciar Análisis Cognitivo",
    },
    transition: {
      l1: "Entendiendo el contexto de tu negocio…",
      l2: "Preparando el Análisis Cognitivo…",
      l3: "Descubriendo tu panorama competitivo…",
    },
    footer1: "Powered by PULSE Cognitive Intelligence",
    footer2: "Plataforma de Inteligencia de Producto Enterprise",
  },
};

export type Dict = (typeof translations)[Lang];
