'use strict'

const sqlite = require('sqlite-async')

const requiredIssueKeys=['description', 'type', 'dateSubmitted', 'username', 'priority', 'lat', 'lng']


module.exports = class Issue {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// eslint-disable-next-line max-len
			const sql = `CREATE TABLE IF NOT EXISTS issues (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, type TEXT, dateSubmitted INTEGER, status TEXT DEFAULT "pending", username TEXT, priority INTEGER, votes INTEGER DEFAULT 0, lat REAL, lng REAL);
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

	validateTimestamp(timestamp) {
		// check for -ve timestamp
		if(timestamp < 0) throw new Error('timestamp cannot be negative')
		// check for too advanced timestamp
		const daySeconds = 60*60*24
		if(timestamp > Date.now() + daySeconds) throw new Error('timestamp is too far in the future')
	}

	async validateIssueCredentials(issue) {
		try {
			// check missing data
			this.checkMissingData(issue)
			// check validate timestamp
			this.validateTimestamp(issue.dateSubmitted)
		} catch(err) {
			throw err
		}
	}

	async reportIssue(issue) {
		try {
			await this.validateIssueCredentials(issue)

			const sql = `INSERT INTO issues(description, type, dateSubmitted, username, priority, lat, lng)
			VALUES("${issue.description}",
			"${issue.type}",
			${issue.dateSubmitted},
			"${issue.username}",
			${issue.priority},
			${issue.lat},
			${issue.lng})`

			await this.db.run(sql)
		} catch(err) {
			throw err
		}
	}

	async fetchIssue(id) {
		const sql = `SELECT * from issues WHERE id=${id}`
		const record = await this.db.get(sql)

		return record ? record : {}
	}

	async fetchAllIssues() {
		const sql = 'SELECT * from issues'
		const records = await this.db.all(sql)


		return records ? records : []
	}
}
