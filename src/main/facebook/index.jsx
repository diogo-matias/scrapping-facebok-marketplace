import React, { useState } from "react";
// import { main } from "../../backEnd";
// const puppeteer = require("puppeteer-core");
// import { Puppeteer } from "puppeteer";

export default function FacebookMarketplace() {
  const [inputValue, setInputValue] = useState();

  return (
    <div>
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      ></textarea>
      <br />
      {/* <button onClick={handleClick}>Submit</button> */}
      {/* <button onClick={fetchFacebook}>fetach</button> */}
      <div id="content" style={{ display: "none" }}></div>
    </div>
  );
}
