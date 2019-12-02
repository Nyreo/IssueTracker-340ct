/* eslint-disable max-lines */
'use strict'

// STANDARD IMPORTS
const Router = require('koa-router')
const status = require('http-status-codes')
const send = require('koa-send')

// CUSTOM IMPORTS
const Issue = require('./issue')
const PdfManager = require('./pdfManager')

const router = new Router()
const pdfManager = new PdfManager()
const dbName = 'issues.db'

/**
 * The script to process the generation of a pdf job list for all allocated jobs.
 *
 * @name FetchAll Script
 * @route {GET} /issues/joblist
 */
router.get('/issues/joblist', async ctx => {

	const issues = await new Issue(dbName)
	const allocatedIssues = await issues.getAllocatedJobs()

	await pdfManager.JobReport(allocatedIssues)

	ctx.set('Content-disposition', 'attachment; filename=joblist.pdf')

	await send(ctx, './pdfs/output.pdf')
})

/**
 * The script to process retrieval of ALL issues
 *
 * @name FetchAll Script
 * @route {GET} /issues/fetch
 */
router.get('/issues/fetch', async ctx => {
	const issues = await new Issue(dbName)

	const data = await issues.fetchAllIssues()

	ctx.body = data
	ctx.status = status.OK
})

/**
 * The script to process retrieval of a single issue
 *
 * @name FetchSpecific Script
 * @route {GET} /issues/fetch/:id
 */
router.get('/issues/fetch/:id', async ctx => {
	try {
		const id = ctx.params.id
		const issues = await new Issue(dbName)
		const record = await issues.fetchIssue(id)

		ctx.body = record
		ctx.status = status.OK
	} catch(err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

/**
 * The script to process updating a single issue
 *
 * @name Update Script
 * @route {PUT} /issues/update/status/:id
 */
router.put('/issues/update/status/:id', async ctx => {
	try {
		const issueStatus = ctx.request.body.status
		const id = ctx.params.id
		const issues = await new Issue(dbName)

		await issues.updateIssueStatus(id, issueStatus)
		ctx.status = status.OK
	} catch(err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

/**
 * The script to process updating a single issue
 *
 * @name Update Script
 * @route {PUT} /issues/update/priority/:id
 */
router.put('/issues/update/priority/:id', async ctx => {
	try {
		const priority = ctx.request.body.priority
		const id = ctx.params.id
		const issues = await new Issue(dbName)

		await issues.updateIssuePriority(id, priority)
		ctx.status = status.OK
	} catch(err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

/**
 * The script to process creating a new issue.
 *
 * @name Report Script
 * @route {POST} /issues/report
 */
router.post('/issues/report', async ctx => {
	try {
		const data = ctx.request.body
		const issues = await new Issue(dbName)

		await issues.reportIssue(data)

		ctx.status = status.OK
	} catch (err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

/**
 * The script to process deleting an existing issue
 *
 * @name Delete Script
 * @route {DELETE} /issues/delete/:id
 */
router.delete('/issues/delete/:id', async ctx => {
	try {
		const issues = await new Issue(dbName)
		const id = ctx.params.id
		await issues.deleteIssue(id)

		ctx.status = status.OK
	} catch(err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

/**
 * The script to process the voting FOR a specified issue
 *
 * @name VoteFor Script
 * @route {POST} /issues/upvote
 * @returns new vote count
 */
router.post('/issues/upvote', async ctx => {
	try {
		const data = ctx.request.body
		const issues = await new Issue(dbName)

		const votes = await issues.voteIssue(data.id, data.username, 1)
		ctx.status = status.OK
		ctx.body = votes
	} catch (err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

/**
 * The script to process the voting AGAINST a specified issue
 *
 * @name VoteAgainst Script
 * @route {POST} /issues/downvote
 * @returns new vote count
 */
router.post('/issues/downvote', async ctx => {
	try {
		const data = ctx.request.body
		const issues = await new Issue(dbName)

		const votes = await issues.voteIssue(data.id, data.username, -1)
		ctx.status = status.OK
		ctx.body = votes
	} catch (err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

/**
 * The script to process creating a new issue.
 *
 * @name Report Script
 * @route {POST} /issues/report
 */
router.post('/issues/report', async ctx => {
	try {
		const data = ctx.request.body
		const issues = await new Issue(dbName)
		await issues.reportIssue(data)

		ctx.status = status.OK
	} catch (err) {
		ctx.status = status.BAD_REQUEST
		ctx.message = err.message
	}
})

module.exports = router

