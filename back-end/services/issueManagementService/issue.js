/* eslint-disable max-lines */
'use strict'

// import validation module
const validate = require('@mitch137/validation')

const sqlite = require('sqlite-async')

const requiredIssueKeys=['description', 'type', 'dateSubmitted', 'username']
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

	async validateIssueCredentials(issue) {
		try {
			console.log(issue)

			validate.checkUndefinedParams({issue})
			validate.checkMissingData(issue, requiredIssueKeys)
			validate.checkCorrectDataTypes(issue, exampleResponse)
			validate.validateTimestamp(issue.dateSubmitted)
		} catch(err) {
			throw err
		}
	}

	async checkIssueExists(id) {
		const sql = `SELECT COUNT(id) as count FROM issues WHERE id=${id};`
		const records = await this.db.get(sql)

		if(records.count === 0) throw new Error('issue does not exist')
	}

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

	async fetchIssue(id) {
		validate.checkUndefinedParams({id})

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

	async fetchUserIssues(username) {
		validate.checkUndefinedParams({username})

		const sql = `SELECT * FROM issues WHERE username="${username}"`
		const records = await this.db.all(sql)

		return records
	}

	async deleteIssue(id) {
		try {
			validate.checkUndefinedParams({id})
			await this.checkIssueExists(id)
			const sql = `DELETE from issues WHERE id=${id}`
			this.db.run(sql)
		} catch(err) {
			throw err
		}
	}

	async updateIssueStatus(id, status) {
		try {
			validate.checkUndefinedParams({id, status})

			await this.checkIssueExists(id)
			const sql = `UPDATE issues SET status="${status}" WHERE id=${id};`
			this.db.run(sql)

			// check if issue has been set to resolved
			if(status==='resolved') await this.setResolutionTime(id)
		} catch (err) {
			throw err
		}
	}

	async setResolutionTime(id) {
		try{
			validate.checkUndefinedParams({id})
			await this.checkIssueExists(id)

			const now = Date.now()
			const sql = `UPDATE issues SET dateResolved=${now} WHERE id=${id};`
			this.db.run(sql)
		} catch(err) {
			throw err
		}
	}

	// eslint-disable-next-line complexity
	async updateIssuePriority(id, priority) {
		try {
			validate.checkUndefinedParams({id, priority})
			await this.checkIssueExists(id)

			if(isNaN(priority)) throw new Error('priority must be a positive number')
			if(priority <= 0) throw new Error('priority cannot be negative or equal to 0')

			const sql = `UPDATE issues SET priority=${priority} WHERE id=${id}`
			this.db.run(sql)
		} catch (err) {
			throw err
		}
	}
}
