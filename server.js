const express = require("express")
const app = express()
const items = require("./routes")
const MongoClient = require('mongodb').MongoClient

const cheerio = require('cheerio');
const request = require('request');

let dotenv = require("dotenv")
dotenv.config()


// adding middlewares
app.use(express.static('./public'));
app.use(express.json());

// Home Page Routing

app.get("/", (req, res) => {
    res.status(200).send("hello world")
})

// routing
app.use('/' , items)

function savePrice(price) {
    const collection = db.collection('prices');

    // Replace the item ASIN with the one you want to track
    const query = { asin: 'B08P2H5LW8' };

    collection.updateOne(query, { $set: { price: price } }, { upsert: true }, function(err, result) {
      if (err) {
        console.log('Error saving price:', err);
        return;
      }

      console.log('Price saved:', price);
    });
  }

  // Function to scrape the price from the Amazon page
  function scrapePrice() {
    // Replace the URL with the Amazon item page you want to scrape
    const url = 'https://www.amazon.in/LARQ-Lightweight-Self-Cleaning-Non-Insulated-Stainless/dp/B00CWXPEOA/ref=sr_1_4?crid=1FQ52W7CYAAA6&keywords=larq+water+bottle&qid=1678801719&sprefix=%2Caps%2C350&sr=8-4';

    // Use your preferred web scraping library to extract the price from the HTML of the page
    // For example, using Cheerio:
   
    request(url, function(err, res, body) {
      if (err) {
        console.log('Error scraping price:', err);
        return;
      }

      const $ = cheerio.load(body);
      const priceStr = $('.a-price-whole').text().split(".");
      
      console.log(priceStr[0]);
      
      
      

      savePrice(priceStr);
    });
}

app.listen(5000 ,async()=>{
    const client = new MongoClient(process.env.mongoDB_URI);
        db = client.db()
        await client.connect()
      await  scrapePrice();
        setInterval(scrapePrice, 12 * 60 * 60 * 1000);
        console.log("server started");
    
})




