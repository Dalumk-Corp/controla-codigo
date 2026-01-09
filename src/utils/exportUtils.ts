export const jsonToCsv = (jsonData: any): string => {
  if (!jsonData) return '';

  const processArray = (arr: any[]) => {
      if (!arr || arr.length === 0) return '';
      const keys = Object.keys(arr[0]);
      const rows = [keys.join(',')];
      for (const row of arr) {
        const values = keys.map(key => {
          let cell = row[key] === null || row[key] === undefined ? '' : String(row[key]);
          cell = cell.replace(/"/g, '""'); // Escape double quotes
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`; // Quote fields with commas, double quotes, or newlines
          }
          return cell;
        });
        rows.push(values.join(','));
      }
      return rows.join('\n');
  };

  if (Array.isArray(jsonData)) {
    return processArray(jsonData);
  } else if (typeof jsonData === 'object') {
     // It's an object of arrays e.g. { incomes: [...], expenses: [...] }
     let combinedCsv = '';
     Object.keys(jsonData).forEach(key => {
         if (Array.isArray(jsonData[key])) {
             combinedCsv += `${key.toUpperCase()}\n`;
             combinedCsv += processArray(jsonData[key]);
             combinedCsv += '\n\n';
         }
     });
     return combinedCsv;
  }

  return '';
};

export const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generatePDF = (data: any, fileName: string, title: string) => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);

  let startY = 30;

  const processData = (arr: any[], tableTitle?: string) => {
    if (!arr || arr.length === 0) return;
    
    if (tableTitle) {
      doc.text(tableTitle, 14, startY);
      startY += 6;
    }

    const headers = Object.keys(arr[0]).map(key => key.toUpperCase());
    const body = arr.map(row => Object.values(row).map(val => String(val)));

    (doc as any).autoTable({
      head: [headers],
      body: body,
      startY: startY,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] } // Green color
    });

    startY = (doc as any).lastAutoTable.finalY + 15;
  };

  if (Array.isArray(data)) {
    processData(data);
  } else if (typeof data === 'object') {
    Object.keys(data).forEach(key => {
       if (Array.isArray(data[key])) {
         processData(data[key], key.toUpperCase());
       }
    });
  }

  doc.save(fileName);
};