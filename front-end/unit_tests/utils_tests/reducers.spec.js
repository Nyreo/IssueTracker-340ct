import { createStore } from 'redux'
//action imports
import {setUser, clearUser } from '../../src/actions/userActions'
import {setError, clearError, setNotification, clearNotification, clearAll} from '../../src/actions/messageActions'

//reducer imports
import userReducer from '../../src/utils/reducers/userReducer'
import messageReducer from '../../src/utils/reducers/messageReducer'

describe('user reducer', () => {

	const userObj = {
		username:'username',
		password:'password'
	}

    test('setUser', async done => {

		const store = createStore(
			userReducer
		)
		
		expect.assertions(1)

		store.dispatch(setUser(userObj))

		expect(store.getState()).toEqual({
			isAuth:true,
			user: userObj
		})

		done()
	})

	test('clearUser', async done => {

		expect.assertions(1)

		const store = createStore(
			userReducer
		)
		store.dispatch(setUser(userObj))

		store.dispatch(clearUser())

		expect(store.getState()).toEqual({
			isAuth : false,
    		user : {}
		})

		done()
	})
})

describe('message reducer', () => {

	test('setting an error message', async done => {
		expect.assertions(1)
		
		// create store
		const store = createStore(
			messageReducer
		)
		const errMessage = 'error test'

		store.dispatch(setError('error test'))
		
		expect(store.getState().errMessage).toEqual(errMessage)

		done()
	})

	test('clearing the error message', async done => {
		// assert
		expect.assertions(1)
		
		//create store
		const store = createStore(
			messageReducer
		)
		// set error message
		store.dispatch(setError('error message'))

		// clear error message
		store.dispatch(clearError())

		expect(store.getState().errMessage).toEqual('')
		done()
	})

	test('setting the notification message', async done => {
		// assert
		expect.assertions(1)
		
		//create store
		const store = createStore(
			messageReducer
		)
		const notification = "notification message"

		store.dispatch(setNotification(notification))

		expect(store.getState().notification).toEqual(notification)

		done()
	})

	test('clearing the notification message', async done => {
		// assert
		expect.assertions(1)
		
		//create store
		const store = createStore(
			messageReducer
		)
		store.dispatch(setNotification('notification'))

		store.dispatch(clearNotification())

		expect(store.getState().notification).toEqual('')

		done()
	})

	test('clearing both messages', async done => {
		// assert
		expect.assertions(1)
		
		//create store
		const store = createStore(
			messageReducer
		)

		store.dispatch(setError('error'))
		store.dispatch(setNotification('notification'))

		store.dispatch(clearAll())

		expect(store.getState()).toEqual({
			errMessage: '',
			notification: ''
		})
		done()
	})
})