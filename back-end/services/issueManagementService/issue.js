/* eslint-disable max-lines */
'use strict'

// import validation module
const validate = require('@mitch137/validation')

const sqlite = require('sqlite-async')

const requiredIssueKeys=['description', 'type', 'dateSubmitted', 'username', 'lat', 'lng']
const exampleResponse = {
	description: 'example',
	type: 'example',
	dateSubmitted: 1,
	username: 'example',
	lat: 1.0,
	lng: 1.0,
	streetName: 'example'
}

module.exports = class Issue {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// eslint-disable-next-line max-len
			let sql = 'CREATE TABLE IF NOT EXISTS issues (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, type TEXT, dateSubmitted INTEGER, dateResolved INTEGER, status TEXT DEFAULT "reported", username TEXT, priority INTEGER DEFAULT 0, votes INTEGER DEFAULT 0, lat REAL, lng REAL, streetName TEXT DEFAULT "");'
			await this.db.run(sql)
			sql = `CREATE TABLE IF NOT EXISTS votes (
				issueID	INTEGER NOT NULL,
				username	TEXT NOT NULL,
				value	INTEGER NOT NULL,
				PRIMARY KEY(issueID,username)
			);`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * The script to perform all validation checks on a given issue
	 *
	 * @name validateIssueCredentials Script
	 * @param {object} issue
	 * @throws {Error} validation error
	 * @async
	 */
	async validateIssueCredentials(issue) {
		try {
			validate.checkUndefinedParams({issue})
			validate.checkMissingData(issue, requiredIssueKeys)
			validate.checkCorrectDataTypes(issue, exampleResponse)
			validate.validateTimestamp(issue.dateSubmitted)
		} catch(err) {
			throw err
		}
	}

	/**
	 * The script to check if a user account exists
	 *
	 * @name checkIssueExists Script
	 * @param {integer} id
	 * @throws {Error} issue does not exist
	 * @async
	 */
	async checkIssueExists(id) {
		const sql = `SELECT COUNT(id) as count FROM issues WHERE id=${id};`
		const records = await this.db.get(sql)

		if(records.count === 0) throw new Error('issue does not exist')
	}

	/**
	 * The script to insert a new issue into the database
	 *
	 * @name reportIssue Script
	 * @param {object} issue
	 * @throws {Error} validation error
	 * @async
	 */
	async reportIssue(issue) {
		try {
			await this.validateIssueCredentials(issue)

			const sql = `INSERT INTO issues(description, type, dateSubmitted, username, lat, lng, streetName)
			VALUES("${issue.description}",
			"${issue.type}",
			${issue.dateSubmitted},
			"${issue.username}",
			${issue.lat},
			${issue.lng},
			"${(issue.streetName ? issue.streetName : '')}");`

			await this.db.run(sql)
		} catch(err) {
			throw err
		}
	}

	/**
	 * The script to fetch a specific issue from the database
	 *
	 * @name fetchIssue Script
	 * @param {integer} id
	 * @returns {object} record
	 * @async
	 */
	async fetchIssue(id) {
		validate.checkUndefinedParams({id})
		validate.validateNumber(id)

		const sql = `SELECT *,
						coalesce((
							SELECT SUM(value)
							FROM votes
							WHERE id = issueID
						), 0)
						votes
					FROM issues
					WHERE id=${id}`
		const record = await this.db.get(sql)

		return record ? record : {}
	}

	/**
	 * The script to fetch every issue from the database
	 *
	 * @name fetchAllIssues Script
	 * @returns {object[]} array of record objects
	 * @async
	 */
	async fetchAllIssues() {
		// select sum of votes from votes table in addition to data
		const sql = `SELECT *,
						coalesce((
							SELECT SUM(value)
							FROM votes
							WHERE id = issueID
						), 0)
						votes
					FROM issues`
		const records = await this.db.all(sql)

		return records
	}

	/**
	 * The script to perform fetching of all issues submitted by a given user
	 *
	 * @name fetchUserIssues Script
	 * @param {string} username
	 * @returns {object[]} array of record objects
	 * @async
	 */
	async fetchUserIssues(username) {
		validate.checkUndefinedParams({username})
		validate.checkCorrectDataTypes({username}, {username: 'username'})

		const sql = `SELECT * FROM issues WHERE username="${username}"`
		const records = await this.db.all(sql)

		return records
	}

	/**
	 * The script to perform the deletion of an issue
	 *
	 * @name deleteIssue Script
	 * @param {integer} id
	 * @throws {Error} undefined parameters
	 * @async
	 */
	async deleteIssue(id) {
		try {
			validate.checkUndefinedParams({id})
			validate.validateNumber(id)
			await this.checkIssueExists(id)
			const sql = `DELETE from issues WHERE id=${id}`
			await this.db.run(sql)
		} catch(err) {
			throw err
		}
	}

	/**
	 * The script to perform updating the status of a given issue
	 *
	 * @name updateIssueStatus Script
	 * @param {integer} id
	 * @param {string} status
	 * @throws {Error} valdiation error
	 * @async
	 */
	async updateIssueStatus(id, status) {
		try {
			validate.checkUndefinedParams({id, status})
			validate.checkCorrectDataTypes({status}, {status: 'status'})
			validate.validateNumber(id)

			await this.checkIssueExists(id)
			// get original status - if was resolved, remove data resolved
			const issue = await this.fetchIssue(id)
			if(issue.status === 'resolved' && status !== 'resolved') await this.removeResolutionTime(id)

			const sql = `UPDATE issues SET status="${status}" WHERE id=${id};`
			await this.db.run(sql)

			// check if issue has been set to resolved
			if(status==='resolved') await this.setResolutionTime(id)
		} catch (err) {
			throw err
		}
	}

	/**
	 * The script to remove the resolution time
	 *
	 * @name removeResolutionTime Script
	 * @param {integer} id
	 * @throws {Error} validation error
	 * @async
	 */
	async removeResolutionTime(id) {
		const sql = `UPDATE issues SET dateResolved=${null} WHERE id=${id};`
		await this.db.run(sql)
	}

	/**
	 * The script to set the time a issue was completed
	 *
	 * @name setResolutionTime Script
	 * @param {integer} id
	 * @throws {Error} validation error
	 * @async
	 */
	async setResolutionTime(id) {
		try{
			validate.checkUndefinedParams({id})
			validate.validateNumber(id)
			await this.checkIssueExists(id)

			const now = Date.now()
			const sql = `UPDATE issues SET dateResolved=${now} WHERE id=${id};`
			this.db.run(sql)
		} catch(err) {
			throw err
		}
	}
	/**
	 * The script to perform updating the priority of a given issue
	 *
	 * @name updateIssuePriority Script
	 * @param {integer} id
	 * @param {string} priority
	 * @throws {Error} valdiation error
	 * @async
	*/

	async updateIssuePriority(id, priority) {
		try {
			validate.checkUndefinedParams({id, priority})
			validate.validateNumber(id)
			validate.checkCorrectDataTypes({priority}, {priority: 1})
			await this.checkIssueExists(id)

			if(priority <= 0) throw new Error('priority cannot be negative or equal to 0')

			const sql = `UPDATE issues SET priority=${priority} WHERE id=${id}`
			this.db.run(sql)
		} catch (err) {
			throw err
		}
	}

	/**
	 * The script to check if the user has already voted for a certain issue
	 *
	 * @name checkUserVote Script
	 * @param {integer} id
	 * @param {string} username
	 * @returns {object} record
	 * @async
	 */
	async checkUserVote(id, username) {
		const sql = `SELECT * FROM votes WHERE issueID=${id} AND username="${username}"`
		const record = this.db.get(sql)
		return record
	}

	/**
	 * The script to validate all aspects of the user's vote
	 *
	 * @name validateUserVote Script
	 * @param {integer} id
	 * @param {string} username
	 * @param {integer} value
	 * @throws {Error} multiple votes error
	 * @async
	 */
	async validateUserVote(id, username, value) {
		const userVote = await this.checkUserVote(id, username)
		// if user has already voted for issue
		if(userVote) {
			// check if attempting to vote multiple times
			if(userVote.value === value) {
				throw new Error('You cannot vote multiple times for the same issue.')
			} else {
				// remove previous vote
				const sql = `DELETE FROM votes WHERE issueID=${id} AND username="${username}"`
				await this.db.run(sql)
				return true
			}
		}
		return false
	}

	/**
	 * The script to perform action of inserting user vote in database
	 *
	 * @name voteIssue Script
	 * @param {integer} id
	 * @param {string} username
	 * @param {integer} value
	 * @throws {Error} valdiation error
	 * @returns {integer} new votes for the issue
	 * @async
	 */
	async voteIssue(id, username, value) {
		try {
			validate.checkUndefinedParams({id, username, value})
			validate.validateNumber(id)
			await this.checkIssueExists(id)
			await this.validateUserVote(id, username, value)
			let sql = `INSERT INTO votes(issueID, username, value) 
			VALUES(${id}, "${username}", ${value});`

			await this.db.run(sql)

			sql = `SELECT SUM(value) as votes FROM votes
			WHERE issueID=${id}`

			const record = await this.db.get(sql)
			return record.votes
		} catch(err) {
			throw err
		}
	}

	/**
	 * The script to perform action of inserting user vote in database
	 *
	 * @name getAllocatedJobs Script
	 * @returns {object[]} new votes for the issue
	 * @async
	 */
	async getAllocatedJobs() {
		const issues = await this.fetchAllIssues()
		return issues.filter(issue => issue.status === 'allocated')
	}
}
