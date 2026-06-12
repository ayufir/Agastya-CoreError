const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let hasError = false;
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    hasError = true;
  });
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  console.log('Navigating to login page...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });

  console.log('Logging in...');
  await page.type('input[type="email"]', 'admin@gmail.com');
  await page.type('input[type="password"]', '123456');
  await page.click('button[type="submit"]');

  console.log('Waiting for redirection to dashboard...');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  console.log('On dashboard page. Waiting 4 seconds for data to load...');
  await new Promise(resolve => setTimeout(resolve, 4000));

  if (!hasError) {
    console.log('SUCCESS: Dashboard rendered with zero console/page errors!');
  } else {
    console.log('FAILURE: Errors detected on dashboard load.');
  }

  await browser.close();
})();
