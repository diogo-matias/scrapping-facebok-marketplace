const puppeteer = require("puppeteer");
const fs = require("fs");

const pesquisar = ["iphone 5", "iphone 5 64bg", "iphone 6", "iphone 7"];

const main = async (query) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    ` https://www.facebook.com/marketplace/105999429431783/search/?query=${query}`
  );
  await page.screenshot({ path: "facebook.png" });

  const marketplaceData = await page.evaluate(() => {
    let results = [];

    function parseClass(string) {
      let show = "." + string.split(" ").join(".");

      return show;
    }

    const productsClass =
      "qi72231t nu7423ey n3hqoq4p r86q59rh b3qcqh3k fq87ekyn bdao358l fsf7x5fv rse6dlih s5oniofx m8h3af8h l7ghb35v kjdc1dyq kmwttqpk srn514ro oxkhqvkx rl78xhln nch0832m cr00lzj9 rn8ck1ys s3jn8y49 icdlwmnq jxuftiz4 l3ldwz01";
    const imageClass = "ikduhi8d p9wrh9lq lq84ybu9 hf30pyar mfclru0v";
    const spanPriceClass =
      "gvxzyvdx aeinzg81 t7p7dqev gh25dzvf exr7barw b6ax4al1 gem102v4 ncib64c9 mrvwc6qr sx8pxkcf f597kf1v cpcgwwas m2nijcs8 szxhu1pg hpj0pwwo sggt6rq5 innypi6y pbevjfx6";
    const minimumPrice = 100;

    // toda funcao será executada no browser
    const products = document.querySelectorAll(parseClass(productsClass));

    products.forEach((link, index) => {
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

      // adicionando valores na model

      model.link = fullLink;
      model.title = imgAlt;
      model.imgUrl = imgURL;
      model.price = price;

      results.push(model);
    });

    return results;
  });

  let DBJSON = JSON.parse(fs.readFileSync("marketplaceData.json") ?? []);

  const filtredJSON = marketplaceData.filter((responseItem) => {
    return !DBJSON.some((e) => e.link === responseItem.link);
  });

  if (filtredJSON.length !== 0) {
    DBJSON.push(...filtredJSON);
  }

  fs.writeFile(
    "marketplaceData.json",
    JSON.stringify(DBJSON, null, 2),
    (err) => {
      if (err) throw new Error("Something went wrong");
    }
  );

  await browser.close();
};

pesquisar.forEach((item) => main(item));
