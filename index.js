import puppeteer from "puppeteer";

async function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
}

async function fillTextInputSlowly(page, name, value) {
  console.log(`🍕 Filling text input [${name}] with [${value}]`);
  const splitted = value.split("");
  for (const char of splitted) {
    await fillTextInput(page, name, char);
    await wait(0.1);
  }
}

async function fillTextInput(page, name, value) {
  const input = await page.waitForSelector(`[name=${name}]`);
  await input.focus();
  await page.keyboard.type(value);
}

async function clickButtonWithText(page, name) {
  console.log(`🍕 Clicking button with text [${name}]`);
  const button = await page.waitForSelector(`text/${name}`);
  await button.evaluate((b) => b.click());
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.foodbooking.com/ordering/restaurant/menu?restaurant_uid=e59e355f-67eb-4c82-adc2-23902568490d"
  );

  await clickButtonWithText(page, "26. Margherita");
  await clickButtonWithText(page, "40cm");
  await clickButtonWithText(page, "Add to cart");

  await wait(2);

  const goToCart = await page.waitForSelector(".svg-icon-cart");
  const goToCartParent = await goToCart.getProperty("parentNode");
  await goToCartParent.evaluate((b) => b.click());

  await clickButtonWithText(page, "Add details");

  await fillTextInputSlowly(page, "firstName", "Thomas");
  await fillTextInputSlowly(page, "lastName", "The tank engine");
  await fillTextInputSlowly(page, "email", "thomas@thetankengine.com");
  await fillTextInputSlowly(page, "phone", "45454454");

  await wait(1);

  await clickButtonWithText(page, "Save");
  await clickButtonWithText(page, "Select payment method");
  await clickButtonWithText(page, "Save");

  console.log("🙋 Are you sure you want to order? (y/N)");

  // const placeOrder = await page.waitForSelector("text/Place Pickup Order Now");
  // await placeOrder.evaluate((b) => b.click());
})();
