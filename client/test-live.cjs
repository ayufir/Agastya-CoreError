const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let hasError = false;

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    hasError = true;
  });

  console.log('Navigating to https://banker-frontend.onrender.com/bank/icici ...');
  await page.goto('https://banker-frontend.onrender.com/bank/icici', { waitUntil: 'networkidle2' }).catch(e => console.log(e));
  
  await new Promise(r => setTimeout(r, 2000));
  
  if (!hasError) {
    console.log('NO ERRORS FOUND on load!');
  }
  
  await browser.close();
})();
