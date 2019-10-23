'use strict'

// STANDARD IMPORTS
const Router = require('koa-router')

// CUSTOM IMPORTS
const Issue = require('./issue')

const router = new Router()
const dbName = 'issues.db'

/**
 * The script to process retrieval of ALL issues
 *
 * @name FetchAll Script
 * @route {GET} /issues/fetch
 */
router.get('/issues/fetch', async ctx => {
})

/**
 * The script to process retrieval of a single issue
 *
 * @name FetchSpecific Script
 * @route {GET} /issues/fetch/:id
 */
router.get('/issues/fetch/:id', async ctx => {
})

/**
 * The script to process updating a single issue
 *
 * @name Update Script
 * @route {PUT} /issues/update/:id
 */
router.put('/issues/update/:id', async ctx => {
})

/**
 * The script to process creating a new issue.
 *
 * @name Report Script
 * @route {POST} /issues/report
 */
router.post('/issues/report', async ctx => {
})

/**
 * The script to process deleting an existing issue
 *
 * @name Delete Script
 * @route {DELETE} /issues/delete/:id
 */
router.delete('/issues/delete/:id', async ctx => {
})

module.exports = router

