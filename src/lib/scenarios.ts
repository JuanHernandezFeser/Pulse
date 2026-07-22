import type { Lang } from "./pulse-i18n";

type L = { en: string; es: string };

interface ScenarioRaw {
  title: L;
  text: L;
  competitors: string[];
  sources: string[];
  marketCards: { label: L; value: L }[];
  marketIntents: L[];
  bench: { name: string; features: number }[];
  gapValues: number[];
  results: { label: L; value: string }[];
  confidenceItems: { label: L; value: L }[];
  flowPanels: { label: L; value: string }[];
  flowCases: {
    title: L;
    evidence: L;
    reason?: L;
  }[];
  flowMatrix: {
    opportunity: L;
    value: L;
    confidence: string;
    complexity: L;
    reason?: L;
  }[];
  confidenceMini: { label: L; value: L }[];
  overallConfidence: string;
  recommendationTitle: L;
  reasons: L[];
  pdf: {
    s1body: L;
    s2body: L;
    s3a: L;
    s3b: L;
    s3c: L;
    s4body: L;
    s5body: L;
  };
  jiraLines: L[];
}

export interface ScenarioData {
  title: string;
  text: string;
  competitors: string[];
  sources: string[];
  marketCards: { label: string; value: string }[];
  marketIntents: string[];
  bench: { name: string; features: number }[];
  gapValues: number[];
  results: { label: string; value: string }[];
  confidenceItems: { label: string; value: string }[];
  flowPanels: { label: string; value: string }[];
  flowCases: {
    title: string;
    evidence: string;
    reason?: string;
  }[];
  flowMatrix: {
    opportunity: string;
    value: string;
    confidence: string;
    complexity: string;
    reason?: string;
  }[];
  confidenceMini: { label: string; value: string }[];
  overallConfidence: string;
  recommendationTitle: string;
  reasons: string[];
  pdf: {
    s1body: string;
    s2body: string;
    s3a: string;
    s3b: string;
    s3c: string;
    s4body: string;
    s5body: string;
  };
  jiraLines: string[];
}

function l(val: L, lang: Lang): string {
  return val[lang];
}

export function localizeScenario(raw: ScenarioRaw, lang: Lang): ScenarioData {
  return {
    title: l(raw.title, lang),
    text: l(raw.text, lang),
    competitors: raw.competitors,
    sources: raw.sources,
    marketCards: raw.marketCards.map((c) => ({ label: l(c.label, lang), value: l(c.value, lang) })),
    marketIntents: raw.marketIntents.map((m) => l(m, lang)),
    bench: raw.bench,
    gapValues: raw.gapValues,
    results: raw.results.map((r) => ({ label: l(r.label, lang), value: r.value })),
    confidenceItems: raw.confidenceItems.map((c) => ({ label: l(c.label, lang), value: l(c.value, lang) })),
    flowPanels: raw.flowPanels.map((p) => ({ label: l(p.label, lang), value: p.value })),
    flowCases: raw.flowCases.map((c) => ({
      title: l(c.title, lang),
      evidence: l(c.evidence, lang),
      ...(c.reason ? { reason: l(c.reason, lang) } : {}),
    })),
    flowMatrix: raw.flowMatrix.map((m) => ({
      opportunity: l(m.opportunity, lang),
      value: l(m.value, lang),
      confidence: m.confidence,
      complexity: l(m.complexity, lang),
      ...(m.reason ? { reason: l(m.reason, lang) } : {}),
    })),
    confidenceMini: raw.confidenceMini.map((c) => ({ label: l(c.label, lang), value: l(c.value, lang) })),
    overallConfidence: raw.overallConfidence,
    recommendationTitle: l(raw.recommendationTitle, lang),
    reasons: raw.reasons.map((r) => l(r, lang)),
    pdf: {
      s1body: l(raw.pdf.s1body, lang),
      s2body: l(raw.pdf.s2body, lang),
      s3a: l(raw.pdf.s3a, lang),
      s3b: l(raw.pdf.s3b, lang),
      s3c: l(raw.pdf.s3c, lang),
      s4body: l(raw.pdf.s4body, lang),
      s5body: l(raw.pdf.s5body, lang),
    },
    jiraLines: raw.jiraLines.map((j) => l(j, lang)),
  };
}

