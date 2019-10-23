#!/usr/bin/env node

'use strict'

/* STANDARD MODULE IMPORTS */
//const bcrypt = require('bcrypt-promise')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const cors = require('@koa/cors')
// const fs = require('fs-extra')
// const mime = require('mime-types')

// router imports
const userRouter = require('./modules/userManagementService/userRouter')
const issueRouter = require('./modules/issueManagementService/issueRouter')

const app = new Koa()

/* CONFIGURING MIDDLEWARE */
app.keys = ['darkSecret']
app.use(bodyParser())
app.use(session(app))

/* ALLOWING CORS */
app.use(cors())

/* SETTING UP ROUTES */
app.use(userRouter.routes())
app.use(issueRouter.routes())

const defaultPort = 8080
const port = process.env.PORT || defaultPort

module.exports = app.listen(port, async() => console.log(`Server started... listening on port ${port}`))
