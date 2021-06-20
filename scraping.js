const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const XLSX = require('xlsx');
const fs = require('fs');
const { builtinModules } = require('module');

const OUTPUT_PATH = "output";
let BROWSER;

const VIEWPORT = {
  width : 1280,
  height: 1024
};

const url = "https://lt.flymaster.net/bs.php?grp=1842";
const xpath = {};
const selector = {
  flymaster: {
    header: "#liHome > a",
    findPilots: "#liShowActivity > a",
    pilotTable: "#pilotonMapTable > tbody > tr > td.sorting_1 > a",
    speed: "#pilotonMapTable > tbody > tr"

  }
};

// const url = "https://www.google.com";
// const xpath = {};
// const selector = {
//   google: {
//     header: "body > div.L3eUgb > div.o3j99.n1xJcf.Ne6nSd > a:nth-child(2)"
//   }
// };

(async() => {
  const options = {
    headless: false,
    slowMo:100
  };
  BROWSER = await puppeteer.launch(options);
  let page = await BROWSER.newPage();

  await page.setViewport({
    width : VIEWPORT.width,
    height: VIEWPORT.height
  })

  await page.goto(url, {waitUntil: "networkidle0"});
  // await page.goto(url, {waitUntil: "domcontentloaded"});

  await page.screenshot({path: 'example.png'});
  // const btm = await page.$(selector.flymaster.findPilots)
  // await btm.click()
  // await page.click(selector.flymaster.findPilots);
  // const rows = await page.$$(selector.flymaster.pilotTable)
  // console.log(rows)

  // await getTableBySelector(page, selector.flymaster.pilotTable)
  await Promise.all([
    page.waitForNavigation(),
    page.click("#pilotonMapTable > tbody > tr.odd.shown > td.sorting_1 > a")    
  ])
  await getTableBySelector(page, selector.flymaster.speed)

  // const text = await getTextBySelector(page, (selector.flymaster.findPilots));
  // console.log(text);

  BROWSER.close();
})();

async function getTextBySelector(page, paramSelector) {
  const element = await page.$(paramSelector) 
  let text = ""
  if(element) {
    text = await (await element.getProperty('textContent')).jsonValue()
    text = text.replace(/[\s　]/g, "")
  }
  return text
};

async function getTextByXPath(page, xpath) {
  const elements = await page.$x(xpath) 
  let text = ""
  if(elements[0]) {
    text = await (await elements[0].getProperty('textContent')).jsonValue()
    text = text.replace(/[\s　]/g, "")
  }
  return text
};

async function getTableBySelector(page, paramSelector) {
  // const html = await page.$eval(paramSelector, (dom) => {
  //   return new XMLSerializer().serializeToString(dom);
  // });

  // const dom = new JSDOM(html);
  // const table = dom.window.document.querySelector('table');
  // const ws = XLSX.utils.table_to_sheet(table);
  // fs.writeFileSync(
  //   `./tmp/medal_table.csv`,
  //   XLSX.utils.sheet_to_csv(ws)
  // )
  const list = await page.$$(paramSelector);
  var datas = [];
  for (let i = 0; i < list.length; i++) {
    datas.push(await (await list[i].getProperty('textContent')).jsonValue())
  }
  console.log(datas)
  return datas
}

