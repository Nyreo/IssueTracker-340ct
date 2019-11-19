'use strict'

const Issues = require('../issue')

const baseIssue = {
	description: 'testing',
	type: 'noise',
	dateSubmitted: 1571784284425,
	username: '123',
	lat: 54.3,
	lng: -0.14,
	streetName: 'test road'
}

describe('reportIssue()', () => {

	test('reporting issue with correct details', async done => {
		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
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

		const issue = {...baseIssue, dateSubmitted: -1}

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('timestamp cannot be negative'))
		done()
	})

	test('reporting issue with invalid date submitted (too far in the future)', async done => {
		expect.assertions(2)

		const issue1 = {...baseIssue, dateSubmitted: Date.now() + 60*60*24 + 30}
		const issue2 = {...baseIssue, dateSubmitted: Date.now() + 60*60*24 - 1}
		const issues = await new Issues()

		await expect(issues.reportIssue(issue1))
			.rejects.toEqual(Error('timestamp is too far in the future'))

		await expect(issues.reportIssue(issue2))
			.resolves.toEqual()

		done()
	})

	test('reporting issue with invalid date type submitted (NaN)', async done => {
		try {
			const issues = await new Issues()
			const issue = {
				...baseIssue,
				dateSubmitted: 'testing'
			}

			await expect(issues.reportIssue(issue))
				.rejects.toEqual(Error('dateSubmitted has invalid data type'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('reporting issue without streetName data', async done => {
		try {
			const issues = await new Issues()
			const issue1 = {...baseIssue}
			delete issue1.streetName

			await issues.reportIssue(issue1)

			await expect(issues.fetchIssue(1))
				.resolves.toEqual({
					...baseIssue,
					streetName: '',
					votes: 0,
					priority: 0,
					id: 1,
					status: 'reported',
					dateResolved: null
				})
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})

describe('fetchIssue', () => {

	test('fetching existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			const dbIssue = await issues.fetchIssue(1)

			expect(dbIssue).toEqual({
				...baseIssue,
				status: 'reported',
				votes: 0,
				id: 1,
				priority: 0,
				dateResolved: null
			})
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('fetching non-existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			const dbIssue = await issues.fetchIssue(1)

			expect(dbIssue).toEqual({})
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('id should not be blank', async done => {
		try {
			const issues = await new Issues()

			await expect(issues.fetchIssue())
				.rejects.toEqual(Error('id must not be blank'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

})

describe('fetchAllIssues()', () => {

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
				status: 'reported',
				priority: 0,
				dateResolved: null
			},
			{
				...baseIssue,
				id: 2,
				votes: 0,
				status: 'reported',
				priority: 0,
				dateResolved: null
			}])
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('fetching issues that do no exist', async done => {
		try {
			const issues = await new Issues()
			// fetch all issues
			const dbRecords = await issues.fetchAllIssues()
			expect(dbRecords).toEqual([])
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})
})

describe('fetchUserIssues()', () => {

	test('fetching all issues reported by valid user', async done => {
		expect.assertions(1)
		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await issues.reportIssue(baseIssue)

			const expectedIssue = {...baseIssue, votes: 0, status: 'reported', priority: 0, dateResolved: null}

			await expect(issues.fetchUserIssues('123'))
				.resolves.toEqual([{...expectedIssue, id: 1}, {...expectedIssue, id: 2}])

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('fetching non-existing issues reported by valid user', async done => {
		try {
			const issues = await new Issues()

			await expect(issues.fetchUserIssues('123'))
				.resolves.toEqual([])
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('fetching issues reported by undefined/blank user', async done => {
		try {
			const issues = await new Issues()

			await expect(issues.fetchUserIssues())
				.rejects.toEqual(Error('username must not be blank'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})

describe('deleteIssue()', () => {

	test('delete existing issue', async done => {

		expect.assertions(2)
		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await expect(issues.fetchIssue(1))
				.resolves.not.toEqual({})

			await issues.deleteIssue(1)

			await expect(issues.fetchIssue(1))
				.resolves.toEqual({})

		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})
	test('delete non-existing issue', async done => {

		try {
			const issues = await new Issues()

			await expect(issues.deleteIssue(1))
				.rejects.toEqual(Error('issue does not exist'))
		} catch(err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id should not be blank', async done => {
		try {
			const issues = await new Issues()

			await expect(issues.deleteIssue())
				.rejects.toEqual(Error('id must not be blank'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})

describe('updateIssueStatus()', () => {

	test('updating status of existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.updateIssueStatus(1, 'in-progress')

			const issue = await issues.fetchIssue(1)
			expect(issue.status).toEqual('in-progress')
		} catch(err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('updating status issue of non-existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.updateIssueStatus(1, 'complete'))
				.rejects.toEqual(Error('issue does not exist'))
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('updating status of issue to resolved should change date resolved', async done => {
		expect.assertions(2)
		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.updateIssueStatus(1, 'resolved')

			const issue = await issues.fetchIssue(1)
			expect(issue.status).toEqual('resolved')
			expect(issue.dateResolved).not.toBe(null)

		} catch(err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id must not be blank', async done => {
		try {
			const issues = await new Issues()

			await expect(issues.updateIssueStatus())
				.rejects.toEqual(Error('id must not be blank'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('status must not be blank', async done => {
		try {
			const issues = await new Issues()

			await expect(issues.updateIssueStatus(1))
				.rejects.toEqual(Error('status must not be blank'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test.todo('when status is changed back from resolve, dateResolved should be reset')
})

describe('updateIssuePriority()', () => {

	test('updating priority of existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.updateIssuePriority(1, 2)

			const issue = await issues.fetchIssue(1)
			expect(issue.priority).toEqual(2)
		} catch(err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('updating priority of non-existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.updateIssuePriority(1, 2))
				.rejects.toEqual(Error('issue does not exist'))
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('updating priority of existing issue to invalid value (negative)', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await expect(issues.updateIssuePriority(1, -1))
				.rejects.toEqual(Error('priority cannot be negative or equal to 0'))
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('updating priority of issue to invalid value (NaN)', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await expect(issues.updateIssuePriority(1, 'word'))
				.rejects.toEqual(Error('priority must be a positive number'))
		} catch(err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('priority must not be blank', async done => {
		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)

			await expect(issues.updateIssuePriority(1))
				.rejects.toEqual(Error('priority must not be blank'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id must not be blank', async done => {
		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await expect(issues.updateIssuePriority())
				.rejects.toEqual(Error('id must not be blank'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})

describe('setResolutionTime', () => {
	test('setting resolution time for valid issue', async done => {
		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.setResolutionTime(1)

			const issue = await issues.fetchIssue(1)
			expect(issue.dateResolved).not.toBe(null)
		} catch (err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('setting resolution time for invalid issue id', async done => {
		try {
			const issues = await new Issues()
			await issues.setResolutionTime(1)

			done.fail('invalid issue error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('issue does not exist'))
			done()
		}
	})

	test('setting resolution time for non-existing issue', async done => {
		try {
			const issues = await new Issues()
			await issues.setResolutionTime(1)

			done.fail('invalid issue error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('issue does not exist'))
			done()
		}
	})

	test('id must not be empty', async done => {
		try {
			const issues = await new Issues()
			await issues.setResolutionTime()

			done.fail('invalid issue error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('id must not be blank'))
			done()
		}
	})
})

describe('voteForIssue()', () => {
	test.todo('voting for existing issue')

	test.todo('voting for non-existing issue')

	test.todo('voting for same issue twice')

	test.todo('voting for non-pending issue')

	test.todo('id must not be blank')

	test.todo('username should not be blank')
})

describe('voteAgainstIssue()', () => {

	test.todo('voting against existing issue')

	test.todo('voting against non-existing issue')

	test.todo('voting against existing issue twice')

	test.todo('id should not be blank')

	test.todo('username should not be blank')
})

describe('cancelVote()', () => {

	test.todo('cancelling vote against existing issue')

	test.todo('cancelling vote against non-existing issue')

	test.todo('cancelling vote against existing issue user has not voted for')

	test.todo('id should not be blank')

	test.todo('username should not be blank')
})