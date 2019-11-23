const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')

const width = 800
const height = 600
const delayMS = 50

const appUrl = 'http://localhost:3000'

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
	browser = await puppeteer.launch({ headless: false, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
	page = await browser.newPage()
	har = new PuppeteerHar(page)
	await page.setViewport({ width, height })
})

afterAll( () => browser.close() )

// describe('home_page', () => {
// 	test('original not logged in', async done => {
// 		//ARRANGE
// 		await page.tracing.start({path: 'trace/original_heading_har.json',screenshots: true})
// 		await har.start({ path: 'trace/original_heading_trace.har' })

// 		await page.goto(`${appUrl}`)
// 		// take a screenshot and save to the file system
// 		await page.screenshot({ path: 'screenshots/home_page_no_login.png' })

// 		await page.waitForSelector('h1')

// 		// check title
// 		expect( await page.title() ).toBe('Home')

// 		// check first header
// 		expect( await page.evaluate( () => document.querySelector('h1').innerText) ).toBe('Introduction')

// 		const BACK_PAGINATION = '#root > div > div.container.h-centered-margin > div > div > div.page-circles > svg.svg-inline--fa.fa-chevron-left.fa-w-10.arrow'
// 		const FRONT_PAGINATION = '#root > div > div.container.h-centered-margin > div > div > div.page-circles > svg.svg-inline--fa.fa-chevron-right.fa-w-10.arrow'
		
// 		// clicking on front page option
// 		await page.click(FRONT_PAGINATION)
// 		expect( await page.evaluate( () => document.querySelector('h1').innerText) ).toBe('Found an Issue?')
// 		// go back
// 		await page.click(BACK_PAGINATION)
// 		expect( await page.evaluate( () => document.querySelector('h1').innerText) ).toBe('Introduction')
// 		// go back again
// 		await page.click(BACK_PAGINATION)
// 		expect( await page.evaluate( () => document.querySelector('h1').innerText) ).toBe('Looking for local issues?')

// 		// take a screenshot
// 		const image = await page.screenshot()
// 		expect(image).toMatchImageSnapshot()

// 		await page.tracing.stop()
// 		await har.stop()
// 		done()
// 	}, 16000)
// })

// describe('navbar', () => {
// 	test('checking for working links', async done => {
// 		// check navbar
// 		expect( await page.evaluate( () => {
// 			return document.querySelectorAll('.nav div a').length
// 		})).toBe(3)

// 		const HOME_BUTTON = '#root > div > div.nav.shadow > div.fl-left.h-centered-margin > a'
// 		const REGISTER_BUTTON = '#root > div > div.nav.shadow > div.fl-right > a:nth-child(1)'
// 		const LOGIN_BUTTON = '#root > div > div.nav.shadow > div.fl-right > a:nth-child(2)'

// 		await page.click(HOME_BUTTON)
// 		expect( await page.title()).toBe('Home')

// 		await page.click(REGISTER_BUTTON)
// 		expect ( await page.title()).toBe('Register')

// 		await page.click(LOGIN_BUTTON)
// 		expect ( await page.title()).toBe('Login')
		
// 		done()
// 	}, 16000)
// })

describe('login', () => {
	test('checking login redirect', async done => {
		
		await page.goto(`${appUrl}/issues`, {waitUntil : 'load'})
		
		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		const USER_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(1) > input[type=text]'
		const PASS_INPUT = '#root > div > div.container.h-centered-margin > div > form > div.input-fields.h-centered-margin > div:nth-child(2) > input[type=password]'
		
		const SUBMIT_BTN = '#root > div > div.container.h-centered-margin > div > form > div.form-footer > button'
		const NO_ACCOUNT_LINK = '#root > div > div.container.h-centered-margin > div > form > div.form-footer > a'


		await page.type(USER_INPUT, 'invalid')
		await page.type(PASS_INPUT, 'invalid')

		await page.click(SUBMIT_BTN)

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toEqual(`username "invalid" not found`)

		await page.click(USER_INPUT, { clickCount: 3})
		await page.type(USER_INPUT, '123')

		await page.click(SUBMIT_BTN)

		expect(await page.evaluate(() => document.querySelector('.error-box .info p').innerText))
			.toEqual(`invalid password for account "123"`)

		await page.click(PASS_INPUT, { clickCount : 3})
		await page.type(PASS_INPUT, '123')

		await page.click(SUBMIT_BTN)
		
		await page.waitFor(2000)

		done()
	}, 16000)
})
