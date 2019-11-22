'use strict'

const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = class PDFManager {

	JobReport(allocatedJobs) {
		const doc = new PDFDocument
		const jobListTop = 175
		const offset = 25
		const pageBreakOffset = 10
		const headers = {type: 'Type', priority: 'Priority', dateReported: 'Date Reported', lat: 'Latitude', lng: 'Longitude'}

		this.GenerateJobListHeader(doc)
		this.GenerateIntroduction(doc)
		this.GenerateTableHeaders(doc, headers, jobListTop)
		for(let i = 0; i < allocatedJobs.length; i++) {
			const dateReported = new Date(allocatedJobs[i].dateSubmitted).toLocaleDateString()
			allocatedJobs[i].dateReported = dateReported
			const position = jobListTop + offset * (i + 1) + pageBreakOffset
			this.GenerateTableRow(doc, position, allocatedJobs[i])
			this.GenerateBreak(doc, position + pageBreakOffset)
		}
		doc.pipe(fs.createWriteStream('./pdfs/output.pdf'))
		doc.end()
	}

	GenerateIntroduction(doc) {
		const x = 50
		const y = 100
		doc
			.text('This job list was generated to represent all of the jobs that have currently been allocated and should be complete.', x, y)
	}

	GenerateTableHeaders(doc, headers, y) {
		doc.font('Helvetica-Bold')
		const cells = {x1: 50, x2: 150, x3: 200, x4: 250, x5: 400}
		doc
			.text(headers.type, cells.x1, y)
			.text(headers.priority, cells.x2, y)
			.text(headers.dateReported, cells.x3, y, { width: 90, align: 'right'})
			.text(headers.lat, cells.x4, y, {width: 150, align: 'right'})
			.text(headers.lng, cells.x5, y, {width: 150, align: 'right'})
	}

	GenerateTableRow(doc, y, job) {
		const fsize = 10
		const cells = {x1: 50, x2: 150, x3: 200, x4: 250, x5: 400}
		const sf = 6
		doc
			.font('Helvetica')
			.fontSize(fsize)
			.text(job.type, cells.x1, y)
			.text(job.priority, cells.x2, y)
			.text(job.dateReported, cells.x3, y, { width: 90, align: 'right'})
			.text(job.lat.toFixed(sf), cells.x4, y, {width: 150, align: 'right'})
			.text(job.lng.toFixed(sf), cells.x5, y, {width: 150, align: 'right'})
	}

	GenerateBreak(doc, y) {
		const start = 50
		const end = 550

		doc
			.strokeColor('#aaaaaa')
			.lineWidth(1)
			.moveTo(start, y)
			.lineTo(end, y)
			.stroke()
	}

	GenerateJobListHeader(doc) {

		const date = new Date(Date.now()).toLocaleDateString()
		const hFsize = 20
		const shFsize = 10
		const header = {x: 50, y: 45}
		const subHeader = {x: 100, y: 45}

		doc
			.fontSize(hFsize)
			.text('Local Community Job List', header.x, header.y)
			.fontSize(shFsize)
			.text(date, subHeader.x, subHeader.y, {align: 'right'})
			.moveDown()
	}
}
