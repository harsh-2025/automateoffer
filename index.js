

const express = require('express');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

const app = express();
const port = 4000;

async function example() {
  let chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--headless');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-popup-blocking'); // To avoid any popup issues
  chromeOptions.addArguments('--disable-dev-shm-usage');
  chromeOptions.addArguments('--disable-gpu');
  chromeOptions.addArguments('--remote-debugging-port=9222');
  chromeOptions.addArguments('--verbose');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  try {
    await driver.get('about:blank');
    await driver.executeScript('window.open("https://dashboard.razorpay.com/?screen=sign_in");');
    await driver.sleep(2000);

    let handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[1]);

    let emailInput = await driver.wait(until.elementLocated(By.xpath('//*[@id="Email or Mobile Number"]')), 30000000);
    await emailInput.sendKeys(process.env.email);

    let emailSubmit = await driver.wait(until.elementLocated(By.xpath('//*[@id="react-root"]/div/div/div[3]/div[2]/div[1]/div[1]/form/div/div/div[3]/button')), 3000000);
    await emailSubmit.click();

    let passwordInput = await driver.wait(until.elementLocated(By.xpath('//*[@id="Password"]')), 3000000);
    await passwordInput.sendKeys(process.env.password);

    let submitButton = await driver.wait(until.elementLocated(By.xpath('//*[@id="react-root"]/div/div/div[3]/div[2]/div[1]/div[1]/form/div/div/div[4]/button')), 3000000);
    await submitButton.click();

    let offerLink = await driver.wait(until.elementLocated(By.xpath('//*[@id="react-root"]/div/div[2]/div[1]/div[2]/nav/div/div[6]/a[1]')), 3000000);
    await offerLink.click();

    let ofid = await driver.wait(until.elementsLocated(By.xpath('/html/body/div[1]/div/div[2]/div[1]/main/tabbed-container/content/div/div[2]/div[1]/table/tbody/tr[1]/td[1]/div/div/div/div/a/code')), 3000000);
    let text = await ofid[0].getText();

    return text;

  } finally {
    console.log("Automation complete");
    await driver.quit();
  }
}

app.get('/start-automation', async (req, res) => {
  console.log('Automation started');
  
  try {
    const text = await example();
    console.log('Text obtained:', text);
    res.send(`Automation completed! Text obtained: ${text}`);
  } catch (error) {
    console.error('Error during automation:', error);
    res.status(500).send(`An error occurred during automation: ${error.message}`);
  }
});

app.get('/', (req, res) => {
  res.send('Running the server');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
