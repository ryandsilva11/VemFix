/**
 * Utilitário para geração e download de Orçamento em PDF pelo navegador
 */
export function baixarOrcamentoPDF(orcamento) {
  if (!orcamento) return;

  const dataFormatada = orcamento.dataHora
    ? new Date(orcamento.dataHora).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');

  const valorFormatado = Number(orcamento.valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const janelaImpressao = window.open('', '_blank', 'width=850,height=900');
  if (!janelaImpressao) {
    alert('Por favor, permita pop-ups para fazer o download do orçamento em PDF.');
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Orçamento - ${orcamento.titulo || 'VemFix'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      color: #1a202c;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #1A9E6E;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand {
      font-size: 28px;
      font-weight: 900;
      color: #1A9E6E;
      letter-spacing: -0.5px;
    }
    .badge {
      background: #E8F8F1;
      color: #1A9E6E;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 13px;
    }
    .doc-title {
      font-size: 22px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 6px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #4B5563;
      border-bottom: 1px solid #E5E7EB;
      padding-bottom: 4px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .info-box {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .label {
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .value {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }
    .value-highlight {
      font-size: 24px;
      font-weight: 900;
      color: #1A9E6E;
    }
    .text-content {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 14px;
      font-size: 13.5px;
      color: #1F2937;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .image-container {
      margin-top: 12px;
      text-align: center;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 12px;
    }
    .image-container img {
      max-width: 100%;
      max-height: 280px;
      border-radius: 6px;
      object-fit: contain;
    }
    .footer {
      margin-top: 36px;
      border-top: 1px solid #E5E7EB;
      padding-top: 14px;
      text-align: center;
      font-size: 11px;
      color: #9CA3AF;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">VemFix</div>
      <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">Plataforma de Serviços e Orçamentos</div>
    </div>
    <div class="badge">Orçamento Oficial</div>
  </div>

  <div class="doc-title">${orcamento.titulo || 'Orçamento de Serviço'}</div>
  <div style="font-size: 13px; color: #6B7280; margin-bottom: 20px;">
    Emitido em: <strong>${dataFormatada}</strong> • Código: <strong>#ORC-${orcamento.id || 'RASCUNHO'}</strong>
  </div>

  <div class="grid-2">
    <div class="info-box">
      <div class="label">Prestador Responsável</div>
      <div class="value">${orcamento.prestadorNome || 'Não informado'}</div>
    </div>
    <div class="info-box">
      <div class="label">Cliente Solicitante</div>
      <div class="value">${orcamento.clienteNome || 'Não informado'}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="info-box">
      <div class="label">CEP do Local</div>
      <div class="value">${orcamento.cep || 'Não informado'}</div>
    </div>
    <div class="info-box">
      <div class="label">Valor Estimado</div>
      <div class="value-highlight">${valorFormatado}</div>
    </div>
  </div>

  <div class="section-title">Descrição do Problema</div>
  <div class="text-content">${orcamento.descProblema || 'Nenhum detalhe do problema informado.'}</div>

  <div class="section-title">Descrição do Serviço Planejado</div>
  <div class="text-content">${orcamento.descServico || 'Nenhum detalhe do serviço informado.'}</div>

  ${
    orcamento.anexo && orcamento.anexo.trim() !== '' && orcamento.anexo !== 'string'
      ? `
      <div class="section-title">Foto do Local / Problema</div>
      <div class="image-container">
        <img src="${orcamento.anexo}" alt="Foto do problema" />
      </div>
      `
      : ''
  }

  <div class="footer">
    Documento emitido eletronicamente via <strong>VemFix</strong>. Este orçamento representa a proposta formal acertada entre as partes.
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>
  `;

  janelaImpressao.document.open();
  janelaImpressao.document.write(html);
  janelaImpressao.document.close();
}
