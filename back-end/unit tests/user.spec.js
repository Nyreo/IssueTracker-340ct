
'use strict'

const jwt = require('jsonwebtoken')
const Accounts = require('../modules/user.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'joe',
			password: 'testing',
			confirmPassword: 'testing',
			email: 'joe@testing.com',
			address: '123 test lane',
			postCode: '123 456'
		}
		const register = await account.register(userAccount)
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'joe',
			password: 'testing',
			confirmPassword: 'testing',
			email: 'joe@testing.com',
			address: '123 test lane',
			postCode: '123 456'
		}
		const account = await new Accounts()

		await account.register(userAccount)
		await expect( account.register(userAccount) )
			.rejects.toEqual(Error('username "joe" already in use'))
		done()
	})

	test('username should not be blank', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: '',
			password: 'testing',
			confirmPassword: 'testing',
			email: 'joe@testing.com',
			address: '123 test lane',
			postCode: '123 456'
		}
		await expect(account.register(userAccount)).rejects.toEqual(Error('username must not be blank'))
		done()
	})

	test('password should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'userjoe',
			password: '',
			confirmPassword: 'testing',
			email: 'joe@testing.com',
			address: '123 test lane',
			postCode: '123 456'
		}
		const account = await new Accounts()
		await expect( account.register(userAccount) )
			.rejects.toEqual( Error('password must not be blank') )
		done()
	})

	test('password must match confirm password', async done => {
		expect.assertions(1)
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'userjoe',
			password: 'real',
			confirmPassword: 'fake',
			email: 'joe@testing.com',
			address: '123 test lane',
			postCode: '123 456'
		}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('passwords must match'))
		done()
	})

	test('email should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'userjoe',
			password: 'password',
			confirmPassword: 'password',
			email: '',
			address: '123 test lane',
			postCode: '123 456'
		}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('email must not be blank'))
		done()
	})

	test('email should contain the @ and . symbols', async done => {
		expect.assertions(1)
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'userjoe',
			password: 'password',
			confirmPassword: 'password',
			email: 'test',
			address: '123 test lane',
			postCode: '123 456'
		}
		const account = await new Accounts()
		await expect(account.register(userAccount))
			.rejects.toEqual(new Error('invalid email address'))
		done()
	})

	test('email address should contain @ and . symbol in that order', async done => {
		expect.assertions(1)
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'userjoe',
			password: 'password',
			confirmPassword: 'password',
			email: 'test.test@',
			address: '123 test lane',
			postCode: '123 456'
		}
		const account = await new Accounts()
		await expect(account.register(userAccount))
			.rejects.toEqual(new Error('invalid email address'))
		done()
	})

	test('address should not be blank', async done => {
		expect.assertions(1)
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'userjoe',
			password: 'password',
			confirmPassword: 'password',
			email: 'joe@testing.com',
			address: '',
			postCode: '123 456'
		}
		const account = await new Accounts()
		await expect( account.register(userAccount))
			.rejects.toEqual(Error('address must not be blank'))
		done()
	})

	test('postCode should not be blank', async done => {
		done()
	})

	test('first name should not be blank', async done => {
		done()
	})

	test('last name should not be blank', async done => {
		done()
	})

	test('staff property should be false by default', async done => {
		expect.assertions(1)
		const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'userjoe',
			password: 'password',
			confirmPassword: 'password',
			email: 'joe@testing.com',
			address: '123 test lane',
			postCode: '123 456'
		}
		const account = await new Accounts()
		await account.register(userAccount)

		await expect( account.isStaff(userAccount.username))
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

	test('password should not be blank', async done => {
		expect.assertions(1)
		await expect( globalAccount.login('username', ''))
			.rejects.toEqual(Error('password must not be blank'))
		done()
	})

	// test('password should not contain any illegal characters', async done =>{
	// 	// todo
	// 	done()
	// })

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
