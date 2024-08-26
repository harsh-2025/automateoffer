const express = require('express');
const { Builder, By,until } = require('selenium-webdriver');
const fs = require('fs');
const app = express();
const port = 4000;
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

// Load the config file

async function example() {
  // const config = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  // let driver = await new Builder().forBrowser('chrome').build();
  const config = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  let chromeOptions = new chrome.Options();
  // chromeOptions.addArguments("--headless");
  chromeOptions.addArguments('--disable-popup-blocking'); // To avoid any popup issues

      let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
  try {
    await driver.get('about:blank');
    // Open a new tab with the Razorpay dashboard URL
    await driver.executeScript('window.open("https://dashboard.razorpay.com/?screen=sign_in");');
    // Wait for a short moment to ensure the new tab opens
    await driver.sleep(2000);
    // Switch to the new tab
    let handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[1]);

    let emailinput = await driver.wait(until.elementLocated(By.xpath('//*[@id="Email or Mobile Number"]')),30000000);
    await emailinput.sendKeys(process.env.email);

    // Use XPath to find and click the submit button
    let emailsubmit = await driver.wait(until.elementLocated(By.xpath('//*[@id="react-root"]/div/div/div[3]/div[2]/div[1]/div[1]/form/div/div/div[3]/button')),30000000);
    await emailsubmit.click();

    // Use XPath to find the password input element
    let passwordinput = await driver.wait(until.elementLocated(By.xpath('//*[@id="Password"]')),30000000);
      await passwordinput.sendKeys(process.env.password);
      let submitbuttom = await driver.wait(until.elementLocated(By.xpath('//*[@id="react-root"]/div/div/div[3]/div[2]/div[1]/div[1]/form/div/div/div[4]/button')),30000000);
      await submitbuttom.click();
    //login and password end
      console.log(passwordinput);
      console.log(submitbuttom);
    // await driver.setTimeout(() => {
      
    // }, 2000);
    let offerlink = await driver.wait(until.elementLocated(By.xpath('//*[@id="react-root"]/div/div[2]/div[1]/div[2]/nav/div/div[6]/a[1]')), 30000000);

    //going to offer page
    // let offerlink = await driver.wait(until.elementLocated(By.xpath('//*[@id="react-root"]/div/div[2]/div[1]/div[2]/nav/div/div[6]/a[1]')),30000000);
      await offerlink.click();
      console.log(offerlink);
      let ofid=await driver.wait(until.elementsLocated(By.xpath('/html/body/div[1]/div/div[2]/div[1]/main/tabbed-container/content/div/div[2]/div[1]/table/tbody/tr[1]/td[1]/div/div/div/div/a/code')),30000000)
      // await driver.setTimeout(() => {
      let text = await ofid[0].getText();
      console.log(text);
 
  } finally {
    
    console.log("automation complete");
    await driver.quit();

  }
};

app.get('/start-automation', async (req, res) => {
  console.log('started')
  await example();
  console.log('res end')
  res.send('Automation started!');
});
app.get('/', async (req, res) => {
  res.send('running the server')
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

