const puppeteer = require("puppeteer");
const fs = require("fs");
const { facebook } = require("../models");
const marketplaceData = require("./exportData");

const pesquisar = ["iphone 5", "iphone 5 64bg", "iphone 6", "iphone XS"];
// const pesquisar = ["roupa feminina", "saia longa", "relogio", "saia", "vestido", "calça"];
// const pesquisar = ['iphone']

const scrap = async (query) => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto(
    ` https://www.facebook.com/marketplace/105999429431783/search/?query=${query}`
  );
  await page.screenshot({ path: "facebook.png", fullPage: true });

  await Promise.all([
    page.click(".b6ax4al1.lq84ybu9.hf30pyar.om3e55n1.oshhggmv.qm54mken"),
    page.waitForNavigation(),
  ]);
  await page.type("#email", "diogomaccedo200@gmail.com");
  await page.type("#pass", "Felicidade2003_");
  await page.click("[name = 'login']");
  await page.waitForNavigation();
  // await page.click("body");
  await page.on(
    "frameattached",
    async (e) =>
      await page.click(
        ".m7ooc4z9.rlvdr5c9.qneuxs76.teyq7lu2.bc68cdxd.hg0gqms9.plzdoh0l"
      )
  );

  await page.click(
    ".m7ooc4z9.rlvdr5c9.qneuxs76.teyq7lu2.bc68cdxd.hg0gqms9.plzdoh0l"
  );

  const mktData = await page.evaluate(async () => {
    await new Promise((resolve) => {
      let repeat = 0;

      setInterval(() => {
        window.scrollBy(0, window.innerHeight);
        repeat++;

        if (repeat > 50) {
          resolve();
        }
      }, 200);
    });

    let results = [];

    function parseClass(string) {
      let show = "." + string.split(" ").join(".");

      return show;
    }

    const productsClass =
      "qi72231t nu7423ey n3hqoq4p r86q59rh b3qcqh3k fq87ekyn bdao358l fsf7x5fv rse6dlih s5oniofx m8h3af8h l7ghb35v kjdc1dyq kmwttqpk srn514ro oxkhqvkx rl78xhln nch0832m cr00lzj9 rn8ck1ys s3jn8y49 icdlwmnq jxuftiz4 l3ldwz01";
    const imageClass = "ikduhi8d p9wrh9lq lq84ybu9 hf30pyar mfclru0v";
    const spanPriceClass =
      "gvxzyvdx aeinzg81 t7p7dqev gh25dzvf exr7barw b6ax4al1 gem102v4 ncib64c9 mrvwc6qr sx8pxkcf f597kf1v cpcgwwas m2nijcs8 szxhu1pg h3z9dlai sggt6rq5 innypi6y pbevjfx6";

    const minimumPrice = 100;
    const maximumPrice = 20000;

    // toda funcao será executada no browser
    const products = document.querySelectorAll(parseClass(productsClass));

    products.forEach(async (link, index) => {
      if (!products) {
        return console.error("PRODUTOS NÃO ENCONTRADOS");
      }

      const model = {
        title: "",
        price: "",
        imgUrl: "",
        link: "",
        category: "",
      };

      // pegando o link
      const urlParams = new URLSearchParams(window.location.search);
      const ulrQuery = urlParams.get("query");

      const fullLink =
        "https://facebook.com" + products[index].getAttribute("href");

      // pegando o titulo e url da imagem

      const docIMG = products[index].querySelector(parseClass(imageClass));

      if (!docIMG) {
        return console.error("IMAGEM NÃO ENCONTRADA");
      }

      const imgURL = docIMG.src;
      const imgAlt = docIMG.alt;

      // pegando o preço de cada produto

      const priceSpan = products[index].querySelector(
        parseClass(spanPriceClass)
      );

      const priceHTML = priceSpan.innerHTML;
      const price = Number(priceHTML.replace(/[^0-9]/g, ""));

      if (price < minimumPrice) {
        return console.error("PREÇO MTO BAIXO");
      }

      if (price > maximumPrice) {
        return console.error("PREÇO MTO AUTO");
      }

      // adicionando valores na model

      model.link = fullLink;
      model.title = imgAlt;
      model.imgUrl = imgURL;
      model.price = price;
      model.category = ulrQuery;

      results.push(model);
    });

    return results;
  });

  const DBJSON = JSON.parse(fs.readFileSync("./facebook/marketplaceData.json"));

  const filtredJSON = mktData.filter((responseItem) => {
    return !DBJSON.some((e) => e.link === responseItem.link);
  });

  if (filtredJSON.length !== 0) {
    DBJSON.push(...filtredJSON);
  }

  fs.writeFile(
    "./facebook/marketplaceData.json",
    JSON.stringify(DBJSON, null, 2),
    (err) => {
      if (err) throw new Error("Something went wrong");
    }
  );

  return DBJSON;
};

module.exports = scrap;
