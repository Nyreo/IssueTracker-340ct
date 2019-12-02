'use strict'

const jwt = require('jsonwebtoken')
const Accounts = require('../user')

describe('register()', () => {

	const baseUser = {
		firstName: 'joe',
		lastName: 'mitchell',
		username: 'joe',
		password: 'testing',
		confirmPassword: 'testing',
		email: 'joe@testing.com',
		address: '123 test lane',
		postCode: '123 456'
	}

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		const register = await account.register(baseUser)
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await account.register(baseUser)
		await expect( account.register(baseUser) )
			.rejects.toEqual(Error('username "joe" already in use'))
		done()
	})

	test('username should not be blank', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const userAccount = {...baseUser, username: ''}
		await expect(account.register(userAccount)).rejects.toEqual(Error('username must not be blank'))
		done()
	})

	test('password should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, password: ''}
		const account = await new Accounts()
		await expect( account.register(userAccount) )
			.rejects.toEqual( Error('password must not be blank') )
		done()
	})

	test('password must match confirm password', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, password: 'real', confirmPassword: 'fake'}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('passwords must match'))
		done()
	})

	test('email should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, email: ''}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('email must not be blank'))
		done()
	})

	test('email should contain the @ symbol', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, email: 'test'}
		const account = await new Accounts()
		await expect(account.register(userAccount))
			.rejects.toEqual(new Error('email must contain the @ symbol'))
		done()
	})

	test('email should contain atleast 1 . symbol', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, email: 'test@'}
		const account = await new Accounts()
		await expect(account.register(userAccount))
			.rejects.toEqual(new Error('email must contain atleast one . symbol'))
		done()
	})

	test('email address should contain @ and . symbol in that order', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, email: 'test.test@'}
		const account = await new Accounts()
		await expect(account.register(userAccount))
			.rejects.toEqual(new Error('email\'s @ symbol must come before the . symbol'))
		done()
	})

	test('email address should contain @ and . symbol with content after the .', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, email: 'test@gmail.'}
		const account = await new Accounts()
		await expect(account.register(userAccount))
			.rejects.toEqual(new Error('email must contain content after the . symbol'))
		done()
	})

	test('address should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, address: ''}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('address must not be blank'))
		done()
	})

	test('postCode should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, postCode: ''}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('postCode must not be blank'))
		done()
	})

	test('first name should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, firstName: ''}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('firstName must not be blank'))
		done()
	})

	test('last name should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {...baseUser, lastName: ''}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('lastName must not be blank'))
		done()
	})

	test('staff property should be false by default', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register(baseUser)

		await expect( account.isStaff(baseUser.username))
			.resolves.toBe(0)
		done()
	})

})

describe('login()', () => {

	let globalAccount

	beforeAll(async() => {
		// test account, not modifying data
		globalAccount = await new Accounts()

		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'user',
			password: 'pass',
			confirmPassword: 'pass',
			email: 'email@testing.com',
			address: '123 test lane',
			postCode: '123 456'
		}

		await globalAccount.register(userAccount)
	})

	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const valid = await globalAccount.login('user', 'pass')
		expect(valid).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('notValid', 'password') )
			.rejects.toEqual( Error('username "notValid" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('username', 'bad') )
			.rejects.toEqual( Error('invalid password for account "username"') )
		done()
	})

	test('username should not be blank', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('', 'password'))
			.rejects.toEqual(Error('username must not be blank'))
		done()
	})

	test('username should not be of type number', async done => {
		expect.assertions(1)
		await expect( globalAccount.login(123, 'password'))
			.rejects.toEqual(Error('username has invalid data type'))
		done()
	})

	test('username should not be of type float', async done => {
		expect.assertions(1)
		await expect( globalAccount.login(123.23, 'password'))
			.rejects.toEqual(Error('username has invalid data type'))
		done()
	})

	test('username should not be of type boolean', async done => {
		expect.assertions(1)
		await expect( globalAccount.login(true, 'password'))
			.rejects.toEqual(Error('username has invalid data type'))
		done()
	})

	test('username should not be of type date', async done => {
		expect.assertions(1)
		await expect( globalAccount.login(new Date(Date.now()), 'password'))
			.rejects.toEqual(Error('username has invalid data type'))
		done()
	})

	test('password should not be blank', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('username', ''))
			.rejects.toEqual(Error('password must not be blank'))
		done()
	})

	test('password should not be of type number', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('username', 123))
			.rejects.toEqual(Error('password has invalid data type'))
		done()
	})

	test('password should not be of type float', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('username', 123.23))
			.rejects.toEqual(Error('password has invalid data type'))
		done()
	})

	test('password should not be of type boolean', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('username', false))
			.rejects.toEqual(Error('password has invalid data type'))
		done()
	})

	test('password should not be of type date', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('username', new Date(Date.now())))
			.rejects.toEqual(Error('password has invalid data type'))
		done()
	})

})

