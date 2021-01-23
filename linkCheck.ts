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
    const page = await browser.newPage();
    var a = 0;
    const Sites = async()=>{
        let pageUrl = invites[a]
        await page.goto(pageUrl, {
            waitUntil: "networkidle0",
        });
        
        const textOnButton = await page.$eval("#app-mount > div.app-1q1i1E > div > div.leftSplit-1qOwnR > div > section > div > button > div", (el)=>el.textContent)
        if(textOnButton=="Zaakceptuj zaproszenie"){
            arrayWithInvites.push(pageUrl);
            console.log(arrayWithInvites);
            let jInvites = JSON.stringify(arrayWithInvites, null, 2);
            fs.writeFile("invitesAfterCheck.txt", jInvites, (err, file) => {
              if (err) throw err;
            });
        }

        

        a++
        if(a<invites.length-1) Sites()
    } 
    var arrayWithInvites: Array<string> = [];

    var invites : Array<string>= [];
    
    fs.readFile("invites.txt", (err, data) => {
      if (data.length > 10){
        invites = JSON.parse(data);
        Sites()
      } 
    });
    
    
    
    
  
  
}

