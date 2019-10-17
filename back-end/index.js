#!/usr/bin/env node

'use strict'

/* STANDARD MODULE IMPORTS */
//const bcrypt = require('bcrypt-promise')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const cors = require('@koa/cors')
// const fs = require('fs-extra')
// const mime = require('mime-types')
const status = require('http-status-codes')

/* CUSTOM MODULE IMPORTS */
const User = require('./modules/user')

const app = new Koa()
const router = new Router()

/* CONFIGURING MIDDLEWARE */
app.keys = ['darkSecret']
app.use(bodyParser())
app.use(session(app))

/* FIXING CORS */

app.use(cors())

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'
// const saltRounds = 10

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/user/register', async ctx => {
	try {
		// extract the data from the request
		const userDetails = ctx.request.body
		// console.log(body)
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
 * @route {POST} /login
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
		// console.log(token)
		ctx.body = {token}
	} catch(err) {
		ctx.status = status.UNAUTHORIZED
		ctx.message = err.message
	}
})

/**
 * The script to handle internal errors and report back to client
 *
 * @name Error handling script
 */
app.on('error', (err, ctx) => {
	// console.log(err)
	ctx.body = {err}
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
