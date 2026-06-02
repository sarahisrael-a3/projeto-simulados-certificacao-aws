/**
 * pdfReport.js - Geração de relatório PDF de desempenho
 */

/**
 * Gera e baixa um PDF com o relatório de desempenho do simulado.
 * @param {object} results - Resultados do quiz (score, answers, domainScores, etc)
 * @param {object} certInfo - Info da certificação (name, domains[])
 */
export function generatePerformanceReport(results, certInfo) {
  if (!results || !results.answers || results.answers.length === 0) {
    alert(
      "Nenhum resultado encontrado. Conclua um simulado ou abra um relatório do histórico primeiro.",
    );
    return;
  }

  if (typeof window.jspdf === "undefined" && typeof jsPDF === "undefined") {
    alert(
      "Biblioteca jsPDF não carregada. Verifique se a tag <script> do jsPDF está no index.html.",
    );
    return;
  }

  const btn = document.getElementById("btn-generate-report");
  const oldHtml = btn ? btn.innerHTML : "";
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> GERANDO PDF...`;
    btn.disabled = true;
  }

  const { jsPDF: JsPDF } = window.jspdf || {};
  const Doc = JsPDF || jsPDF;
  const doc = new Doc({ unit: "mm", format: "a4", orientation: "portrait" });

  const pageW = 210,
    pageH = 297,
    marginL = 15,
    marginR = 15;
  const contentW = pageW - marginL - marginR;
  let y = 15;

  const certLabel =
    certInfo?.name ||
    document.getElementById("sidebar-cert-label")?.innerText ||
    results.certId?.toUpperCase() ||
    "AWS";
  const awsScore = Math.floor(((results.percentage || 0) / 100) * 900) + 100;
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  function wrap(text, maxW, size) {
    doc.setFontSize(size);
    return doc.splitTextToSize(String(text ?? ""), maxW);
  }
  function newPageIfNeeded(needed = 10) {
    if (y + needed > pageH - 15) {
      doc.addPage();
      y = 15;
    }
  }
  function fillRect(x, ry, w, h, r, g, b) {
    doc.setFillColor(r, g, b);
    doc.rect(x, ry, w, h, "F");
  }
  function rgb(r, g, b) {
    doc.setTextColor(r, g, b);
  }
  function black() {
    doc.setTextColor(17, 17, 17);
  }

  // 1. CABEÇALHO
  fillRect(0, 0, pageW, 30, 26, 26, 46);
  rgb(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("RELATORIO OFICIAL DE SIMULACAO AWS", marginL, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Certificacao: ${certLabel}   |   Pontuacao: ${awsScore} / 1000   |   Data: ${dataHoje}`,
    marginL,
    22,
  );
  y = 38;

  // 2. DOMÍNIOS
  black();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Desempenho por Dominio", marginL, y);
  y += 2;
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(0.5);
  doc.line(marginL, y, pageW - marginR, y);
  y += 6;

  const hasDomainsData =
    results.domainScores && Object.keys(results.domainScores).length > 0;
  const hasDomainDefs = certInfo?.domains?.length > 0;

  if (hasDomainsData && hasDomainDefs) {
    certInfo.domains.forEach((domain) => {
      const sd = results.domainScores[domain.id];
      if (!sd || sd.total === 0) return;
      newPageIfNeeded(22);
      const pct = (sd.correct / sd.total) * 100;
      const isOk = pct >= 70;
      const bgR = isOk ? 240 : 254,
        bgG = isOk ? 253 : 242,
        bgB = isOk ? 244 : 242;
      const lcR = isOk ? 22 : 220,
        lcG = isOk ? 163 : 38,
        lcB = isOk ? 74 : 38;

      fillRect(marginL, y, contentW, 20, bgR, bgG, bgB);
      doc.setFillColor(lcR, lcG, lcB);
      doc.rect(marginL, y, 2.5, 20, "F");
      black();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(wrap(domain.name, contentW - 35, 10)[0], marginL + 5, y + 7);
      rgb(lcR, lcG, lcB);
      doc.setFontSize(12);
      doc.text(`${pct.toFixed(0)}%`, pageW - marginR - 2, y + 8, {
        align: "right",
      });

      const bx = marginL + 5,
        by = y + 12,
        bw = contentW - 30;
      doc.setFillColor(220, 220, 220);
      doc.rect(bx, by, bw, 3, "F");
      doc.setFillColor(lcR, lcG, lcB);
      doc.rect(bx, by, bw * Math.min(pct / 100, 1), 3, "F");

      rgb(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        `${sd.correct} de ${sd.total} corretas   ${isOk ? "| APROVADO" : "| ATENCAO"}`,
        marginL + 5,
        y + 18,
      );
      y += 24;
    });
  } else if (hasDomainsData) {
    Object.entries(results.domainScores).forEach(([domainId, sd]) => {
      if (!sd || sd.total === 0) return;
      newPageIfNeeded(22);
      const pct = (sd.correct / sd.total) * 100;
      const isOk = pct >= 70;
      const lcR = isOk ? 22 : 220,
        lcG = isOk ? 163 : 38,
        lcB = isOk ? 74 : 38;
      fillRect(
        marginL,
        y,
        contentW,
        14,
        isOk ? 240 : 254,
        isOk ? 253 : 242,
        isOk ? 244 : 242,
      );
      doc.setFillColor(lcR, lcG, lcB);
      doc.rect(marginL, y, 2.5, 14, "F");
      black();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(String(domainId), marginL + 5, y + 6);
      rgb(lcR, lcG, lcB);
      doc.setFontSize(10);
      doc.text(
        `${pct.toFixed(0)}%  (${sd.correct}/${sd.total})  ${isOk ? "APROVADO" : "ATENCAO"}`,
        pageW - marginR - 2,
        y + 6,
        { align: "right" },
      );
      y += 17;
    });
  } else {
    rgb(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Dados de dominio nao disponiveis para este relatorio.",
      marginL,
      y,
    );
    y += 8;
  }

  y += 6;

  // 3. QUESTÕES
  newPageIfNeeded(20);
  black();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Detalhamento das Questoes", marginL, y);
  y += 2;
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(0.5);
  doc.line(marginL, y, pageW - marginR, y);
  y += 7;

  if (!results.answers || results.answers.length === 0) {
    rgb(150, 150, 150);
    doc.setFontSize(9);
    doc.text("Nenhuma questao disponivel.", marginL, y);
  } else {
    results.answers.forEach((ans, index) => {
      const isMulti = Array.isArray(ans.correct);
      const isCorrect = ans.isCorrect;

      let userText = "Nao respondida";
      if (ans.userSelection !== null && ans.userSelection !== undefined) {
        userText =
          isMulti && Array.isArray(ans.userSelection)
            ? ans.userSelection.map((i) => ans.options?.[i] ?? "?").join(" / ")
            : (ans.options?.[ans.userSelection] ?? "Opcao invalida");
      }

      let correctText = "Gabarito indisponivel";
      if (ans.correct !== null && ans.correct !== undefined) {
        correctText =
          isMulti && Array.isArray(ans.correct)
            ? ans.correct.map((i) => ans.options?.[i] ?? "?").join(" / ")
            : (ans.options?.[ans.correct] ?? "Opcao invalida");
      }

      const explanText = ans.explanation || "Sem explicacao adicional.";
      const LH = 4.5;
      const qLines = wrap(
        `${index + 1}. ${ans.question || "Questao"}`,
        contentW - 4,
        10,
      );
      const uLines = wrap(userText, contentW - 14, 9);
      const cLines = isCorrect ? [] : wrap(correctText, contentW - 14, 9);
      const eLines = wrap(explanText, contentW - 14, 9);

      const blockH =
        qLines.length * LH +
        8 +
        uLines.length * LH +
        14 +
        (isCorrect ? 0 : cLines.length * LH + 14) +
        eLines.length * LH +
        14;
      newPageIfNeeded(blockH);

      // Enunciado
      fillRect(marginL, y, contentW, qLines.length * LH + 6, 248, 249, 250);
      black();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(qLines, marginL + 3, y + 5);
      y += qLines.length * LH + 9;

      // Resposta do usuário
      const uR = isCorrect ? 22 : 220,
        uG = isCorrect ? 163 : 38,
        uB = isCorrect ? 74 : 38;
      fillRect(
        marginL,
        y,
        contentW,
        uLines.length * LH + 11,
        isCorrect ? 240 : 254,
        isCorrect ? 253 : 242,
        isCorrect ? 244 : 242,
      );
      doc.setFillColor(uR, uG, uB);
      doc.rect(marginL, y, 2.5, uLines.length * LH + 11, "F");
      rgb(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text(
        `SUA RESPOSTA [${isCorrect ? "CORRETA" : "INCORRETA"}]`,
        marginL + 5,
        y + 5,
      );
      rgb(uR, uG, uB);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(uLines, marginL + 5, y + 9);
      y += uLines.length * LH + 14;

      // Resposta correta (só se errou)
      if (!isCorrect) {
        fillRect(marginL, y, contentW, cLines.length * LH + 11, 240, 253, 244);
        doc.setFillColor(22, 163, 74);
        doc.rect(marginL, y, 2.5, cLines.length * LH + 11, "F");
        rgb(22, 101, 52);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.text("RESPOSTA OFICIAL", marginL + 5, y + 5);
        rgb(21, 128, 61);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(cLines, marginL + 5, y + 9);
        y += cLines.length * LH + 14;
      }

      // Explicação
      newPageIfNeeded(eLines.length * LH + 14);
      fillRect(marginL, y, contentW, eLines.length * LH + 11, 239, 246, 255);
      doc.setFillColor(59, 130, 246);
      doc.rect(marginL, y, 2.5, eLines.length * LH + 11, "F");
      rgb(30, 64, 175);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("EXPLICACAO", marginL + 5, y + 5);
      rgb(30, 58, 138);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(eLines, marginL + 5, y + 9);
      y += eLines.length * LH + 15;

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(marginL, y - 4, pageW - marginR, y - 4);
    });
  }

  // 4. RODAPÉ
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    rgb(170, 170, 170);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      `Simulador AWS  |  ${dataHoje}  |  Pagina ${p} de ${total}`,
      pageW / 2,
      pageH - 7,
      { align: "center" },
    );
  }

  // 5. SALVA
  const safeName = certLabel
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .toUpperCase();
  doc.save(
    `Relatorio_AWS_${safeName}_${new Date().toISOString().split("T")[0]}.pdf`,
  );

  if (btn) {
    btn.innerHTML = oldHtml;
    btn.disabled = false;
  }
}
