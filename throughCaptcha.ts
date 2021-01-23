const puppeteer = require("puppeteer");
const http = require("http");
const request = require("request");
const { resolve } = require("path");
const { rejects } = require("assert");
var fs = require("fs");
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

    const goToSides = async () => {
      
      //let page = await browser.newPage();
      var el : number = 0;
      const oneByOne = async () => {
        let pageUrl = arrayWithInvites[el];
        el++;
        /* await page.goto(pageUrl, {
          waitUntil: "networkidle0", // 'networkidle0' is very useful for SPAs.
        }); */
        await page.goto(pageUrl, {
          waitUntil: "networkidle0",
        });
        console.log("loading... " + pageUrl);
        await page.setDefaultNavigationTimeout(120000);
        
        
  
        const join = async (pager) => {
          let invHref = pager.url();
          invites.push(invHref);
          let jInvites = JSON.stringify(invites, null, 2);
          fs.writeFile("invites.txt", jInvites, (err, file) => {
            if (err) throw err;
          });
          if (el < arrayWithInvites.length - 1) oneByOne();
        };
        
        try{
          await page.waitForNavigation({ waitUntil: 'networkidle0' }),
          await page.waitForSelector("#app-mount > div.app-1q1i1E > div > div.leftSplit-1qOwnR > div", {visible: true})
          join(page);
        }catch(error){
          console.log(error)
          if (el < arrayWithInvites.length - 1) oneByOne();
        }

    };
    oneByOne()
  }
    /* const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: nullS,
    }); */
    /* const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      browserWSEndpoint: wsChromeEndpointurl,
    }); */
    const page = await browser.newPage();

    var arrayWithInvites: Array<string> = [];

    var invites : Array<string>= [];

    fs.readFile("invBeforeCaptchas.txt", (err, data) => {
    if (data.length > 10) arrayWithInvites = JSON.parse(data);
    console.log(arrayWithInvites)
    
    fs.readFile("invites.txt", (err, data) => {
      if (data.length > 10){
        invites = JSON.parse(data);
        goToSides()
      } 
    });
    });
    
    
    
    
  
  
}

