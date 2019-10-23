
'use strict'

const Issues = require('../issue')

describe('reportIssue()', () => {

	const baseIssue = {
		description: 'testing',
		type: 'noise',
		dateSubmitted: 1571784284425,
		username: '123',
		priority: 1,
		lat: 54.3,
		lng: -0.14
	}

	test('reporting issue with correct details', async done => {
		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			done()
		} catch(err) {
			done.fail(err.message)
		}
	})

	test('reporting issue with missing credentials', async done => {
		expect.assertions(2)
		// missing description
		const issue1 = {...baseIssue}
		delete issue1.description

		const issue2 = {...baseIssue}
		delete issue2.type

		const issues = await new Issues()

		await expect(issues.reportIssue(issue1))
			.rejects.toEqual(Error('description missing'))

		await expect(issues.reportIssue(issue2))
			.rejects.toEqual(Error('type missing'))

		done()
	})

	test('reporting issue with invalid date submitted (negative)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue, dateSubmitted : -1}

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('timestamp cannot be negative'))
		done()
	})

	test('reporting issue with invalid date submitted (too far in the future)', async done => {
		expect.assertions(2)

		const issue1 = {...baseIssue, dateSubmitted: Date.now() + (60*60*24) + 10}
		const issue2 = {...baseIssue, dateSubmitteD: Date.now() + (60*60)}
		const issues = await new Issues()

		await expect(issues.reportIssue(issue1))
			.rejects.toEqual(Error('timestamp is too far in the future'))

		await expect(issues.reportIssue(issue2))
			.resolves.toEqual()

		done()
	})
})

describe('fetchIssue', () => {
	const baseIssue = {
		description: 'testing',
		type: 'noise',
		dateSubmitted: 1571784284425,
		username: '123',
		priority: 1,
		lat: 54.3,
		lng: -0.14
	}

	test('fetching existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			const dbIssue = await issues.fetchIssue(1)

			expect(dbIssue).toEqual({
				...baseIssue,
				status:'pending',
				votes:0,
				id: 1
			})
			done()
		} catch(err) {
			done.fail(err.message)
		}
	})

	test('fetching non-existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			const dbIssue = await issues.fetchIssue(1)

			expect(dbIssue).toEqual({})
			done()
		} catch(err) {
			done.fail(err.message)
		}
	})

})

describe('fetchAllIssues()', () => {

	const baseIssue = {
		description: 'testing',
		type: 'noise',
		dateSubmitted: 1571784284425,
		username: '123',
		priority: 1,
		lat: 54.3,
		lng: -0.14
	}

	test('fetching all issues', async done => {
		try {
			const issues = await new Issues()
			// report same issue twice
			await issues.reportIssue(baseIssue)
			await issues.reportIssue(baseIssue)
			// fetch all issues
			const dbRecords = await issues.fetchAllIssues()

			expect(dbRecords).toEqual([{
				...baseIssue,
				id: 1,
				votes: 0,
				status: 'pending'
			},
			{
				...baseIssue,
				id: 2,
				votes: 0,
				status: 'pending'
			}])
		} catch(err) {
			done.fail(err.message)
		}
		done()
	})

	test('fetching issues that do no exist', async done => {
		try {
			const issues = await new Issues()
			// fetch all issues
			const dbRecords = await issues.fetchAllIssues()

			expect(dbRecords).toEqual([])
		} catch(err) {
			done.fail(err.message)
		}
		done()
	})
})

describe('deleteIssue()', () => {
	
	const baseIssue = {
		description: 'testing',
		type: 'noise',
		dateSubmitted: 1571784284425,
		username: '123',
		priority: 1,
		lat: 54.3,
		lng: -0.14
	}

	test.todo('delete existing issue')

	test.todo('delete non-existing issue')
})

describe('updateIssueStatus()', () => {

	const baseIssue = {
		description: 'testing',
		type: 'noise',
		dateSubmitted: 1571784284425,
		username: '123',
		priority: 1,
		lat: 54.3,
		lng: -0.14
	}

	test.todo('updating status of existing issue')

	test.todo('updating status issue of non-existing issue')
})

describe('userSubmittedIssues()', () => {
	
	const baseIssue = {
		description: 'testing',
		type: 'noise',
		dateSubmitted: 1571784284425,
		username: '123',
		priority: 1,
		lat: 54.3,
		lng: -0.14
	}

	test.todo('fetching all issues reported by valid user')

	test.todo('fetching all issues reported by invalid user')

	test.todo('fetching non-existing issues reported by valid user')
})

describe('voteIssue()', () => {

	const baseIssue = {
		description: 'testing',
		type: 'noise',
		dateSubmitted: 1571784284425,
		username: '123',
		priority: 1,
		lat: 54.3,
		lng: -0.14
	}
	test.todo('voting for existing issue')

	test.todo('voting for non-existing issue')

	test.todo('voting for same issue twice')

	test.todo('voting for non-pending issue')
})