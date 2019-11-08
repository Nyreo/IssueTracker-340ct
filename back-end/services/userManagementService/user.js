/* eslint-disable max-lines */
/* eslint-disable complexity */

'use strict'

const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const EmailController = require('./emailController')

module.exports = class User {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.emailController = new EmailController()
			this.db = await sqlite.open(dbName)
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, firstName TEXT, lastName TEXT, email TEXT, address TEXT, postCode TEXT, isStaff INTEGER DEFAULT 0);'
			await this.db.run(sql)
			return this
		})()
	}

	async generateWebToken(data) {
		const options = {
			expiresIn: '30m'
		}
		return jwt.sign(data, 'somekey', options)
	}

	async isStaff(username) {
		const sql = `SELECT isStaff from users WHERE username="${username}"`
		const record = await this.db.get(sql)

		return record.isStaff
	}

	async validateEmailAddress(email) {
		// check if the email address contains the @ symbol
		const atIndex = email.indexOf('@')
		const dotIndex = email.indexOf('.')
		// if(atIndex < 0 || dotIndex < 0 || atIndex > dotIndex) throw new Error('invalid email address')
		if(atIndex < 0) throw new Error('email must contain the @ symbol')
		if(dotIndex < 0) throw new Error('email must contain atleast one . symbol')
		if(atIndex > dotIndex) throw new Error('email\'s @ symbol must come before the . symbol')
		if(dotIndex === email.length - 1) throw new Error('email must contain content after the . symbol')
		return true
	}

	/**
	 * Function to check the credentials object submitted by the user
	 *
	 * @name validateUserCredentials Script
	 * @param {object} userDetails - Consists of the user's credentials
	 * @returns {boolean} success of the operation
	 * @throws {Error} invalid credentials
	 */
	async validateUserCredentials(userDetails) {
		// check if any of the details are blank
		for(const key of Object.keys(userDetails)) {
			if(userDetails[key] === '') throw new Error(`${key} must not be blank`)
		}
		// validate email address
		await this.validateEmailAddress(userDetails.email)

		// check if the user exists already
		const sql = `SELECT COUNT(id) as records FROM users WHERE username="${userDetails.username}";`
		const data = await this.db.get(sql)
		if(data.records !== 0) throw new Error(`username "${userDetails.username}" already in use`)

		// if all details are there check if passwords match
		if(userDetails.password !== userDetails.confirmPassword) throw new Error('passwords must match')
	}

	async sendUserEmail(content) {
		// fetch the user's email from db
		const sql = `SELECT email from users WHERE username="${content.user}"`
		const record = await this.db.get(sql)

		console.log('record: ', record)

		if(record.email) {
			const email = record.email
			const options = {
				to: email,
				subject: content.subject,
				html: content.message
			}
			console.log('options: ', options)
			this.emailController.sendEmail(options)
		}
	}

	/**
	 * Function to register the user's credentials in the database.
	 *
	 * @name Register Script
	 * @param {object} userDetails - Consists of the user's credentials
	 * @returns {boolean} success of the operation
	 */
	// eslint-disable-next-line max-lines-per-function
	async register(userDetails) {
		try {
			//destructure object
			const {username, password, firstName, lastName, email, address, postCode} = userDetails

			await this.validateUserCredentials(userDetails)
			// if no validation issues, insert the user
			const ePassword = await bcrypt.hash(password, saltRounds)
			const sql = `INSERT INTO users(username, password, firstName, lastName, address, email, postCode) 
				VALUES("${username}", 
				"${ePassword}", 
				"${firstName}", 
				"${lastName}", 
				"${address}", 
				"${email}", 
				"${postCode}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	/**
	 * Function to check the user's credentials when logging in to determine authorisation
	 *
	 * @name Login Script
	 * @param {string} username - The username to be checked
	 * @param {string} password - The password to be checked
	 * @returns {boolean} success of the operation
	 */
	async login(username, password) {
		try {
			// check for blank inptus
			if(username === '') throw new Error('username must not be blank')
			if(password === '') throw new Error('password must not be blank')
			// fetch record from database
			let sql = `SELECT count(id) AS count FROM users WHERE username="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${username}" not found`)
			sql = `SELECT password FROM users WHERE username = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.password)
			if(valid === false) throw new Error(`invalid password for account "${username}"`)
			return true
		} catch(err) {
			throw err
		}
	}
}
