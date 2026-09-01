const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const htmlFile = path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
const outputPdf = path.resolve(__dirname, 'Portofolio_DandyHuffazIchlamsyah.pdf');
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Membuka:', 'file:///' + htmlFile);
try {
  execSync(
    '"' + edge + '" --headless --disable-gpu --no-sandbox --print-to-pdf="' + outputPdf + '" --print-to-pdf-no-header "file:///' + htmlFile + '"',
    { timeout: 30000, stdio: 'inherit' }
  );
  if (fs.existsSync(outputPdf)) {
    console.log('✅ PDF berhasil! Ukuran file:', fs.statSync(outputPdf).size, 'bytes');
  } else {
    console.log('❌ File PDF tidak ditemukan');
  }
} catch (e) {
  console.error('Error:', e.message);
}
