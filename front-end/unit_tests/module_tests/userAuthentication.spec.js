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
        expect(axios.post.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/user/login')
        expect(axios.post.mock.calls[0][1]).toEqual({
            user:'user',
            pass:'pass'
        })
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

	test('making a valid request', async done => {
        
        axios.post = jest.fn((endpoint, data) => Promise.resolve({
            status:200
        }))

        await expect(userAuth.sendEmail({}))
            .resolves.toEqual({status: 200})
        expect(axios.post.mock.calls.length).toBe(1)
        expect(axios.post.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/user/message')
        expect(axios.post.mock.calls[0][1]).toEqual({})

        done()
    })

    test('making an invalid request', async done => {
        
        axios.post = jest.fn((endpoint, data) => Promise.reject({
            response : {
                status:400,
                message: 'email could not be found for that user'
            }
        }))

        await expect(userAuth.sendEmail({}))
            .rejects.toEqual({
                status:400,
                message: 'email could not be found for that user'
            })
        expect(axios.post.mock.calls.length).toBe(1)
        expect(axios.post.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/user/message')
        expect(axios.post.mock.calls[0][1]).toEqual({})

        done()
    })
})