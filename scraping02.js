const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const XLSX = require('xlsx');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250
  });

  const page = await browser.newPage();
  const url =  'https://en.wikipedia.org/wiki/All-time_Olympic_Games_medal_table'

  await page.goto(url);

  const html = await page.$eval('div.legend + table', (dom) => {
    return new XMLSerializer().serializeToString(dom);
  });

  const dom = new JSDOM(html);
  const table = dom.window.document.querySelector('table');
  const ws = XLSX.utils.table_to_sheet(table);
  fs.writeFileSync(
    `./tmp/medal_table.csv`,
    XLSX.utils.sheet_to_csv(ws)
  )
  await browser.close()
})()
