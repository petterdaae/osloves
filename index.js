import puppeteer from "puppeteer";

async function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
}

async function fillTextInputSlowly(page, name, value) {
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

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(
    "https://www.foodbooking.com/ordering/restaurant/menu?restaurant_uid=e59e355f-67eb-4c82-adc2-23902568490d"
  );

  const margherita = await page.waitForSelector("text/26. Margherita");
  await margherita.click();

  const fourtyCm = await page.waitForSelector("text/40cm");
  await fourtyCm.click();

  const addToCart = await page.waitForSelector("text/Add to cart");
  await addToCart.evaluate((b) => b.click());

  await wait(2);

  const goToCart = await page.waitForSelector(".svg-icon-cart");
  const goToCartParent = await goToCart.getProperty("parentNode");
  await goToCartParent.evaluate((b) => b.click());

  const setTime = await page.waitForSelector("text/Set time");
  await setTime.click();

  await fillTextInputSlowly(page, "firstName", "Thomas");
  await fillTextInputSlowly(page, "lastName", "The tank engine");
  await fillTextInputSlowly(page, "email", "thomas@thetankengine.com");
  await fillTextInputSlowly(page, "phone", "45454454");

  await wait(1);

  let save = await page.waitForSelector("text/Save");
  await save.evaluate((b) => b.click());

  const selectPaymentMethod = await page.waitForSelector(
    "text/Select payment method"
  );

  await selectPaymentMethod.evaluate((b) => b.click());

  save = await page.waitForSelector("text/Save");
  await save.evaluate((b) => b.click());

  console.log("Are you sure you want to order? (y/N");

  // const placeOrder = await page.waitForSelector("text/Place Pickup Order Now");
  // await placeOrder.evaluate((b) => b.click());
})();
