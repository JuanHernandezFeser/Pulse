/**
 * Generates a PULSE Executive Report PDF using the dental scheduling brief,
 * then extracts and displays the raw text to verify UTF-8 encoding.
 */
import { jsPDF } from "jspdf";
import { readFileSync, statSync } from "fs";
import { resolve } from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseMod = require("pdf-parse");
const pdfParse = pdfParseMod.default || pdfParseMod;

// Content from the last Gemini run (dental scheduling brief)
const content = {
  heading: "PULSE Executive Report",
  s1: "1. Executive Summary",
  s1body: "Recomendamos priorizar el lanzamiento de un flujo de agendamiento nativo con WhatsApp Business API combinado con el cobro de señas por Mercado Pago para clínicas odontológicas en Argentina. Con base en el análisis de 342 señales de mercado, esta solución resuelve directamente la principal problemática operativa del ausentismo de pacientes. La implementación de confirmaciones bidireccionales automatizadas por WhatsApp y facturación adaptada a AFIP garantiza la retención inmediata de ingresos y una alta adopción en consultorios independientes.",
  s2: "2. Competitive Benchmark",
  s2body: "El análisis de mercado sobre 128 fuentes indica que plataformas establecidas como Dentalink (245 funciones) y Doctoralia (215 funciones) carecen de flujos de pago localizados para la economía argentina. Mientras que AgendaPro (180 funciones) y XDental (155 funciones) se enfocan en la gestión clínica general, no logran automatizar la interacción posterior a la reserva de forma efectiva. Nuestro conjunto de 342 señales de mercado confirma una sólida demanda de herramientas ligeras y automatizadas que se integren sin fricción con Mercado Pago y los hábitos locales de mensajería.",
  s3: "3. Validated Opportunities",
  s3a: "Agendamiento y Recordatorios Automatizados Bidireccionales por WhatsApp — Confianza 96% — Oportunidad de mayor impacto que reduce el ausentismo un 40% mediante actualizaciones de agenda en tiempo real.",
  s3b: "Cobro de Señas por Mercado Pago y Facturación Electrónica AFIP — Confianza 91% — Integración de alto valor que elimina cancelaciones de último momento y automatiza el cumplimiento fiscal en Argentina.",
  s3c: "Interpretación Diagnóstica Automatizada de Radiografías con IA — Rechazada (34%) — Alta incertidumbre regulatoria bajo normativas de ANMAT y excesiva complejidad técnica en comparación con las prioridades del mercado.",
  s4: "4. Business Impact",
  s4body: "El modelo de inteligencia de producto alcanza una puntuación de confianza global del 94%, respaldado por una frescura de datos del 96% y una cobertura de mercado del 92%. La confiabilidad del benchmark se evalúa en un 94%, sustentada en un análisis funcional directo frente a competidores regionales activos. La validación en 215 documentos relevantes del mercado confirma que priorizar la automatización de mensajería y pagos genera el máximo retorno de inversión a corto plazo.",
  s5: "5. Engineering Roadmap",
  s5body: "La Fase 1 entregará la integración bidireccional con WhatsApp Business API y la sincronización de agenda para abordar la gestión de turnos de inmediato. La Fase 2 introducirá los enlaces de pago de señas con Mercado Pago y los flujos automatizados de facturación AFIP para asegurar el compromiso financiero. Todos los elementos del backlog están completamente desglosados y listos para la planificación inmediata del sprint.",
};

function buildPdf() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 60;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;
  let y = margin;

  const addHeading = (text, size) => {
    if (y > 720) { doc.addPage(); y = margin; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.text(text, margin, y);
    y += size + 10;
  };

  const addBody = (text) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text, maxLineWidth);
    for (const line of lines) {
      if (y > 760) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += 16;
    }
    y += 8;
  };

  addHeading(content.heading, 18);
  y += 4;

  addHeading(content.s1, 13);
  addBody(content.s1body);

  addHeading(content.s2, 13);
  addBody(content.s2body);

  addHeading(content.s3, 13);
  addBody(content.s3a);
  addBody(content.s3b);
  addBody(content.s3c);

  addHeading(content.s4, 13);
  addBody(content.s4body);

  addHeading(content.s5, 13);
  addBody(content.s5body);

  const outPath = resolve(import.meta.dirname, "..", "test-report.pdf");
  doc.save(outPath);
  return outPath;
}

async function main() {
  const pdfPath = buildPdf();
  const size = statSync(pdfPath).size;
  console.log(`PDF saved: ${pdfPath}`);
  console.log(`File size: ${(size / 1024).toFixed(1)} KB`);

  const buf = readFileSync(pdfPath);
  const data = await pdfParse(buf);
  console.log(`\nPages: ${data.numpages}`);
  console.log(`Characters extracted: ${data.text.length}`);
  console.log(`\n========== EXTRACTED TEXT (first 3000 chars) ==========\n`);
  console.log(data.text.slice(0, 3000));
  console.log(`\n========== SEARCHING FOR ACCENTED CHARS ==========\n`);

  // Find lines with accents and ñ
  const lines = data.text.split("\n").filter((l) => /[áéíóúñüÁÉÍÓÚÑÜ]/.test(l));
  console.log(`Lines with accented chars: ${lines.length}`);
  for (const line of lines.slice(0, 8)) {
    console.log(`  > ${line.slice(0, 120)}`);
  }
}

main();
