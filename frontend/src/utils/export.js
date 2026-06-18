export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  for (const row of data) {
    const values = headers.map((h) => {
      let val = row[h] != null ? String(row[h]) : '';
      if (val.includes(',') || val.includes('"') || val.includes('\n')) val = `"${val.replace(/"/g, '""')}"`;
      return val;
    });
    csvRows.push(values.join(','));
  }
  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(data, filename = 'export.xlsx') {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const s = (v) => (v != null ? String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '');
  let xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
  xml += '<Worksheet ss:Name="Datos"><Table>';
  xml += '<Row>' + headers.map((h) => '<Cell><Data ss:Type="String">' + s(h) + '</Data></Cell>').join('') + '</Row>';
  for (const row of data) {
    xml += '<Row>' + headers.map((h) => '<Cell><Data ss:Type="String">' + s(row[h]) + '</Data></Cell>').join('') + '</Row>';
  }
  xml += '</Table></Worksheet></Workbook>';
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(title = 'Documento', callback) {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + title + '</title>');
  w.document.write('<style>body{font-family:system-ui,sans-serif;padding:2rem;}table{width:100%;border-collapse:collapse;}th,td{padding:0.5rem;border:1px solid #ddd;text-align:left;}th{background:#f5f5f5;}</style></head><body>');
  callback(w.document);
  w.document.write('</body></html>');
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 250);
}

export function downloadPDF(url, filename = 'documento.pdf') {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString();
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}
