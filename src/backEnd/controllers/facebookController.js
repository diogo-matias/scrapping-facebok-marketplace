const scrap = require("../facebook");
const { facebook } = require("../models");
const fileData = require("../facebook/marketplaceData.json");

class FacebookController {
  async post(req, res) {
    const { search } = req.params;
    const data = await scrap(search);

    // fileData.forEach(
    //   async (product) => await facebook.create({ ...product, imgUrl: "" })
    // );

    // data.forEach(async () => {
    //   try {
    //     await facebook.create({
    //       title: "teste2",
    //       price: 1500,
    //       link: "https://facebook.com/markeeboo://facebook.com/marketplace/item/563860375513862",
    //       imgUrl:
    //         " ori)https://book.com/markeps://facebook.com/marketplace/item/563860375513862",
    //     });
    //   } catch (error) {
    //     console.log("error");
    //     console.log("error");
    //     console.log("error");
    //     console.log(error);
    //   }
    // });

    res.json(data);
  }

  async get(req, res) {
    const data = await facebook.findAll();
    res.json(data);
  }
}

module.exports = FacebookController;