export const scenariosRaw: ScenarioRaw[] = [
  {
    title: { en: "AI Product Strategy", es: "Estrategia de Producto con IA" },
    text: {
      en: "Analyze how enterprise software companies are adopting AI Agents across their products and identify the highest-impact opportunities validated by real market evidence.",
      es: "Analiza cómo las empresas de software enterprise están adoptando Agentes de IA en sus productos e identifica las oportunidades de mayor impacto validadas con evidencia real de mercado.",
    },
    competitors: ["Microsoft Copilot", "Atlassian Intelligence", "Notion AI", "Salesforce Einstein", "ServiceNow AI"],
    sources: ["Microsoft Learn", "Atlassian Documentation", "Anthropic", "OpenAI", "Google Cloud", "GitHub", "Gartner", "Developer Blogs"],
    marketCards: [
      { label: { en: "Business Domain", es: "Dominio de Negocio" }, value: { en: "Enterprise AI Platforms", es: "Plataformas de IA Enterprise" } },
      { label: { en: "Product Category", es: "Categoría de Producto" }, value: { en: "AI Agent Infrastructure", es: "Infraestructura de Agentes IA" } },
      { label: { en: "Target Market", es: "Mercado Objetivo" }, value: { en: "Enterprise Organizations", es: "Organizaciones Enterprise" } },
      { label: { en: "Primary Users", es: "Usuarios Principales" }, value: { en: "Product Teams · AI Engineers · Platform Leaders · Enterprise Architects", es: "Equipos de Producto · Ingenieros IA · Líderes de Plataforma · Arquitectos Enterprise" } },
    ],
    marketIntents: [
      { en: "Accelerate AI Agent adoption", es: "Acelerar la adopción de Agentes IA" },
      { en: "Ensure enterprise governance and compliance", es: "Asegurar gobernanza y cumplimiento enterprise" },
      { en: "Build competitive AI infrastructure", es: "Construir infraestructura IA competitiva" },
    ],
    bench: [
      { name: "Microsoft Copilot", features: 218 },
      { name: "Atlassian Intelligence", features: 164 },
      { name: "Notion AI", features: 142 },
      { name: "Salesforce Einstein", features: 196 },
      { name: "ServiceNow AI", features: 188 },
    ],
    gapValues: [47, 23, 18, 14],
    results: [
      { label: { en: "Sources Consulted", es: "Fuentes Consultadas" }, value: "186" },
      { label: { en: "Market Signals", es: "Señales de Mercado" }, value: "412" },
      { label: { en: "Validated Mentions", es: "Menciones Validadas" }, value: "638" },
      { label: { en: "Relevant Documents", es: "Documentos Relevantes" }, value: "94" },
      { label: { en: "Engineering References", es: "Referencias de Ingeniería" }, value: "112" },
    ],
    confidenceItems: [
      { label: { en: "Data Freshness", es: "Frescura de Datos" }, value: { en: "High", es: "Alta" } },
      { label: { en: "Source Diversity", es: "Diversidad de Fuentes" }, value: { en: "Excellent", es: "Excelente" } },
      { label: { en: "Evidence Quality", es: "Calidad de Evidencia" }, value: { en: "Verified", es: "Verificada" } },
      { label: { en: "Benchmark Coverage", es: "Cobertura del Benchmark" }, value: { en: "92%", es: "92%" } },
    ],
    flowPanels: [
      { label: { en: "Market Signals", es: "Señales de Mercado" }, value: "412" },
      { label: { en: "Evidence Sources", es: "Fuentes de Evidencia" }, value: "186" },
      { label: { en: "Validated Opportunities", es: "Oportunidades Validadas" }, value: "15" },
      { label: { en: "Rejected Opportunities", es: "Oportunidades Rechazadas" }, value: "6" },
      { label: { en: "Validation In Progress", es: "Validación en Progreso" }, value: "9" },
    ],
    flowCases: [
      {
        title: { en: "Enterprise AI Agent Orchestrator", es: "Orquestador de Agentes IA Enterprise" },
        evidence: {
          en: "187 verified public mentions across Gartner, Microsoft Learn, Anthropic documentation and enterprise case studies.",
          es: "187 menciones públicas verificadas en Gartner, Microsoft Learn, documentación de Anthropic y casos de estudio enterprise.",
        },
      },
      {
        title: { en: "Autonomous Decision Engine", es: "Motor de Decisiones Autónomo" },
        evidence: {
          en: "Only 11 public mentions. Insufficient enterprise governance validation.",
          es: "Solo 11 menciones públicas. Validación de gobernanza enterprise insuficiente.",
        },
        reason: { en: "Insufficient enterprise governance validation", es: "Validación de gobernanza enterprise insuficiente" },
      },
    ],
    flowMatrix: [
      { opportunity: { en: "AI Agent Orchestrator", es: "Orquestador de Agentes IA" }, value: { en: "Very High", es: "Muy Alto" }, confidence: "96%", complexity: { en: "Medium", es: "Media" } },
      { opportunity: { en: "Memory & Context Layer", es: "Capa de Memoria y Contexto" }, value: { en: "High", es: "Alto" }, confidence: "91%", complexity: { en: "Medium", es: "Media" } },
      { opportunity: { en: "Autonomous Decision Engine", es: "Motor de Decisiones Autónomo" }, value: { en: "Low", es: "Bajo" }, confidence: "22%", complexity: { en: "High", es: "Alta" }, reason: { en: "Weak governance evidence", es: "Evidencia de gobernanza débil" } },
    ],
    confidenceMini: [
      { label: { en: "Evidence Quality", es: "Calidad de Evidencia" }, value: { en: "Verified", es: "Verificada" } },
      { label: { en: "Market Coverage", es: "Cobertura de Mercado" }, value: { en: "Excellent", es: "Excelente" } },
      { label: { en: "Benchmark Reliability", es: "Fiabilidad del Benchmark" }, value: { en: "92%", es: "92%" } },
      { label: { en: "Strategic Priority", es: "Prioridad Estratégica" }, value: { en: "High", es: "Alta" } },
    ],
    overallConfidence: "93%",
    recommendationTitle: {
      en: "Prioritize building an Enterprise AI Agent Orchestrator with governance controls before autonomous decision-making capabilities.",
      es: "Prioriza construir un Orquestador de Agentes IA Enterprise con controles de gobernanza antes que capacidades de decisión autónoma.",
    },
    reasons: [
      { en: "Highest validated enterprise demand", es: "Mayor demanda enterprise validada" },
      { en: "Strong governance compliance signals", es: "Fuertes señales de cumplimiento de gobernanza" },
      { en: "Competitive differentiation vs Microsoft and Salesforce", es: "Diferenciación competitiva vs Microsoft y Salesforce" },
      { en: "Engineering feasibility with existing LLM APIs", es: "Factibilidad de ingeniería con APIs LLM existentes" },
      { en: "Validated by FLOW", es: "Validado por FLOW" },
    ],
    pdf: {
      s1body: { en: "Prioritize building an Enterprise AI Agent Orchestrator with governance controls before autonomous decision-making capabilities.", es: "Prioriza construir un Orquestador de Agentes IA Enterprise con controles de gobernanza antes que capacidades de decisión autónoma." },
      s2body: { en: "Microsoft Copilot, Salesforce Einstein and ServiceNow AI analyzed across 14 AI capabilities.", es: "Microsoft Copilot, Salesforce Einstein y ServiceNow AI analizados en 14 capacidades de IA." },
      s3a: { en: "AI Agent Orchestrator - Confidence 96%", es: "Orquestador de Agentes IA - Confianza 96%" },
      s3b: { en: "Memory & Context Layer - Confidence 91%", es: "Capa de Memoria y Contexto - Confianza 91%" },
      s3c: { en: "Autonomous Decision Engine - Rejected (22%)", es: "Motor de Decisiones Autónomo - Rechazado (22%)" },
      s4body: { en: "Overall Confidence: 93%. Benchmark Reliability: 92%.", es: "Confianza General: 93%. Fiabilidad del Benchmark: 92%." },
      s5body: { en: "Phased delivery of AI agent capabilities with governance-first approach, ready for sprint planning.", es: "Entrega por fases de capacidades de agentes IA con enfoque de gobernanza primero, listo para sprint planning." },
    },
    jiraLines: [
      { en: "Publishing...", es: "Publicando..." },
      { en: "Epic Created", es: "Épica Creada" },
      { en: "19 Stories Created", es: "19 Historias Creadas" },
      { en: "67 Tasks Created", es: "67 Tareas Creadas" },
      { en: "Evidence Attached", es: "Evidencia Adjuntada" },
      { en: "Ready for Sprint Planning", es: "Listo para Sprint Planning" },
    ],
  },
  {
    title: { en: "Competitive Product Benchmarking", es: "Benchmark Competitivo de Producto" },
    text: {
      en: "Identify feature gaps between our platform and the fastest-growing enterprise SaaS companies, validating every recommendation through competitive benchmarks and real market evidence.",
      es: "Identifica brechas de features entre nuestra plataforma y las empresas SaaS enterprise de mayor crecimiento, validando cada recomendación con benchmarks competitivos y evidencia real de mercado.",
    },
    competitors: ["Stripe", "Linear", "Notion", "HubSpot", "Monday.com"],
    sources: ["G2", "Capterra", "Product Hunt", "Release Notes", "NNGroup", "Reddit", "Official Documentation"],
    marketCards: [
      { label: { en: "Business Domain", es: "Dominio de Negocio" }, value: { en: "Enterprise SaaS", es: "SaaS Enterprise" } },
      { label: { en: "Product Category", es: "Categoría de Producto" }, value: { en: "Productivity Platform", es: "Plataforma de Productividad" } },
      { label: { en: "Target Market", es: "Mercado Objetivo" }, value: { en: "Mid-Market & Enterprise", es: "Mid-Market y Enterprise" } },
      { label: { en: "Primary Users", es: "Usuarios Principales" }, value: { en: "Product Managers · Engineering Teams · Operations · Delivery Teams", es: "Product Managers · Equipos de Ingeniería · Operaciones · Equipos de Delivery" } },
    ],
    marketIntents: [
      { en: "Close competitive feature gaps", es: "Cerrar brechas competitivas de features" },
      { en: "Validate demand through public evidence", es: "Validar demanda con evidencia pública" },
      { en: "Prioritize high-impact improvements", es: "Priorizar mejoras de alto impacto" },
    ],
    bench: [
      { name: "Stripe", features: 184 },
      { name: "Linear", features: 171 },
      { name: "Notion", features: 166 },
      { name: "HubSpot", features: 179 },
      { name: "Monday.com", features: 193 },
    ],
    gapValues: [31, 12, 11, 8],
    results: [
      { label: { en: "Sources Consulted", es: "Fuentes Consultadas" }, value: "148" },
      { label: { en: "Market Signals", es: "Señales de Mercado" }, value: "326" },
      { label: { en: "Validated Mentions", es: "Menciones Validadas" }, value: "512" },
      { label: { en: "Relevant Documents", es: "Documentos Relevantes" }, value: "83" },
      { label: { en: "Engineering References", es: "Referencias de Ingeniería" }, value: "97" },
    ],
    confidenceItems: [
      { label: { en: "Data Freshness", es: "Frescura de Datos" }, value: { en: "High", es: "Alta" } },
      { label: { en: "Source Diversity", es: "Diversidad de Fuentes" }, value: { en: "Excellent", es: "Excelente" } },
      { label: { en: "Evidence Quality", es: "Calidad de Evidencia" }, value: { en: "Verified", es: "Verificada" } },
      { label: { en: "Benchmark Coverage", es: "Cobertura del Benchmark" }, value: { en: "95%", es: "95%" } },
    ],
    flowPanels: [
      { label: { en: "Market Signals", es: "Señales de Mercado" }, value: "326" },
      { label: { en: "Evidence Sources", es: "Fuentes de Evidencia" }, value: "148" },
      { label: { en: "Validated Opportunities", es: "Oportunidades Validadas" }, value: "12" },
      { label: { en: "Rejected Opportunities", es: "Oportunidades Rechazadas" }, value: "4" },
      { label: { en: "Validation In Progress", es: "Validación en Progreso" }, value: "7" },
    ],
    flowCases: [
      {
        title: { en: "AI Candidate Ranking", es: "Ranking de Candidatos con IA" },
        evidence: {
          en: "126 verified public mentions across Gartner, GitHub, Reddit and industry reports.",
          es: "126 menciones públicas verificadas en Gartner, GitHub, Reddit e informes del sector.",
        },
      },
      {
        title: { en: "Offline Candidate Ranking", es: "Ranking de Candidatos Offline" },
        evidence: {
          en: "Only 4 public mentions. Insufficient market validation.",
          es: "Solo 4 menciones públicas. Validación de mercado insuficiente.",
        },
        reason: { en: "Insufficient market validation", es: "Validación de mercado insuficiente" },
      },
    ],
    flowMatrix: [
      { opportunity: { en: "AI Candidate Ranking", es: "Ranking de Candidatos con IA" }, value: { en: "Very High", es: "Muy Alto" }, confidence: "94%", complexity: { en: "Medium", es: "Media" } },
      { opportunity: { en: "Predictive Talent Scoring", es: "Scoring Predictivo de Talento" }, value: { en: "High", es: "Alto" }, confidence: "91%", complexity: { en: "Medium", es: "Media" } },
      { opportunity: { en: "Offline Recruiting Mode", es: "Modo Recruiting Offline" }, value: { en: "Low", es: "Bajo" }, confidence: "18%", complexity: { en: "High", es: "Alta" }, reason: { en: "Weak evidence", es: "Evidencia débil" } },
    ],
    confidenceMini: [
      { label: { en: "Evidence Quality", es: "Calidad de Evidencia" }, value: { en: "Verified", es: "Verificada" } },
      { label: { en: "Market Coverage", es: "Cobertura de Mercado" }, value: { en: "Excellent", es: "Excelente" } },
      { label: { en: "Benchmark Reliability", es: "Fiabilidad del Benchmark" }, value: { en: "95%", es: "95%" } },
      { label: { en: "Strategic Priority", es: "Prioridad Estratégica" }, value: { en: "High", es: "Alta" } },
    ],
    overallConfidence: "94%",
    recommendationTitle: {
      en: "Prioritize AI-assisted candidate matching before redesigning the recruiting workflow.",
      es: "Prioriza el matching de candidatos asistido por IA antes de rediseñar el flujo de reclutamiento.",
    },
    reasons: [
      { en: "Highest validated business impact", es: "Mayor impacto de negocio validado" },
      { en: "Strong public demand", es: "Fuerte demanda pública" },
      { en: "Competitive differentiation", es: "Diferenciación competitiva" },
      { en: "Engineering feasibility", es: "Factibilidad de ingeniería" },
      { en: "Validated by FLOW", es: "Validado por FLOW" },
    ],
    pdf: {
      s1body: { en: "Prioritize AI-assisted candidate matching before redesigning the recruiting workflow.", es: "Prioriza el matching de candidatos asistido por IA antes de rediseñar el flujo de reclutamiento." },
      s2body: { en: "Stripe, Ramp and adjacent leaders analyzed across 12 capabilities.", es: "Stripe, Ramp y líderes adyacentes analizados en 12 capacidades." },
      s3a: { en: "AI Candidate Ranking - Confidence 94%", es: "Ranking de Candidatos con IA - Confianza 94%" },
      s3b: { en: "Predictive Talent Scoring - Confidence 91%", es: "Scoring Predictivo de Talento - Confianza 91%" },
      s3c: { en: "Offline Recruiting Mode - Rejected (18%)", es: "Modo Recruiting Offline - Rechazado (18%)" },
      s4body: { en: "Overall Confidence: 94%. Benchmark Reliability: 95%.", es: "Confianza General: 94%. Fiabilidad del Benchmark: 95%." },
      s5body: { en: "Phased delivery of validated capabilities, ready for sprint planning.", es: "Entrega por fases de capacidades validadas, listo para sprint planning." },
    },
    jiraLines: [
      { en: "Publishing...", es: "Publicando..." },
      { en: "Epic Created", es: "Épica Creada" },
      { en: "23 Stories Created", es: "23 Historias Creadas" },
      { en: "81 Tasks Created", es: "81 Tareas Creadas" },
      { en: "Evidence Attached", es: "Evidencia Adjuntada" },
      { en: "Ready for Sprint Planning", es: "Listo para Sprint Planning" },
    ],
  },
  {
    title: { en: "Engineering Excellence", es: "Excelencia en Ingeniería" },
    text: {
      en: "Benchmark modern engineering organizations and recommend initiatives that improve software delivery, product quality and developer productivity.",
      es: "Compara organizaciones de ingeniería modernas y recomienda iniciativas que mejoren la entrega de software, la calidad del producto y la productividad de los desarrolladores.",
    },
    competitors: ["GitHub", "GitLab", "Linear", "Atlassian", "Vercel"],
    sources: ["GitHub Engineering", "Vercel Blog", "Stack Overflow", "Google Engineering", "DevOps Reports", "Accelerate State of DevOps"],
    marketCards: [
      { label: { en: "Business Domain", es: "Dominio de Negocio" }, value: { en: "Developer Tools & Platform Engineering", es: "Herramientas para Desarrolladores e Ingeniería de Plataforma" } },
      { label: { en: "Product Category", es: "Categoría de Producto" }, value: { en: "Engineering Productivity", es: "Productividad de Ingeniería" } },
      { label: { en: "Target Market", es: "Mercado Objetivo" }, value: { en: "Engineering Organizations", es: "Organizaciones de Ingeniería" } },
      { label: { en: "Primary Users", es: "Usuarios Principales" }, value: { en: "Engineering Leaders · DevOps · Platform Teams · Developers", es: "Líderes de Ingeniería · DevOps · Equipos de Plataforma · Desarrolladores" } },
    ],
    marketIntents: [
      { en: "Improve deployment frequency", es: "Mejorar la frecuencia de despliegue" },
      { en: "Reduce lead time for changes", es: "Reducir el tiempo de entrega de cambios" },
      { en: "Enhance developer experience", es: "Mejorar la experiencia del desarrollador" },
    ],
    bench: [
      { name: "GitHub", features: 202 },
      { name: "GitLab", features: 189 },
      { name: "Linear", features: 156 },
      { name: "Atlassian", features: 178 },
      { name: "Vercel", features: 145 },
    ],
    gapValues: [38, 19, 15, 11],
    results: [
      { label: { en: "Sources Consulted", es: "Fuentes Consultadas" }, value: "204" },
      { label: { en: "Market Signals", es: "Señales de Mercado" }, value: "478" },
      { label: { en: "Validated Mentions", es: "Menciones Validadas" }, value: "723" },
      { label: { en: "Relevant Documents", es: "Documentos Relevantes" }, value: "112" },
      { label: { en: "Engineering References", es: "Referencias de Ingeniería" }, value: "156" },
    ],
    confidenceItems: [
      { label: { en: "Data Freshness", es: "Frescura de Datos" }, value: { en: "Very High", es: "Muy Alta" } },
      { label: { en: "Source Diversity", es: "Diversidad de Fuentes" }, value: { en: "Excellent", es: "Excelente" } },
      { label: { en: "Evidence Quality", es: "Calidad de Evidencia" }, value: { en: "Verified", es: "Verificada" } },
      { label: { en: "Benchmark Coverage", es: "Cobertura del Benchmark" }, value: { en: "97%", es: "97%" } },
    ],
    flowPanels: [
      { label: { en: "Market Signals", es: "Señales de Mercado" }, value: "478" },
      { label: { en: "Evidence Sources", es: "Fuentes de Evidencia" }, value: "204" },
      { label: { en: "Validated Opportunities", es: "Oportunidades Validadas" }, value: "18" },
      { label: { en: "Rejected Opportunities", es: "Oportunidades Rechazadas" }, value: "5" },
      { label: { en: "Validation In Progress", es: "Validación en Progreso" }, value: "8" },
    ],
    flowCases: [
      {
        title: { en: "Internal Developer Portal", es: "Portal Interno para Desarrolladores" },
        evidence: {
          en: "203 verified public mentions across GitHub Engineering, Vercel Blog, Stack Overflow and DevOps reports.",
          es: "203 menciones públicas verificadas en GitHub Engineering, Vercel Blog, Stack Overflow e informes de DevOps.",
        },
      },
      {
        title: { en: "Fully Autonomous Deployment", es: "Despliegue Totalmente Autónomo" },
        evidence: {
          en: "Only 17 public mentions. Insufficient safety validation.",
          es: "Solo 17 menciones públicas. Validación de seguridad insuficiente.",
        },
        reason: { en: "Insufficient safety validation", es: "Validación de seguridad insuficiente" },
      },
    ],
    flowMatrix: [
      { opportunity: { en: "Developer Portal", es: "Portal para Desarrolladores" }, value: { en: "Very High", es: "Muy Alto" }, confidence: "97%", complexity: { en: "Medium", es: "Media" } },
      { opportunity: { en: "Release Automation", es: "Automatización de Releases" }, value: { en: "High", es: "Alto" }, confidence: "93%", complexity: { en: "Low", es: "Baja" } },
      { opportunity: { en: "Fully Autonomous Deployment", es: "Despliegue Totalmente Autónomo" }, value: { en: "Low", es: "Bajo" }, confidence: "24%", complexity: { en: "High", es: "Alta" }, reason: { en: "Weak safety evidence", es: "Evidencia de seguridad débil" } },
    ],
    confidenceMini: [
      { label: { en: "Evidence Quality", es: "Calidad de Evidencia" }, value: { en: "Verified", es: "Verificada" } },
      { label: { en: "Market Coverage", es: "Cobertura de Mercado" }, value: { en: "Excellent", es: "Excelente" } },
      { label: { en: "Benchmark Reliability", es: "Fiabilidad del Benchmark" }, value: { en: "97%", es: "97%" } },
      { label: { en: "Strategic Priority", es: "Prioridad Estratégica" }, value: { en: "Critical", es: "Crítica" } },
    ],
    overallConfidence: "96%",
    recommendationTitle: {
      en: "Build an Internal Developer Portal with automated release pipelines before pursuing fully autonomous deployments.",
      es: "Construye un Portal Interno para Desarrolladores con pipelines de release automatizados antes de perseguir despliegues totalmente autónomos.",
    },
    reasons: [
      { en: "Highest engineering impact validated", es: "Mayor impacto de ingeniería validado" },
      { en: "Strong industry adoption signals", es: "Fuertes señales de adopción en la industria" },
      { en: "Proven by top engineering organizations", es: "Probado por organizaciones de ingeniería líderes" },
      { en: "Incremental implementation path", es: "Camino de implementación incremental" },
      { en: "Validated by FLOW", es: "Validado por FLOW" },
    ],
    pdf: {
      s1body: { en: "Build an Internal Developer Portal with automated release pipelines before pursuing fully autonomous deployments.", es: "Construye un Portal Interno para Desarrolladores con pipelines de release automatizados antes de perseguir despliegues totalmente autónomos." },
      s2body: { en: "GitHub, GitLab and Vercel engineering practices analyzed across 16 capabilities.", es: "Prácticas de ingeniería de GitHub, GitLab y Vercel analizadas en 16 capacidades." },
      s3a: { en: "Developer Portal - Confidence 97%", es: "Portal para Desarrolladores - Confianza 97%" },
      s3b: { en: "Release Automation - Confidence 93%", es: "Automatización de Releases - Confianza 93%" },
      s3c: { en: "Fully Autonomous Deployment - Rejected (24%)", es: "Despliegue Totalmente Autónomo - Rechazado (24%)" },
      s4body: { en: "Overall Confidence: 96%. Benchmark Reliability: 97%.", es: "Confianza General: 96%. Fiabilidad del Benchmark: 97%." },
      s5body: { en: "Phased engineering improvements with platform-first approach, ready for sprint planning.", es: "Mejoras de ingeniería por fases con enfoque de plataforma primero, listo para sprint planning." },
    },
    jiraLines: [
      { en: "Publishing...", es: "Publicando..." },
      { en: "Epic Created", es: "Épica Creada" },
      { en: "27 Stories Created", es: "27 Historias Creadas" },
      { en: "94 Tasks Created", es: "94 Tareas Creadas" },
      { en: "Evidence Attached", es: "Evidencia Adjuntada" },
      { en: "Ready for Sprint Planning", es: "Listo para Sprint Planning" },
    ],
  },
  {
    title: { en: "Enterprise Customer Experience", es: "Experiencia Customer Enterprise" },
    text: {
      en: "Evaluate how leading enterprise SaaS companies optimize onboarding, activation and long-term product adoption, generating engineering-ready recommendations backed by market evidence.",
      es: "Evalúa cómo las principales empresas SaaS enterprise optimizan onboarding, activación y adopción a largo plazo del producto, generando recomendaciones listas para ingeniería respaldadas por evidencia de mercado.",
    },
    competitors: ["Slack", "HubSpot", "Notion", "Asana", "Zoom"],
    sources: ["NNGroup", "Pendo", "Amplitude", "Mixpanel", "G2", "Customer Reviews", "Official Blogs"],
    marketCards: [
      { label: { en: "Business Domain", es: "Dominio de Negocio" }, value: { en: "Enterprise SaaS", es: "SaaS Enterprise" } },
      { label: { en: "Product Category", es: "Categoría de Producto" }, value: { en: "Customer Experience Platform", es: "Plataforma de Experiencia del Cliente" } },
      { label: { en: "Target Market", es: "Mercado Objetivo" }, value: { en: "Enterprise Organizations", es: "Organizaciones Enterprise" } },
      { label: { en: "Primary Users", es: "Usuarios Principales" }, value: { en: "Product Managers · Customer Success · Growth Teams · UX Designers", es: "Product Managers · Customer Success · Equipos de Growth · Diseñadores UX" } },
    ],
    marketIntents: [
      { en: "Improve onboarding activation rates", es: "Mejorar tasas de activación en onboarding" },
      { en: "Increase long-term product adoption", es: "Aumentar la adopción del producto a largo plazo" },
      { en: "Reduce time-to-value for enterprise users", es: "Reducir el tiempo de valor para usuarios enterprise" },
    ],
    bench: [
      { name: "Slack", features: 176 },
      { name: "HubSpot", features: 198 },
      { name: "Notion", features: 158 },
      { name: "Asana", features: 167 },
      { name: "Zoom", features: 184 },
    ],
    gapValues: [42, 21, 16, 12],
    results: [
      { label: { en: "Sources Consulted", es: "Fuentes Consultadas" }, value: "167" },
      { label: { en: "Market Signals", es: "Señales de Mercado" }, value: "389" },
      { label: { en: "Validated Mentions", es: "Menciones Validadas" }, value: "594" },
      { label: { en: "Relevant Documents", es: "Documentos Relevantes" }, value: "98" },
      { label: { en: "Engineering References", es: "Referencias de Ingeniería" }, value: "87" },
    ],
    confidenceItems: [
      { label: { en: "Data Freshness", es: "Frescura de Datos" }, value: { en: "High", es: "Alta" } },
      { label: { en: "Source Diversity", es: "Diversidad de Fuentes" }, value: { en: "Very Good", es: "Muy Buena" } },
      { label: { en: "Evidence Quality", es: "Calidad de Evidencia" }, value: { en: "Verified", es: "Verificada" } },
      { label: { en: "Benchmark Coverage", es: "Cobertura del Benchmark" }, value: { en: "91%", es: "91%" } },
    ],
    flowPanels: [
      { label: { en: "Market Signals", es: "Señales de Mercado" }, value: "389" },
      { label: { en: "Evidence Sources", es: "Fuentes de Evidencia" }, value: "167" },
      { label: { en: "Validated Opportunities", es: "Oportunidades Validadas" }, value: "14" },
      { label: { en: "Rejected Opportunities", es: "Oportunidades Rechazadas" }, value: "5" },
      { label: { en: "Validation In Progress", es: "Validación en Progreso" }, value: "8" },
    ],
    flowCases: [
      {
        title: { en: "Interactive Onboarding System", es: "Sistema de Onboarding Interactivo" },
        evidence: {
          en: "152 verified public mentions across NNGroup, Pendo, Amplitude and enterprise customer reviews.",
          es: "152 menciones públicas verificadas en NNGroup, Pendo, Amplitude y reseñas de clientes enterprise.",
        },
      },
      {
        title: { en: "AI-Powered Feature Discovery", es: "Descubimiento de Features con IA" },
        evidence: {
          en: "Only 9 public mentions. Insufficient adoption validation.",
          es: "Solo 9 menciones públicas. Validación de adopción insuficiente.",
        },
        reason: { en: "Insufficient adoption validation", es: "Validación de adopción insuficiente" },
      },
    ],
    flowMatrix: [
      { opportunity: { en: "Interactive Onboarding", es: "Onboarding Interactivo" }, value: { en: "Very High", es: "Muy Alto" }, confidence: "95%", complexity: { en: "Low", es: "Baja" } },
      { opportunity: { en: "Guided Product Tours", es: "Tours Guiados de Producto" }, value: { en: "High", es: "Alto" }, confidence: "89%", complexity: { en: "Low", es: "Baja" } },
      { opportunity: { en: "AI-Powered Feature Discovery", es: "Descubimiento de Features con IA" }, value: { en: "Low", es: "Bajo" }, confidence: "19%", complexity: { en: "High", es: "Alta" }, reason: { en: "Weak adoption evidence", es: "Evidencia de adopción débil" } },
    ],
    confidenceMini: [
      { label: { en: "Evidence Quality", es: "Calidad de Evidencia" }, value: { en: "Verified", es: "Verificada" } },
      { label: { en: "Market Coverage", es: "Cobertura de Mercado" }, value: { en: "Very Good", es: "Muy Buena" } },
      { label: { en: "Benchmark Reliability", es: "Fiabilidad del Benchmark" }, value: { en: "91%", es: "91%" } },
      { label: { en: "Strategic Priority", es: "Prioridad Estratégica" }, value: { en: "High", es: "Alta" } },
    ],
    overallConfidence: "92%",
    recommendationTitle: {
      en: "Implement interactive onboarding with guided tours before investing in AI-powered feature discovery.",
      es: "Implementa onboarding interactivo con tours guiados antes de invertir en descubimiento de features con IA.",
    },
    reasons: [
      { en: "Highest validated activation impact", es: "Mayor impacto de activación validado" },
      { en: "Strong customer success evidence", es: "Fuerte evidencia de customer success" },
      { en: "Proven by Slack, HubSpot and Notion", es: "Probado por Slack, HubSpot y Notion" },
      { en: "Low implementation complexity", es: "Baja complejidad de implementación" },
      { en: "Validated by FLOW", es: "Validado por FLOW" },
    ],
    pdf: {
      s1body: { en: "Implement interactive onboarding with guided tours before investing in AI-powered feature discovery.", es: "Implementa onboarding interactivo con tours guiados antes de invertir en descubimiento de features con IA." },
      s2body: { en: "Slack, HubSpot and Notion customer experience analyzed across 13 capabilities.", es: "Experiencia del cliente de Slack, HubSpot y Notion analizada en 13 capacidades." },
      s3a: { en: "Interactive Onboarding - Confidence 95%", es: "Onboarding Interactivo - Confianza 95%" },
      s3b: { en: "Guided Product Tours - Confidence 89%", es: "Tours Guiados de Producto - Confianza 89%" },
      s3c: { en: "AI-Powered Feature Discovery - Rejected (19%)", es: "Descubimiento de Features con IA - Rechazado (19%)" },
      s4body: { en: "Overall Confidence: 92%. Benchmark Reliability: 91%.", es: "Confianza General: 92%. Fiabilidad del Benchmark: 91%." },
      s5body: { en: "Phased customer experience improvements with onboarding-first approach, ready for sprint planning.", es: "Mejoras de experiencia del cliente por fases con enfoque de onboarding primero, listo para sprint planning." },
    },
    jiraLines: [
      { en: "Publishing...", es: "Publicando..." },
      { en: "Epic Created", es: "Épica Creada" },
      { en: "21 Stories Created", es: "21 Historias Creadas" },
      { en: "73 Tasks Created", es: "73 Tareas Creadas" },
      { en: "Evidence Attached", es: "Evidencia Adjuntada" },
      { en: "Ready for Sprint Planning", es: "Listo para Sprint Planning" },
    ],
  },
];
