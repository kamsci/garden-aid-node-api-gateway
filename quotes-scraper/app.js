const axios = require("axios");
const cheerio = require("cheerio");

const url = "http://quotes.toscrape.com/";

exports.lambdaHandler = async (_event, _context) => {
  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const container = $(".container .quote");
    const quotes = [];

    container.each(function () {
      const text = $(this).find(".text").text();
      const author = $(this).find(".author").text();
      const tags = $(this).find(".tag");

      const tagArray = [];

      tags.each(function () {
        const tagText = $(this).text();
        tagArray.push(tagText);
      });

      quotes.push({
        text,
        author,
        tag: tagArray,
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(quotes),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
