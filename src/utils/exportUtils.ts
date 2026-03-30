// Export current page as PNG using html2canvas-like approach via browser print API
// We use canvas capture + download for PNG, and window.print() CSS for PDF

export async function exportAsPNG(elementId: string, filename: string) {
  const el = document.getElementById(elementId);
  if (!el) {
    alert('Элемент для экспорта не найден');
    return;
  }

  // Dynamically load html2canvas from CDN
  if (!(window as any).html2canvas) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load html2canvas'));
      document.head.appendChild(script);
    });
  }

  const canvas = await (window as any).html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#eef2f7',
    logging: false,
  });

  const link = document.createElement('a');
  link.download = filename + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportAsPDF(elementId: string, filename: string) {
  const el = document.getElementById(elementId);
  if (!el) {
    alert('Элемент для экспорта не найден');
    return;
  }

  // Load jsPDF + html2canvas
  if (!(window as any).html2canvas) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  }

  if (!(window as any).jspdf) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  }

  const canvas = await (window as any).html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#eef2f7',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = (window as any).jspdf;
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width / 2, canvas.height / 2],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(filename + '.pdf');
}