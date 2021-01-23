const puppeteer = require("puppeteer");
const http = require("http");
const request = require("request");
const { resolve } = require("path");
const { rejects } = require("assert");
var fs = require("fs");
let arrayWithInvites = [];
let wsChromeEndpointurl: String = "aaa";
let url: String = "http://127.0.0.1:9222/json/version";
let req = http.get(url, function (res) {
  let data = "",
    json_data;
  res.on("data", function (stream) {
    data += stream;
  });
  res.on("end", function () {
    json_data = JSON.parse(data);
    console.log(json_data.webSocketDebuggerUrl);
    wsChromeEndpointurl = json_data.webSocketDebuggerUrl;
    app();
  });
})
const app = async () => {
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
      defaultViewport: null,
    });
    /* const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    }); */
    /* const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      browserWSEndpoint: wsChromeEndpointurl,
    }); */
    const page = await browser.newPage();
  
    const SearchForDiscordServers = async () => {
      for (let i = 3; i < 17; i++) {
        /* whichPage == 1 ? (i = 2) : null; */
        let columnIsTablet: Number = Math.floor((i - 1) / 4) + 1;
        let columnCard: Number = ((i - 1) % 4) + 1;
        let stringSelector: String =
          "#bots > div.container.is-fullhd > div.bot-list-section > ul:nth-child(" +
          columnIsTablet +
          ") > li:nth-child(" +
          columnCard +
          ") > div > div.bottom.is-flex.bot-btns > span:nth-child(2)";
        const textWait = await page.$(stringSelector);
        const text = await page.evaluate(
          (element) => element.getAttribute("onclick"),
          textWait
        );
        let rest = String(text).split("'")[1].split("-")[1] + "/join";
        //console.log(rest);
        arrayWithInvites.push("https://top.gg/servers/" + rest);
       
        if (i == 16) {
          let randomize = Math.random() * 5 + 2;
          let jInvites = JSON.stringify(arrayWithInvites, null, 2);
          fs.writeFile("invBeforeCaptchas.txt", jInvites, (err, file) => {
            if (err) throw err;
          });
          setTimeout(() => {
            nextPage();
          }, randomize * 1000);
        }
      }
    };
    let whichPage = 1; /////
    const nextPage = async () => {
      whichPage++;
      if (whichPage < 300) {
        let pageUrl = "https://top.gg/servers/tag/gaming?page=" + whichPage;
        console.log(whichPage);
        await page.goto(pageUrl, {
          waitUntil: "networkidle0", // 'networkidle0' is very useful for SPAs.
        });
        console.log(pageUrl);
        SearchForDiscordServers();
      }
    };
    nextPage()
}

