'use strict'

const EmailController = require('../emailController')

describe('sendEmail()', () => {
	const baseOptions =
	{
		user: 'test',
		subject: 'test subject',
		message: 'test message'
	}

	test('sending a valid email', async done => {
		try {
			const emailController = new EmailController()

			emailController.transporter.sendMail = jest.fn((options, callback) => {
				callback(null, options)
			})

			await emailController.sendEmail(baseOptions)
			done()
		} catch (err) {
			done.fail(err)
		}
	})

	test('sending an invalid email', async done => {
		try {
			const emailController = new EmailController()

			emailController.transporter.sendMail = jest.fn((options, callback) => {
				callback(new Error('invalid call'), options)
			})

			await emailController.sendEmail(baseOptions)
			done.fail('error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('invalid call'))
			done()
		}
	})
})
