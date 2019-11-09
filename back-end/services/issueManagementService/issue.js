/* eslint-disable max-lines */
'use strict'

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
			const sql = `CREATE TABLE IF NOT EXISTS issues (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, type TEXT, dateSubmitted INTEGER, dateResolved INTEGER, status TEXT DEFAULT "reported", username TEXT, priority INTEGER DEFAULT 0, votes INTEGER DEFAULT 0, lat REAL, lng REAL, streetName TEXT DEFAULT "");
						 CREATE TABLE IF NOT EXISTS userVotes (issueID INTEGER, username TEXT);`
			await this.db.run(sql)
			return this
		})()
	}

	checkMissingData(issue) {
		for(const key of requiredIssueKeys) {
			if(!(key in issue)) throw new Error(`${key} missing`)
		}
	}

	checkCorrectDataTypes(issue) {
		for(const key of Object.keys(issue)) {
			if(typeof issue[key] !== typeof exampleResponse[key]) throw new Error(`${key} has invalid data type`)
		}
	}

	validateTimestamp(timestamp) {
		// check for -ve timestamp
		if(timestamp < 0) throw new Error('timestamp cannot be negative')
		// check for too advanced timestamp
		// eslint-disable-next-line no-magic-numbers
		const daySeconds = 60*60*24,
			advancedTimeStamp = Date.now() + daySeconds
		if(timestamp > advancedTimeStamp) throw new Error('timestamp is too far in the future')
	}

	checkUndefinedParams(params) {
		for(const key of Object.keys(params)) {
			if(!params[key] || params[key]==='') throw new Error(`${key} must not be blank`)
		}
	}

	async validateIssueCredentials(issue) {
		try {
			// check issue is defined
			this.checkUndefinedParams({issue})
			// check missing data
			this.checkMissingData(issue)
			// check data types
			this.checkCorrectDataTypes(issue)
			// check validate timestamp
			this.validateTimestamp(issue.dateSubmitted)

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
		this.checkUndefinedParams({id})

		const sql = `SELECT * FROM issues WHERE id=${id}`
		const record = await this.db.get(sql)

		return record ? record : {}
	}

	async fetchAllIssues() {
		const sql = 'SELECT * FROM issues'
		const records = await this.db.all(sql)

		return records
	}

	async fetchUserIssues(username) {
		this.checkUndefinedParams({username})

		const sql = `SELECT * FROM issues WHERE username="${username}"`
		const records = await this.db.all(sql)

		return records
	}

	async deleteIssue(id) {
		try {
			this.checkUndefinedParams({id})
			await this.checkIssueExists(id)
			const sql = `DELETE from issues WHERE id=${id}`
			this.db.run(sql)
		} catch(err) {
			throw err
		}
	}

	async updateIssueStatus(id, status) {
		try {
			this.checkUndefinedParams({id, status})

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
			this.checkUndefinedParams({id})
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
			this.checkUndefinedParams({id, priority})
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
