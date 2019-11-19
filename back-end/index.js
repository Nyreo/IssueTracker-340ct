#!/usr/bin/env node

'use strict'

// dot env
require('dotenv').config({path: __dirname + '/.env'})

/* STANDARD MODULE IMPORTS */
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

// router imports
const userRouter = require('./services/userManagementService/userRouter')
const issueRouter = require('./services/issueManagementService/issueRouter')

const app = new Koa()

/* CONFIGURING MIDDLEWARE */
app.keys = ['darkSecret']
app.use(bodyParser())

/* ALLOWING CORS */
app.use(cors())

/* SETTING UP ROUTES */
app.use(userRouter.routes())
app.use(issueRouter.routes())

const defaultPort = 8080
const port = process.env.PORT || defaultPort

module.exports = app.listen(port, async() => console.log(`Server started... listening on port ${port}`))
