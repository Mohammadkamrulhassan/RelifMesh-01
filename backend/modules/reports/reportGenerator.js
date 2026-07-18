const PDFDocument = require('pdfkit')
const { Parser } = require('json2csv')

function generatePDF(rows, res) {
  const doc = new PDFDocument()
  res.setHeader('Content-Type', 'application/pdf')
  doc.pipe(res)
  doc.fontSize(16).text('ReliefMesh Distribution Report', { align: 'center' })
  doc.moveDown()
  rows.forEach((r, i) => {
    doc.fontSize(10).text(`${i + 1}. ${JSON.stringify(r)}`)
  })
  doc.end()
}

function generateCSV(rows, res) {
  if (!rows.length) {
    res.setHeader('Content-Type', 'text/csv')
    return res.send('No data')
  }
  const parser = new Parser()
  const csv = parser.parse(rows)
  res.setHeader('Content-Type', 'text/csv')
  res.send(csv)
}

module.exports = { generatePDF, generateCSV }
