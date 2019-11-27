const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')

const width = 1280
const height = 720
const delayMS = 5

const appUrl = 'http://localhost:9000'

let browser
let page
let har

// threshold is the difference in pixels before the snapshots dont match
const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2 },
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll( async() => {
	try {
		browser = await puppeteer.launch({ headless: false, slowMo: delayMS, 
			args: [
				`--window-size=${width},${height}`, 
				'--no-sandbox',
				'--disable-setuid-sandbox']
			})
	} catch(err) {
		console.log('Error launching browser')
		throw err
	}
	
	page = await browser.newPage()
	har = new PuppeteerHar(page)
	await page.setViewport({ width, height })

	await page.on('dialog', async dialog => {
		console.log(dialog.message())
		await dialog.dismiss()
	})
})

afterAll( () => browser.close() )

describe('home_page', () => {
	test('original not logged in', async done => {
		//ARRANGE
		await page.tracing.start({path: 'trace/original_heading_har.json',screenshots: true})
		await har.start({ path: 'trace/original_heading_trace.har' })

		await page.goto(`${appUrl}`)
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/home_page_no_login.png' })

		await page.waitForSelector('h1')

		// check title
		expect( await page.title() ).toBe('Home')

		// check first header
		expect( await page.evaluate( () => document.querySelector('h1').innerText) ).toBe('INTRODUCTION')

		const BACK_PAGINATION = '#root > div > div.container.h-centered-margin > div > div > div.page-circles > svg.svg-inline--fa.fa-chevron-left.fa-w-10.arrow'
		const FRONT_PAGINATION = '#root > div > div.container.h-centered-margin > div > div > div.page-circles > svg.svg-inline--fa.fa-chevron-right.fa-w-10.arrow'
		
		// clicking on front page option
		await page.click(FRONT_PAGINATION)
		expect( await page.evaluate( () => document.querySelector('h1').innerText) ).toBe('FOUND AN ISSUE?')
		// go back
		await page.click(BACK_PAGINATION)
		expect( await page.evaluate( () => document.querySelector('h1').innerText) ).toBe('INTRODUCTION')
		// go back again
		await page.click(BACK_PAGINATION)
		expect( await page.evaluate( () => document.querySelector('h1').innerText) ).toBe('LOOKING FOR LOCAL ISSUES?')

		// take a screenshot
		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})

describe('navbar', () => {
	test('checking for working links', async done => {
		//tracing
		await page.tracing.start({path: 'trace/navbar_links_har.json',screenshots: true})
		await har.start({ path: 'trace/navbar_links_trace.har' })
		// check navbar
		expect( await page.evaluate( () => {
			return document.querySelectorAll('.nav div a').length
		})).toBe(3)

		const HOME_BUTTON = '#root > div > div.nav.shadow > div.fl-left.h-centered-margin > a'
		const REGISTER_BUTTON = '#root > div > div.nav.shadow > div.fl-right > a:nth-child(1)'
		const LOGIN_BUTTON = '#root > div > div.nav.shadow > div.fl-right > a:nth-child(2)'

		await page.click(HOME_BUTTON)
		expect( await page.title()).toBe('Home')

		await page.click(LOGIN_BUTTON)
		expect ( await page.title()).toBe('Login')

		await page.click(REGISTER_BUTTON)
		expect ( await page.title()).toBe('Register')
		
		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)
})

describe('register', () => {

	test('checking page screenshot', async done => {
		
		await page.goto(`${appUrl}/register`, {waitUntil : 'load'})

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('checking already have an account link', async done => {
		//tracing
		await page.tracing.start({path: 'trace/register_have_account_link.json',screenshots: true})
		await har.start({ path: 'trace/register_have_account_link_trace.har' })

		await page.goto(`${appUrl}/register`, {waitUntil : 'load'})

		const ACCOUNT_LINK = '#root > div > div.container.h-centered-margin > div > form > div.form-footer > a'

		await page.waitForSelector(ACCOUNT_LINK)
		await page.click(ACCOUNT_LINK)

		await page.waitForSelector('h1')
		await page.waitFor(1000)

		expect(await page.title())
			.toBe('Login')

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('registering for an account', async done => {
		//tracing
		await page.tracing.start({path: 'trace/registering_account.json',screenshots: true})
		await har.start({ path: 'trace/registering_account_trace.har' })

		await page.goto(`${appUrl}/register`, {waitUntil : 'load'})

		// setup selectors
		const FN_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(1) > div:nth-child(1) > input[type=text]'
		const LN_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(1) > div:nth-child(2) > input[type=text]'
		const EMAIL_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(2) > input[type=text]'
		const USERNAME_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(3) > input[type=text]'
		const PASS_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(4) > div:nth-child(1) > input[type=password]'
		const PASS_CONFIRM_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(4) > div:nth-child(2) > input[type=password]'
		const ADDRESS_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(5) > div:nth-child(1) > input[type=text]'
		const PC_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(5) > div:nth-child(2) > input[type=text]'

		const SUBMIT = '#root > div > div.container.h-centered-margin > div > form > div.form-footer > button'

		await page.click(SUBMIT)
		await page.waitForSelector('.error-box .info p')

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toEqual(`firstName must not be blank`)

		await page.type(FN_INPUT, 'joe')
		await page.type(LN_INPUT, 'mitchell')
		await page.type(EMAIL_INPUT, 'test')
		await page.type(USERNAME_INPUT, 'mitch137')
		await page.type(PASS_INPUT, 'test')
		await page.type(PASS_CONFIRM_INPUT, 'test_wrong')
		await page.type(ADDRESS_INPUT, '123 Test Street')
		await page.type(PC_INPUT, '123 456')

		await page.click(SUBMIT)
		await page.waitForSelector('.error-box .info p')

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toEqual(`email must contain the @ symbol`)

		await page.type(EMAIL_INPUT, '@')
		await page.click(SUBMIT)
		await page.waitForSelector('.error-box .info p')

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toEqual(`email must contain atleast one . symbol`)

		await page.click(EMAIL_INPUT, {clickCount : 3})
		await page.type(EMAIL_INPUT, 'test.@')

		await page.click(SUBMIT)
		await page.waitForSelector('.error-box .info p')

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toEqual(`email's @ symbol must come before the . symbol`)

		await page.click(EMAIL_INPUT, {clickCount : 3})
		await page.type(EMAIL_INPUT, 'test@test.com')

		await page.click(SUBMIT)
		await page.waitForSelector('.error-box .info p')

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toEqual(`passwords must match`)

		await page.click(PASS_CONFIRM_INPUT, {clickCount : 3})
		await page.type(PASS_CONFIRM_INPUT, 'test')

		await page.click(SUBMIT)

		await page.waitForSelector('.welcome-message')

		expect(await page.title()).toBe('Home')

		expect( await page.evaluate( () => document.querySelector('.welcome-message').innerText))
			.toBe('Welcome, mitch137')
		
		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 30000)

	test('logout', async done => {
		//tracing
		await page.tracing.start({path: 'trace/logout.json',screenshots: true})
		await har.start({ path: 'trace/logout_trace.har' })

		await page.goto(`${appUrl}`, {waitUntil : 'load'})

		const LOGOUT = '#root > div > div.nav.shadow > div.fl-right > button'

		await page.waitForSelector('button')
		await page.waitFor(1000)
		await page.click(LOGOUT)

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	})
})

describe('login', () => {
	test('checking register account link', async done => {
		//tracing
		await page.tracing.start({path: 'trace/login_no_account_link.json',screenshots: true})
		await har.start({ path: 'trace/login_no_account_link_trace.har' })

		await page.goto(`${appUrl}/login`, {waitUntil : 'load'})

		const NO_ACCOUNT_LINK = '#root > div > div.container.h-centered-margin > div > form > div.form-footer > a'

		await page.waitForSelector(NO_ACCOUNT_LINK)

		await page.click(NO_ACCOUNT_LINK)

		await page.waitForSelector('h1')
		await page.waitFor(1000)

		expect(await page.title())
			.toBe('Register')

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('checking page screenshot', async done => {
		await page.goto(`${appUrl}/login`, {waitUntil : 'load'})

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	})

	test('checking login with invalid username and pass', async done => {
		//tracing
		await page.tracing.start({path: 'trace/login_invalid_details_both.json',screenshots: true})
		await har.start({ path: 'trace/login_invalid_details_both_trace.har' })

		const USER_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(1) > input[type=text]'
		const PASS_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(2) > input[type=password]'
		const CLOSE = '#root > div > div.container.h-centered-margin > div > form > span > div > div.info > svg'

		const SUBMIT_BTN = '#root > div > div.container.h-centered-margin > div > form > div.form-footer > button'
	
		await page.waitForSelector(USER_INPUT)

		await page.type(USER_INPUT, 'invalid')
		await page.type(PASS_INPUT, 'invalid')

		await page.click(SUBMIT_BTN)

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toBe(`username "invalid" not found`)

		await page.waitForSelector(CLOSE)
		await page.click(CLOSE)

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('checking login with invalid password for valid account', async done => {
		//tracing
		await page.tracing.start({path: 'trace/login_invalid_details_password.json',screenshots: true})
		await har.start({ path: 'trace/login_invalid_details_password_trace.har' })

		const USER_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(1) > input[type=text]'
		// const PASS_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(2) > input[type=password]'
		const CLOSE = '#root > div > div.container.h-centered-margin > div > form > span > div > div.info > svg'

		const SUBMIT_BTN = '#root > div > div.container.h-centered-margin > div > form > div.form-footer > button'
	
		await page.waitForSelector(USER_INPUT)

		await page.click(USER_INPUT, {clickCount: 4})
		await page.type(USER_INPUT, 'mitch137')
		await page.waitFor(1000)

		await page.click(SUBMIT_BTN)

		await page.waitForSelector('.error-box .info p')

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toBe(`invalid password for account "mitch137"`)

		await page.waitForSelector(CLOSE)
		await page.click(CLOSE)

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('checking login with valid username and password', async done => {
		//tracing
		await page.tracing.start({path: 'trace/login_valid_details.json',screenshots: true})
		await har.start({ path: 'trace/login_invalid_valid_details_trace.har' })

		const PASS_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(2) > input[type=password]'
		const SUBMIT_BTN = '#root > div > div.container.h-centered-margin > div > form > div.form-footer > button'
	
		await page.waitForSelector(PASS_INPUT)

		await page.click(PASS_INPUT, { clickCount : 3})
		await page.type(PASS_INPUT, 'test')

		await page.click(SUBMIT_BTN)

		await page.waitForSelector('h1')
		await page.waitFor(1000)

		expect( await page.title())
			.toBe('Home')

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('checking navbar has updated once logged in', async done => {
		//tracing
		await page.tracing.start({path: 'trace/login_navbar.json',screenshots: true})
		await har.start({ path: 'trace/login_navbar_trace.har' })

		await page.waitForSelector('.nav button')

		expect(await page.evaluate( () => document.querySelectorAll('.nav a, .nav button').length))
			.toBe(4)

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('check login message', async done => {
		await page.waitForSelector('em')

		expect(await page.evaluate( () => document.querySelector('em').innerText))
			.toBe('Welcome, mitch137')

		done()
	}, 16000)
})

describe('report issue', () => {

	test('checking page screenshot', async done => {
		await page.goto(`${appUrl}/issues/report`, {waitUntil : 'load'})

		await page.waitFor(1000)
		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('reporting issue (initial details)', async done => {
		//tracing
		await page.tracing.start({path: 'trace/report_issues_initial.json',screenshots: true})
		await har.start({ path: 'trace/report_issues_initial_trace.har' })

		// patch current location to avoid permission request
		await page.evaluate(function() {
			navigator.geolocation.getCurrentPosition = function (cb) {
			  setTimeout(() => {
				cb({
				  'coords': {
					accuracy: 21,
					altitude: null,
					altitudeAccuracy: null,
					heading: null,
					latitude: 52.405462,
					longitude: -1.499591,
					speed: null
				  }
				})
			  }, 1000)
			}
		  });

		const ISSUE_DESC = '#root > div > div.container.h-centered-margin > div > div > form > div > div:nth-child(2) > textarea'
		const ISSUE_TYPE = '#root > div > div.container.h-centered-margin > div > div > form > div > div:nth-child(3) > select'

		const NEXT = '#root > div > div.container.h-centered-margin > div > div > form > div > div:nth-child(4) > button'

		await page.waitForSelector('h2')

		expect(await page.evaluate( () => document.querySelector('h2').innerText))
			.toBe('Issue Details')

		await page.waitForSelector(NEXT)
		await page.click(NEXT)

		await page.waitForSelector('.error-box .info p')
		expect( await page.evaluate( () => document.querySelector('.error-box .info p').innerText))
		  .toBe('please fill in the required fields...')

		await page.waitForSelector(ISSUE_DESC)
		await page.type(ISSUE_DESC, 'This is a test issue report.')

		await page.waitForSelector(ISSUE_TYPE)
		await page.select(ISSUE_TYPE, 'Pothole')

		await page.click(NEXT)

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('report issue (location selection)', async done => {
		//tracing
		await page.tracing.start({path: 'trace/report_issues_location.json',screenshots: true})
		await har.start({ path: 'trace/report_issues_location_trace.har' })

		const MAP = '#root > div > div.container.h-centered-margin > div > div.map.h-centered-margin.fill.gap-left.shadow.padding-20.anim-all-400 > div > div > div > div > div > div > div:nth-child(1) > div:nth-child(3)'
		// const LAT_INPUT = '#root > div > div.container.h-centered-margin > div > div.report.flex-no-grow.anim-all-400 > form > div > div.input-double > div:nth-child(1) > input[type=text]'
		// const LNG_INPUT = '#root > div > div.container.h-centered-margin > div > div.report.flex-no-grow.anim-all-400 > form > div > div.input-double > div:nth-child(2) > input[type=text]'
		const BACK = '#root > div > div.container.h-centered-margin > div > div.report.flex-no-grow.anim-all-400 > form > div > div:nth-child(5) > button:nth-child(1)'
		const NEXT = '#root > div > div.container.h-centered-margin > div > div > form > div > div:nth-child(4) > button'
		const SUBMIT = '#root > div > div.container.h-centered-margin > div > div.report.flex-no-grow.anim-all-400 > form > div > div:nth-child(5) > button.submit-button.w-fill.gap-top'
		
		await page.waitForSelector(MAP)

		await page.click(MAP)
		await page.waitFor(2000)

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		await page.waitForSelector('h2')

		expect(await page.evaluate( () => document.querySelector('h2').innerText))
			.toBe('Issue Location')

		await page.waitForSelector(BACK)
		await page.click(BACK)

		await page.waitFor(1000)

		await page.waitForSelector(NEXT)
		await page.click(NEXT)

		await page.waitFor(1000)

		await page.waitForSelector(MAP)
		await page.waitForSelector(SUBMIT)
		await page.waitFor(1000)

		await page.click(SUBMIT)

		await page.waitForSelector('h1')
		expect( await page.evaluate( () => document.querySelector('h1').innerText))
			.toBe('Reported Issues')
		
		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 30000)
})

describe('issues', () => {

	test('checking page screenshot', async done => {
		const ISSUES_LIST = '#root > div > div.container.h-centered-margin > div > div > div:nth-child(3)'
		await page.waitForSelector(ISSUES_LIST)

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	})

	test('checking initial displayed results', async done => { 
		//tracing
		await page.tracing.start({path: 'trace/issues_display.json',screenshots: true})
		await har.start({ path: 'trace/issues_display_trace.har' })

		await page.waitForSelector('#root > div > div.container.h-centered-margin > div > div > div:nth-child(3) > p > span.sub.abs-right')

		expect( await page.evaluate( () => document.querySelector('#root > div > div.container.h-centered-margin > div > div > div:nth-child(3) > p > span.sub.abs-right').innerText))
			.toBe('Displaying 1 Issues')

		await page.waitForSelector('.issue-card .user em')

		expect( await page.evaluate( () => document.querySelector('.issue-card .user em').innerText))
			.toBe('Issue reported by: mitch137')

		expect( await page.evaluate( () => getComputedStyle(document.querySelector('.issue-card .title')).backgroundColor))
			.toBe('rgb(235, 96, 96)')

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('checking filter', async done => {
		//tracing
		await page.tracing.start({path: 'trace/issues_filter.json',screenshots: true})
		await har.start({ path: 'trace/issues_filter_trace.har' })

		const FILTER = '#root > div > div.container.h-centered-margin > div > div > div.filter-bar.flex-50.gap-right'
		
		await page.waitForSelector(FILTER)

		expect( await page.evaluate( () => {
			const FILTER_ITEMS = '#root > div > div.container.h-centered-margin > div > div > div.filter-bar.flex-50.gap-right > div'
			return document.querySelector(FILTER_ITEMS).childElementCount
		})).toBe(2)

		const STATUS_SELECT = '#root > div > div.container.h-centered-margin > div > div > div.filter-bar.flex-50.gap-right > div > div:nth-child(1) > select'
		const PRIO_SELECT = '#root > div > div.container.h-centered-margin > div > div > div.filter-bar.flex-50.gap-right > div > div:nth-child(2) > select'
		const RESET = '#root > div > div.container.h-centered-margin > div > div > div.filter-bar.flex-50.gap-right > p > span'

		await page.select(STATUS_SELECT, 'allocated')
		await page.waitFor(1000)

		// check 0 returned results
		expect( await page.evaluate( () => document.querySelectorAll('.issue-card').length))
			.toBe(0)
		expect( await page.evaluate( () => document.querySelector('#root > div > div.container.h-centered-margin > div > div > div:nth-child(3) > p > span.sub.abs-right').innerText))
			.toBe('Displaying 0 Issues')

		await page.waitForSelector(RESET)

		await page.click(RESET)
		await page.waitFor(1000)

		expect( await page.evaluate( () => document.querySelectorAll('.issue-card').length))
			.toBe(1)

		await page.select(PRIO_SELECT, '2')
		await page.waitFor(1000)

		expect( await page.evaluate( () => document.querySelectorAll('.issue-card').length))
			.toBe(0)

		await page.select(PRIO_SELECT, '0')
		await page.waitFor(1000)

		expect( await page.evaluate( () => document.querySelectorAll('.issue-card').length))
			.toBe(1)

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('voting for issue', async done => {
		//tracing
		await page.tracing.start({path: 'trace/issue_vote_for.json',screenshots: true})
		await har.start({ path: 'trace/issue_vote_for_trace.har' })

		await page.waitForSelector('.upvote')

		await page.click('.upvote')
		await page.waitFor(1000)

		expect( await page.evaluate( () => document.querySelector('.issue-card .title span').innerText))
			.toBe('#1 Status: Reported - Votes: 1')

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	},16000)

	test('voting against issue', async done => {
		//tracing
		await page.tracing.start({path: 'trace/issue_vote_against.json',screenshots: true})
		await har.start({ path: 'trace/issue_vote_against_trace.har' })

		await page.waitForSelector('.downvote')

		await page.click('.downvote')
		await page.waitFor(1000)

		expect( await page.evaluate( () => document.querySelector('.issue-card .title span').innerText))
			.toBe('#1 Status: Reported - Votes: -1')

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	test('voting for same issue twice', async done => {
		//tracing
		await page.tracing.start({path: 'trace/issue_vote_duplicate.json',screenshots: true})
		await har.start({ path: 'trace/issue_vote_duplicate_trace.har' })

		await page.waitForSelector('.downvote')

		await page.click('.downvote')
		await page.waitFor(1000)

		expect( await page.evaluate( () => document.querySelector('.issue-card .title span').innerText))
			.toBe('#1 Status: Reported - Votes: -1')

		//stop tracing
		await page.tracing.stop()
		await har.stop()

		done()
	}, 16000)

	
})
