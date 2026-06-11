import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export async function exportRoadmapToPDF(elementId: string, careerPath: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add a class to hide interactive elements like buttons and fix gradients temporarily
  element.classList.add('pdf-export-mode');
  
  // Temporarily force the element and its parents to allow full height capture
  const originalHeight = element.style.height;
  const originalOverflow = element.style.overflow;
  element.style.height = 'max-content';
  element.style.overflow = 'visible';

  try {
    // Capture the full roadmap as a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200, // Enforce a standard desktop width for the PDF
      onclone: (clonedDoc) => {
        // Find the cloned element to apply any specific print styles
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.height = 'max-content';
          clonedElement.style.overflow = 'visible';
          // Find any scrollable parents and force them to expand
          let parent = clonedElement.parentElement;
          while (parent) {
            parent.style.height = 'max-content';
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
          }
        }
      }
    });

    // PDF setup
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // mm margin on all sides
    const pageWidth = pdfWidth - margin * 2;
    const pageHeight = pdfHeight - margin * 2;

    // Convert canvas dimensions (px) to PDF units (mm)
    // We fit the canvas width to the PDF page width
    const pxPerMm = canvas.width / pageWidth;
    const pageHeightPx = pageHeight * pxPerMm;

    // Header / Footer Function
    const addHeaderFooter = (pageNum: number, totalPages: number) => {
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      // Header
      pdf.text('CareerPilot AI', margin, margin - 2);
      pdf.text('AI Intelligence Report', pdfWidth - margin, margin - 2, { align: 'right' });
      
      // Footer
      const footerY = pdfHeight - margin + 6;
      pdf.text(new Date().toLocaleDateString(), margin, footerY);
      pdf.text(`Target: ${careerPath}`, pdfWidth / 2, footerY, { align: 'center' });
      pdf.text(`Page ${pageNum} of ${totalPages}`, pdfWidth - margin, footerY, { align: 'right' });
    };

    // Calculate how many pages we need
    const totalPages = Math.ceil(canvas.height / pageHeightPx);

    for (let i = 0; i < totalPages; i++) {
      // Create a slice canvas for this specific page
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      
      // For the last page, the height might be less than a full page
      const remainingHeightPx = canvas.height - i * pageHeightPx;
      const currentSliceHeightPx = Math.min(pageHeightPx, remainingHeightPx);
      
      sliceCanvas.height = currentSliceHeightPx;
      
      const ctx = sliceCanvas.getContext('2d');
      if (!ctx) continue;
      
      // Draw only the relevant vertical slice from the original canvas
      ctx.drawImage(
        canvas,
        0,
        i * pageHeightPx,
        canvas.width,
        currentSliceHeightPx,
        0,
        0,
        canvas.width,
        currentSliceHeightPx
      );

      const imgData = sliceCanvas.toDataURL('image/png', 1.0);
      
      if (i > 0) pdf.addPage();
      
      // The height of the image on the PDF must be proportional to its pixel height
      const printHeightMm = currentSliceHeightPx / pxPerMm;
      
      pdf.addImage(imgData, 'PNG', margin, margin, pageWidth, printHeightMm);
      addHeaderFooter(i + 1, totalPages);
    }

    pdf.save(`AI_Career_Report_${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error('PDF Export failed:', error);
  } finally {
    element.classList.remove('pdf-export-mode');
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
  }
}
