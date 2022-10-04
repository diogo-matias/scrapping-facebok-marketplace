const FacebookController = require("./controllers/facebookController");

class Routes {
  facebook(app) {
    app.get("/facebook", new FacebookController().get);
    app.post("/facebook/:search", new FacebookController().post);
  }
}

module.exports = Routes;
