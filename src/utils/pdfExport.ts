import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export async function exportRoadmapToPDF(elementId: string, careerPath: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add a class to hide interactive elements like buttons and fix gradients temporarily
  element.classList.add('pdf-export-mode');

  try {
    // Capture the full roadmap as a canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1200,
  });

  // PDF setup
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = 10; // mm
  const pageWidth = pdfWidth - margin * 2;
  const pageHeight = pdfHeight - margin * 2;

  // Convert canvas dimensions (px) to PDF units (mm)
  const pxPerMm = canvas.width / pageWidth; // pixels per mm
  const pageHeightPx = pageHeight * pxPerMm;

  // Header / Footer
  const addHeaderFooter = (pageNum: number, totalPages: number) => {
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text('CareerPilot AI', margin, margin - 2);
    pdf.text('AI Evolution Intelligence Report', pdfWidth - margin, margin - 2, { align: 'right' });
    const footerY = pdfHeight - margin + 4;
    pdf.text(new Date().toLocaleDateString(), margin, footerY);
    pdf.text(`Target: ${careerPath}`, pdfWidth / 2, footerY, { align: 'center' });
    pdf.text(`Page ${pageNum} of ${totalPages}`, pdfWidth - margin, footerY, { align: 'right' });
  };

  // Slice canvas into pages
  const totalPages = Math.ceil(canvas.height / pageHeightPx);
  for (let i = 0; i < totalPages; i++) {
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = Math.min(pageHeightPx, canvas.height - i * pageHeightPx);
    const ctx = sliceCanvas.getContext('2d');
    if (!ctx) continue;
    ctx.drawImage(
      canvas,
      0,
      i * pageHeightPx,
      canvas.width,
      sliceCanvas.height,
      0,
      0,
      canvas.width,
      sliceCanvas.height
    );
    const imgData = sliceCanvas.toDataURL('image/png');
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, margin, pageWidth, pageHeight);
    addHeaderFooter(i + 1, totalPages);
  }

  pdf.save(`AI_Career_Roadmap_${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error('PDF Export failed:', error);
  } finally {
    element.classList.remove('pdf-export-mode');
  }
}
