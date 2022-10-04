import React, { useState } from "react";
import DbData from "../../backEnd/facebook/marketplaceData.json";
import {
  Card,
  Typography,
  Link,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";

export default function FacebookMarketplace() {
  // const navigate = useNavigate();
  const data = DbData;
  const dataGroups = createGroups(data, getCategories(data));
  const prices = calculateValues(dataGroups);
  const bestPrices = calculateBestPrices(prices, dataGroups);
  const [searchInput, setSearchInput] = useState("");

  function getCategories(data) {
    let results = [];

    // entra item a item e adiciona a um array caso ainda nao exista
    data.forEach((element) => {
      if (!results.some((r) => r === element.category)) {
        results.push(element.category);
      }
    });

    return results;
  }

  function createGroups(data, categories) {
    // verificar para cada item do data qual a categoria, e adicionar
    // à uma chave dentro de um objeto com o mesmo nome.
    let result = {};

    categories.forEach((category) => (result[category] = []));
    data.forEach((item) => {
      for (const key in result) {
        if (item.category === key) {
          result[key].push(item);
        }
      }
    });

    return result;
  }

  function calculateAverage(arr) {
    let sum = 0;
    let average = 0;

    arr.forEach((number) => {
      sum += number;
    });

    average = sum / arr.length;

    return average;
  }

  function calculateValues(groups) {
    let values = {};
    const categories = getCategories(data);

    categories.forEach(
      (category) => (values[category] = { data: [], media: 0 })
    );

    // adiciona os values nos seus respectivos grupos
    for (const key in groups) {
      groups[key].forEach((item) => {
        values[key].data.push(item.price);
      });
    }

    // calcula a media e adiciona em cada grupo
    for (const key in values) {
      values[key].media = calculateAverage(values[key].data);
    }

    return values;
  }

  function calculateBestPrices(prices, dataGrop) {
    let result = {};
    const categories = getCategories(data);
    categories.forEach((cat) => (result[cat] = []));

    for (const key in dataGrop) {
      dataGrop[key].filter((product) => {
        const percentual = 0;
        // const condicao = product.price < (1 - percentual) * prices[key].media;
        const condicao = true;

        if (condicao) {
          result[key].push(product);
          result[key].media = prices[key].media.toFixed(2);
          result[key].title = key;
          result[
            key
          ].link = `https://www.facebook.com/marketplace/105999429431783/search/?query=${key}`;
        }
      });
    }

    return result;
  }

  function handleClick(link) {
    window.open(link, "_blank");
  }
  const [loading, setLoading] = useState();

  async function handleSearch(searchText) {
    // const searchList = [
    //   "iphone",
    //   "iphone 7",
    //   "iphone XS",
    //   "iphone XS 254GB",
    //   "iphone 8 plus 256gb",
    //   "iphone 8 plus 128gb",
    //   "iphone X branco",
    // ];

    setLoading(true);
    const response = await axios
      .post(`http://localhost:3333/facebook/${searchText}`)
      .then((msg) => setLoading(false))
      .catch((err) => setLoading(false));
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          paddingX: 20,
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleSearch(searchInput)}
          color="warning"
          sx={{ paddingX: 10 }}
        >
          {loading ? "Loading..." : "PESQUISAR "}
        </Button>
        <TextField
          fullWidth
          variant="standard"
          sx={{ paddingX: 5, color: "white" }}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        ></TextField>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {Object.values(bestPrices).map((cat) => {
          return (
            <Box
              sx={{
                backgroundColor: "rgb(14, 8, 8, 0.5)",
                margin: 2,
                borderRadius: 5,
                padding: 2,
                maxHeight: 800,
                overflow: "auto",
              }}
            >
              <Table
                sx={{
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none",
                  },
                  width: 900,
                }}
              >
                <TableRow variant="head">
                  <TableCell colSpan={2}>
                    <Typography
                      sx={{ fontWeight: "bold", cursor: "pointer" }}
                      color="error"
                      variant="h5"
                      onClick={() => {
                        window.open(cat.link, "_blank");
                      }}
                    >
                      {cat.title}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography color="success">R${cat.media}</Typography>
                  </TableCell>
                </TableRow>

                {cat.map((item) => (
                  <TableRow variant="head">
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        R$ {item.price}.00
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400 }}>
                      <Typography>{item.title}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400 }}>
                      <img height={100} src={item.imgUrl} />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleClick(item.link)}
                        variant="contained"
                        color="error"
                      >
                        Ver no facebook
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
