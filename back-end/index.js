#!/usr/bin/env node

'use strict'

/* STANDARD MODULE IMPORTS */
//const bcrypt = require('bcrypt-promise')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
// const fs = require('fs-extra')
// const mime = require('mime-types')
// const status = require('http-status-codes')

/* CUSTOM MODULE IMPORTS */
const User = require('./modules/user')

const app = new Koa()
const router = new Router()

/* CONFIGURING MIDDLEWARE */
app.keys = ['darkSecret']
app.use(bodyParser())
app.use(session(app))

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'
// const saltRounds = 10

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */

// --- Check authorised
// 	router.get('/', async ctx => {
// 	try {
// 		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
// 		const data = {}
// 		if(ctx.query.msg) data.msg = ctx.query.msg
// 	} catch(err) {
// 		await ctx.redirect('/')
// 	}
//  })

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	//TODO
	//respond with an error message

	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)
		// const {path, type} = ctx.request.files.avatar
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		// await user.uploadPicture(path, type)
		// redirect to the home page
		ctx.redirect(`/?msg=Welcome ${body.user}, you have successfully created an account.`)
	} catch(err) {
		await ctx.redirect('/register?msg=Oh no! something went wrong when trying to create an account.')
	}
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised = true
		return ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.redirect(`/?msg=${err.message}`)
	}
})

router.get('/a', async ctx => {
	ctx.session.authorised = !ctx.session.authorised
})

router.get('/test', async ctx => {
	if(ctx.session.authorised) {
		ctx.body = 'Welcome to the club.'
	} else {
		ctx.body = 'You are not permitted to access this resource.'
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
