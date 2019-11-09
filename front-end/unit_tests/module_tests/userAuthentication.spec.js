import axios from 'axios'

import userAuth from '../../src/modules/userAuthentication'

describe('login', () => {

	test('logging in with correct credentials', async done => {
    
        // mock the axios post request (api call)
        axios.post = jest.fn((endpoint, data) => Promise.resolve({
            data: {
                token: 'bearer testtoken'
            },
            status: 200
        }))

        await expect(userAuth.login('user', 'pass')).resolves.toEqual(
            'bearer testtoken'
        )
        expect(axios.post.mock.calls.length).toBe(1)

        done()
    })

    test('login with invalid credentials', async done => {

        axios.post = jest.fn(() => Promise.reject({
            response : {
                data: 'invalid password for account "username"',
                status: 401,
                statusText: 'invalid password for account "username"'
            }
        }))
    
        await expect(userAuth.login('username', 'password')).rejects.toEqual(
            {
                data: 'invalid password for account "username"',
                status: 401,
                statusText: 'invalid password for account "username"'
            }
        )

        done()
    })
})

describe('register', () => {

    test('register with correct credentials', async done => {
        // mock axios post request for register functionality  
        axios.post = jest.fn(() => Promise.resolve({
            data: {
                token: 'bearer testtoken'
            },
            status: 200
        }))

        await expect(userAuth.register({})).resolves.toEqual(
            'bearer testtoken'
        )
        done()
    })

    test('register with invalid credentials', async done => {

        const userAccount = {
			firstName: 'joe',
			lastName: 'mitchell',
			username: 'joe',
			password: 'testing',
			confirmPassword: 'test',
			email: 'joe@testing.com',
			address: '123 test lane',
			postCode: '123 456'
		}
        // instantly reject request
        axios.post = jest.fn(() => Promise.reject({
            response : {
                data: 'passwords must match',
                status: 400,
                statusText: 'passwords must match'
            }
        }))

        await expect(userAuth.register('username', 'password')).rejects.toEqual(
            {
                data: 'passwords must match',
                status: 400,
                statusText: 'passwords must match'
            }
        )
        done()
    })
})

describe('sendEmail', () => {

	test('logging in with correct credentials', async done => {
    
        // mock the axios post request (api call)
        axios.post = jest.fn(() => Promise.resolve({
            data: {
                token: 'bearer testtoken'
            },
            status: 200
        }))

        await expect(userAuth.login('user', 'pass')).resolves.toEqual(
            'bearer testtoken'
        )

        done()
    })

    test('login with invalid credentials', async done => {

        axios.post = jest.fn(() => Promise.reject({
            response : {
                data: 'invalid password for account "username"',
                status: 401,
                statusText: 'invalid password for account "username"'
            }
        }))
    
        await expect(userAuth.login('username', 'password')).rejects.toEqual(
            {
                data: 'invalid password for account "username"',
                status: 401,
                statusText: 'invalid password for account "username"'
            }
        )

        done()
    })
})