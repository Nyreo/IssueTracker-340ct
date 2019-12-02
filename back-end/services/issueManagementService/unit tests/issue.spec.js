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

	test('reporting issue with missing description', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		delete issue.description

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('description missing'))

		done()
	})

	test('reporting issue with description of type number', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.description = 123

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('description has invalid data type'))

		done()
	})

	test('reporting issue with description of type float', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.description = 123.23

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('description has invalid data type'))

		done()
	})

	test('reporting issue with description of type boolean', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.description = true

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('description has invalid data type'))

		done()
	})

	test('reporting issue with missing type', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		delete issue.type

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('type missing'))

		done()
	})

	test('reporting issue property type with wrong type (number)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.type = 123

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('type has invalid data type'))

		done()
	})

	test('reporting issue property type with wrong type (float)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.type = 123.23

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('type has invalid data type'))

		done()
	})

	test('reporting issue property type with wrong type (boolean)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.type = true

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('type has invalid data type'))

		done()
	})

	test('reporting issue with missing date submitted', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		delete issue.dateSubmitted

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('dateSubmitted missing'))

		done()
	})

	test('reporting issue property dateSubmitted with wrong type (string)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.dateSubmitted = 'this is a test'

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('dateSubmitted has invalid data type'))

		done()
	})

	test('reporting issue property dateSubmitted with wrong type (boolean)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.dateSubmitted = true

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('dateSubmitted has invalid data type'))

		done()
	})

	test('reporting issue property dateSubmitted with wrong type (string convertable)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.dateSubmitted = '123123123123'

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('dateSubmitted has invalid data type'))

		done()
	})

	test('reporting issue with missing username', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		delete issue.username

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('username missing'))

		done()
	})

	test('reporting issue property username with wrong type (number)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.username = 123

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('username has invalid data type'))

		done()
	})

	test('reporting issue property username with wrong type (float)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.username = 123.23

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('username has invalid data type'))

		done()
	})

	test('reporting issue property username with wrong type (boolean)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.username = true

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('username has invalid data type'))

		done()
	})

	test('reporting issue with missing latitude', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		delete issue.lat

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('lat missing'))

		done()
	})

	test('reporting issue property lat with wrong type (string)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.lat = 'this is a test'

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('lat has invalid data type'))

		done()
	})

	test('reporting issue property lat with wrong type (string convertable)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.lat = '52.23'

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('lat has invalid data type'))

		done()
	})

	test('reporting issue property lat with wrong type (boolean)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.lat = true

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('lat has invalid data type'))

		done()
	})

	test('reporting issue with missing longitude', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		delete issue.lng

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('lng missing'))

		done()
	})

	test('reporting issue property lng with wrong type (string)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.lng = 'this is a test'

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('lng has invalid data type'))

		done()
	})

	test('reporting issue property lng with wrong type (string convertable)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.lng = '52.23'

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('lng has invalid data type'))

		done()
	})

	test('reporting issue property lng with wrong type (boolean)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.lng = true

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('lng has invalid data type'))

		done()
	})

	test('reporting issue with missing streetname', async done => {

		try {
			const issue = {...baseIssue}
			delete issue.streetName

			const issues = await new Issues()

			await issues.reportIssue(issue)
		} catch(err) {
			done.fail(err)
		} finally{
			done()
		}
	})

	test('reporting issue property streetName with wrong type (number)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.streetName = 123

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('streetName has invalid data type'))

		done()
	})

	test('reporting issue property streetName with wrong type (boolean)', async done => {
		expect.assertions(1)

		const issue = {...baseIssue}
		issue.streetName = true

		const issues = await new Issues()

		await expect(issues.reportIssue(issue))
			.rejects.toEqual(Error('streetName has invalid data type'))

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
		expect.assertions(1)

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
		expect.assertions(1)

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
		expect.assertions(1)

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

	test('id should be valid type (convertable)', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			const issue = await issues.fetchIssue('1')
			expect(issue).not.toBe(undefined)
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id should be valid type', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.fetchIssue('dsfsdf'))
				.rejects.toEqual(Error('value is not a number'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

})

describe('fetchAllIssues()', () => {

	test('fetching all issues', async done => {
		expect.assertions(1)

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
		expect.assertions(1)

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
		expect.assertions(1)

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
		expect.assertions(1)

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

	test('fetching issues with username that is not correct type (number)', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.fetchUserIssues(123))
				.rejects.toEqual(Error('username has invalid data type'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('fetching issues with username that is not correct type (float)', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.fetchUserIssues(123.23))
				.rejects.toEqual(Error('username has invalid data type'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('fetching issues with username that is not correct type (boolean)', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.fetchUserIssues(true))
				.rejects.toEqual(Error('username has invalid data type'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('fetching issues with username that is not correct type (date)', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.fetchUserIssues(new Date(Date.now())))
				.rejects.toEqual(Error('username has invalid data type'))
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
		expect.assertions(1)

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
		expect.assertions(1)

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

	test('id should be a number (convertable)', async done => {
		expect.assertions(0)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.deleteIssue('1')
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id should be a number', async done => {
		try {
			const issues = await new Issues()

			await expect(issues.deleteIssue('sdfsdkf'))
				.rejects.toEqual(Error('value is not a number'))
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
			await issues.updateIssueStatus(1, 'allocated')

			const issue = await issues.fetchIssue(1)
			expect(issue.status).toEqual('allocated')
			expect(issue.dateResolved).toBe(null)

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

	test('id must be number (convertable)', async done => {
		expect.assertions(0)

		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await issues.updateIssueStatus('1', 'allocated')

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id must be number', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await expect(issues.updateIssueStatus('asdfadf', 'allocated'))
				.rejects.toEqual(Error('value is not a number'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('status must not be blank', async done => {
		expect.assertions(1)

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

	test('status should not be type number', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.updateIssueStatus(1, 1))
				.rejects.toEqual(Error('status has invalid data type'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('status should not be type float', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.updateIssueStatus(1, 1.23))
				.rejects.toEqual(Error('status has invalid data type'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('status should not be type boolean', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.updateIssueStatus(1, true))
				.rejects.toEqual(Error('status has invalid data type'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('status should not be type date', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await expect(issues.updateIssueStatus(1, new Date(Date.now())))
				.rejects.toEqual(Error('status has invalid data type'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('when status is changed back from resolved, dateResolved should be reset', async done => {
		expect.assertions(2)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.updateIssueStatus(1, 'resolved')

			const issue = await issues.fetchIssue(1)
			expect(issue.status)
				.toEqual('resolved')
			expect(issue.dateResolved)
				.not.toBe(null)

		} catch(err) {
			done.fail(err)
		} finally {
			done()
		}
	})
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
				.rejects.toEqual(Error('priority has invalid data type'))
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

	test('priority must not be of type string', async done => {
		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)

			await expect(issues.updateIssuePriority(1, 'test'))
				.rejects.toEqual(Error('priority has invalid data type'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('priority must not be of type boolean', async done => {
		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)

			await expect(issues.updateIssuePriority(1, true))
				.rejects.toEqual(Error('priority has invalid data type'))
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('priority must not be of type date', async done => {
		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)

			await expect(issues.updateIssuePriority(1, new Date(Date.now())))
				.rejects.toEqual(Error('priority has invalid data type'))
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

	test('id must be number (convertable)', async done => {
		expect.assertions(0)

		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await issues.updateIssuePriority('1', 1)

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id must be number', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await expect(issues.updateIssuePriority('asdfadf', 1))
				.rejects.toEqual(Error('value is not a number'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})

describe('setResolutionTime', () => {
	test('setting resolution time for valid issue', async done => {
		expect.assertions(1)

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
		expect.assertions(1)

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
		expect.assertions(1)

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
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.setResolutionTime()

			done.fail('invalid issue error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('id must not be blank'))
			done()
		}
	})

	test('id must be number (convertable)', async done => {
		expect.assertions(0)

		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await issues.setResolutionTime('1')

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id must be number', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await expect(issues.setResolutionTime('asdfadf'))
				.rejects.toEqual(Error('value is not a number'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})

describe('voteIssue()', () => {
	test('voting for existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.voteIssue(1, 'test', 1)

			const issue = await issues.fetchIssue(1)
			expect(issue.votes).toEqual(1)
		} catch (err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('voting for non-existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await issues.voteIssue(1, 'test', 1)

			done.fail('error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('issue does not exist'))
			done()
		}
	})

	test('voting for same issue twice', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.voteIssue(1, 'test', 1)
			await issues.voteIssue(1, 'test', 1)

			done.fail('error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('You cannot vote multiple times for the same issue.'))
			done()
		}
	})

	test('voting an issue from multiple users', async done => {
		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.voteIssue(1, 'test1', 1)
			await issues.voteIssue(1, 'test2', 1)

			const issue = await issues.fetchIssue(1)

			expect(issue.votes).toBe(2)
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('downvoting an existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.voteIssue(1, 'test', -1)

			const issue = await issues.fetchIssue(1)
			expect(issue.votes).toEqual(-1)
		} catch (err) {
			done.fail(err.message)
		} finally {
			done()
		}
	})

	test('downvoting a non existing issue', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await issues.voteIssue(1, 'test', -1)

			done.fail('error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('issue does not exist'))
			done()
		}
	})

	test('downvoting for same issue twice', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.voteIssue(1, 'test', -1)
			await issues.voteIssue(1, 'test', -1)

			done.fail('error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('You cannot vote multiple times for the same issue.'))
			done()
		}
	})

	test('downvoting an issue from multiple users', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.voteIssue(1, 'test1', -1)
			await issues.voteIssue(1, 'test2', -1)

			const issue = await issues.fetchIssue(1)

			expect(issue.votes).toBe(-2)
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('changing user vote', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.reportIssue(baseIssue)

			await issues.voteIssue(1, 'test', -1)
			await issues.voteIssue(1, 'test', 1)

			const issue = await issues.fetchIssue(1)

			expect(issue.votes).toBe(1)
		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id must not be blank', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.voteIssue()

			done.fail('error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('id must not be blank'))
			done()
		}
	})

	test('id must be number (convertable)', async done => {
		expect.assertions(0)

		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await issues.voteIssue('1', 'test', 1)

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('id must be number', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await expect(issues.voteIssue('asdfadf', 'test', 1))
				.rejects.toEqual(Error('value is not a number'))

		} catch (err) {
			done.fail(err)
		} finally {
			done()
		}
	})

	test('username should not be blank', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.voteIssue(1)

			done.fail('error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('username must not be blank'))
			done()
		}
	})

	test('value should not be blank', async done => {
		expect.assertions(1)

		try {
			const issues = await new Issues()
			await issues.voteIssue(1, 'test')

			done.fail('error should have been thrown')
		} catch (err) {
			expect(err).toEqual(Error('value must not be blank'))
			done()
		}
	})
})

describe('getAllocatedJobs()', () => {
	test('fetching allocated jobs when they exist', async done => {
		try {
			const issues = await new Issues()

			await issues.reportIssue(baseIssue)
			await issues.updateIssueStatus(1, 'allocated')

			const allocatedIssues = await issues.getAllocatedJobs()
			expect(allocatedIssues.length).toBe(1)
		} catch(err) {
			done.fal(err)
		} finally {
			done()
		}
	})

	test('fetching allocated jobs when they do not exist', async done => {
		try {
			const issues = await new Issues()

			const allocatedIssues = await issues.getAllocatedJobs()
			expect(allocatedIssues.length).toBe(0)
		} catch(err) {
			done.fal(err)
		} finally {
			done()
		}
	})
})
