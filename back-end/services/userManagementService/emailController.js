'use strict'

const nodemailer = require('nodemailer')

module.exports = class EmailController {
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		})
	}

	async sendEmail(options) {
		// console.log(`sending email to ${options.to}`)
		const mailOptions = {
			...options,
			from: 'sender@gmail.com',
		}

		this.transporter.sendMail(mailOptions, (err) => {
			if(err) throw err
		 })
	}
}
