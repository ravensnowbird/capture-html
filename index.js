#!/usr/bin/env node

const puppeteer = require('puppeteer');
const program = require('commander');

let defaultConfig = {
	sizeDOM: 'body',
	isMobile: false,
	deviceScale: 2,
	imageType: 'png',
	imageQuality: 50,
	fullPage: false
};
let clip = {
	x: 0,
	y: 0,
	height: 100,
	width: 100
};

program
	.version('1.0.0')
	.option('-d, --dom [value]', 'Set DOM specifically to capture, default is body')
	.option('-m, --mobile', 'Mobile mode, default is false')
	.option('-D, --deviceScale <n>', 'Device Scale Factor, default is 2', parseInt)
	.option('-T, --type [value]', 'Capture Image Type, default is png')
	.option('-Q, --quality <n>', 'Image Quality(Only when type set as jpeg)', parseInt)
	.option('-F, --fullpage', 'Capture Fullpage Image, default is false')
	.option('-C, --clip [value]', 'Capture a cliped image(Only when fullpage set as false)')
	.parse(process.argv);

if (program.dom && typeof program.dom === 'string') {
	defaultConfig.sizeDOM = unescape(program.dom);
}
if (program.mobile) {
	defaultConfig.isMobile = true;
}
if (program.deviceScale) {
	defaultConfig.deviceScale = program.deviceScale;
}
if (program.type) {
	defaultConfig.imageType = program.type;
}
if (program.quality) {
	defaultConfig.imageQuality = program.quality;
}
if (program.fullpage) {
	defaultConfig.fullPage = true;
}
if (!defaultConfig.fullPage && program.clip) {
	clip = JSON.parse(program.clip);
}
let URLs = program.args;

(async () => {
  	// init Chromium
  	const browser = await puppeteer.launch();
  	const page = await browser.newPage();

  	// load url
  	await page.goto(URLs[0]);

  	// get page size
  	const result = await page.evaluate((sizeDOM) => {
		return new Promise((rs, rj) => {
	  		setTimeout(() => {
				let body = document.querySelector(sizeDOM);
				rs({
		  			height: body.offsetHeight,
		  			width: body.offsetWidth
				})
	  		})
		})
	}, defaultConfig.sizeDOM);

  	// init viewport
  	await page.setViewport({
		height: result.height,
		width: result.width,
		isMobile: defaultConfig.isMobile,
		deviceScaleFactor: defaultConfig.deviceScale
  	})

  	setTimeout(async function () {
		// capture screen
		let screenshotConfig = {
	  		path: `${+new Date()}.${defaultConfig.imageType}`,
	  		type: defaultConfig.imageType,
	  		quality: defaultConfig.imageQuality,
	  		fullPage: defaultConfig.fullPage
		};
		if (!screenshotConfig.fullPage) {
			screenshotConfig = {...screenshotConfig, clip};
		}
		await page.screenshot(screenshotConfig);

		browser.close();
  	},100);
})();
