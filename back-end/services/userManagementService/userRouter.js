
'use strict'

// STANDARD IMPORTS
const Router = require('koa-router')
const status = require('http-status-codes')

// CUSTOM IMPORTS
const User = require('./user')

const router = new Router()
const dbName = 'users.db'

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /users/register
 */
router.post('/user/register', async ctx => {
	try {
		// extract the data from the request
		const userDetails = ctx.request.body
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(userDetails)
		// update response status
		ctx.status = status.OK
		// generate data token
		const data = { username: userDetails.username, isStaff: false }
		const token = await user.generateWebToken(data)
		ctx.body = {token}
	} catch(err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

/**
 * The script to process existing user login.
 *
 * @name Login Script
 * @route {POST} /users/login
 */
router.post('/user/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)

		// update response status
		ctx.status = status.OK
		// generate data token -- TODO: add rest of data
		const isStaff = await user.isStaff(body.user)
		const data = { username: body.user, isStaff}
		const token = await user.generateWebToken(data)
		ctx.body = {token}
	} catch(err) {
		ctx.status = status.UNAUTHORIZED
		ctx.message = err.message
	}
})

/**
 * The script to email a specific user with content
 *
 * @name Message Script
 * @route {POST} /users/message
 */
router.post('/user/message', async ctx => {
	try {
		const content = ctx.request.body
		const user = await new User(dbName)
		user.sendUserEmail(content)

		ctx.status = status.OK
	} catch(err) {
		ctx.status = status. BAD_REQUEST
		ctx.message = err.message
	}
})

module.exports = router