describe('generateWebToken()', () => {

	test('decoding correct payload', async done => {
		expect.assertions(1)
		const payload = {
			username: 'testing'
		}
		const account = await new Accounts()
		const token = await account.generateWebToken(payload)

		// remove instantiation time key and expiration time from generated token
		const decodedToken = jwt.decode(token)
		delete decodedToken.iat
		delete decodedToken.exp

		expect(decodedToken).toEqual(payload)

		done()
	})
})

describe('sendUserEmail()', () => {

	const baseUser = {
		firstName: 'joe',
		lastName: 'mitchell',
		username: 'joe',
		password: 'testing',
		confirmPassword: 'testing',
		email: 'joe@testing.com',
		address: '123 test lane',
		postCode: '123 456'
	}

	test('sending an existing user an email with valid content', async done => {
		try {
			const account = await new Accounts()
			await account.register(baseUser)

			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			const content = {
				user: 'joe',
				subject: 'test email',
				message: 'this is a test email'
			}

			await account.sendUserEmail(content)

			expect(account.emailController.sendEmail.mock.calls.length).toBe(1)
			expect(account.emailController.sendEmail.mock.results[0].value).toEqual({
				html: content.message,
				subject: content.subject,
				to: 'joe@testing.com'
			})
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('sending a non existing user an email', async done => {
		try {
			const account = await new Accounts()

			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			const content = {
				user: 'joe',
				subject: 'test email',
				message: 'this is a test email'
			}

			await account.sendUserEmail(content)

			done.fail('error should have been triggered')
		} catch (err) {
			expect(err).toEqual(Error('an email address for that user could not be found.'))
			done()
		}
	})

	test('content should not be blank', async done => {
		try {
			const account = await new Accounts()
			await account.register(baseUser)

			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			await account.sendUserEmail()
			done.fail('error should have been thrown')

		} catch (err) {
			expect(err).toEqual(Error('content must not be blank'))
			done()
		}
	})

	test('content "user" property should be present', async done => {
		try {
			const account = await new Accounts()
			await account.register(baseUser)

			const content = {
				subject: 'test email',
				message: 'this is a test email'
			}

			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			await account.sendUserEmail(content)
			done.fail('error should have been thrown')

		} catch (err) {
			expect(err).toEqual(Error('user missing'))
			done()
		}
	})

	test('content "subject" property should be present', async done => {
		try {
			const account = await new Accounts()
			await account.register(baseUser)

			const content = {
				user: 'joe',
				message: 'this is a test email'
			}

			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			await account.sendUserEmail(content)
			done.fail('error should have been thrown')

		} catch (err) {
			expect(err).toEqual(Error('subject missing'))
			done()
		}
	})

	test('content "message" property should be present', async done => {
		try {
			const account = await new Accounts()
			await account.register(baseUser)

			const content = {
				user: 'joe',
				subject: 'test email'
			}

			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			await account.sendUserEmail(content)
			done.fail('error should have been thrown')

		} catch (err) {
			expect(err).toEqual(Error('message missing'))
			done()
		}
	})

	test('content "user" property should not be blank', async done => {
		try {
			const account = await new Accounts()
			await account.register(baseUser)

			const content = {
				user: '',
				subject: 'test email',
				message: 'this is a test email'
			}
			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			await account.sendUserEmail(content)
			done.fail('error should have been thrown')

		} catch (err) {
			expect(err).toEqual(Error('user must not be blank'))
			done()
		}
	})

	test('content "subject" property should not be blank', async done => {
		try {
			const account = await new Accounts()
			await account.register(baseUser)

			const content = {
				user: 'joe',
				subject: '',
				message: 'this is a test email'
			}

			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			await account.sendUserEmail(content)
			done.fail('error should have been thrown')

		} catch (err) {
			expect(err).toEqual(Error('subject must not be blank'))
			done()
		}
	})

	test('content "message" property should not be blank', async done => {
		try {
			const account = await new Accounts()
			await account.register(baseUser)

			const content = {
				user: 'joe',
				subject: 'test email',
				message: ''
			}

			// mock send email
			account.emailController.sendEmail = jest.fn((options) => options)

			await account.sendUserEmail(content)
			done.fail('error should have been thrown')

		} catch (err) {
			expect(err).toEqual(Error('message must not be blank'))
			done()
		}
	})
})
