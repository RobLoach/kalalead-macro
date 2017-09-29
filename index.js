const puppeteer = require('puppeteer');

/**
 * Sleep the given millisecond timeout, await-compatible.
 *
 * @return Promise
 */
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

let screenshotIndex = 1;
/**
 * Take an indexed screenshot.
 */
async function screenshot(page) {
	await page.screenshot({
		path: 'screenshot-' + screenshotIndex++ + '.png'
	})
}

(async() => {
	// Wrap in a try to catch all errors.
	try {
		const password = process.env.PASS
		if (!password) {
			throw new Error('Set the PASS variable from LastPass:\n   PASS=MYPASSWORDHERE npm test\n')
		}

		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.goto('https://connect.data.com/login')
		await screenshot(page)

		const form = await page.$('form#command')
		if (form) {
			await screenshot(page)
			await page.focus('#j_username')
			await page.type('sales@kalamuna.com')
			await screenshot(page)
			await page.focus('#j_password')
			await page.type(password)
			const inputElement = await page.$('#login_btn span');
			await inputElement.click();
			console.log('sleep')
			await sleep(4000)
			console.log('sleep done')

			await screenshot(page)
			console.log('Done login1')
		}
		await page.goto('https://connect.data.com/search#p%3Dadvancedsearch%3B%3Bt%3Dcontacts')
		await screenshot(page)

		await browser.close()
	} catch (e) {
		// Catch-all the exceptions that were thrown.
		console.error(e)
	}
})()