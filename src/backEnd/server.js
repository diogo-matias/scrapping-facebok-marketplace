const express = require("express");
const Routes = require("./routes");
const db = require("./models");
const { sequelize } = require("./models");

const app = express();
const routes = new Routes();
app.use(express.json());
app.use(express.urlencoded());

routes.facebook(app);
// sequelize
//   .sync()
//   .then(() => console.log("SEQUELIZE CONECTADO"))
//   .catch((err) => console.log(err));

app.listen(3333, () => console.log("SERVIDOR RODANDO"));
