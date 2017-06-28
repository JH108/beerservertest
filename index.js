const express = require('express');
const morgan = require('morgan');
const path = require('path');
const request = require('request')
// I replaced the use of request with fetch because fetch returns a promise
const fetch = require('./fetch-fill')

const app = express();
const API_KEY = "138f1ab3930fca15582cd297958c244a";


app.get('/', function (req, res) {
  res.send('Hello World!')
})

//this hits the endpoint for a particular beer
//works well but if you don't type in the beer
//perfectly it won't query correctly
//
//http://www.brewerydb.com/developers/docs-endpoint/beer_index#1

app.get('/beername', (req, res) => {
  //this queries by beer name
  let userReq = 'Naughty 90';
  let url = 'http://api.brewerydb.com/v2/beers?key=' + API_KEY + '&name='+userReq;
  // I wanted to see what the page after their last record returned
  // let page = 1296;
  // let url = 'http://api.brewerydb.com/v2/beers?key=' + API_KEY + '&p='+page;


  fetch(url)
    .then(res => res.json())
    .then(body => res.send(body))
});

//This is where I want to cycle through the paginited endpoint and build a huge array
//
//http://www.brewerydb.com/developers/docs-endpoint/beer_index#1

app.get('/allbeer', (req, res) => {
  //just query page 1
  let userReq = 1;
  let allBeers = {};
  // right now it is only pulling back the first three pages
  const getAllBeers = function(page) {
    let pageNum = page || 1;
    let beers = [];
    let url = 'http://api.brewerydb.com/v2/beers?key=' + API_KEY +"&p="+pageNum;
    fetch(url)
      .then(res => res.json())
      .then(body => {
        if (!body.data) {
          return beers;
        }
        for(let j = 0; j < body.data.length; j++) {
          let element = body.data[j].name;
          let beer = element.match(/"((?:\\.|[^"\\])*)"/)
          if (beer === null) {
            beers.push(element);
          } else {
          let beerSlice = beer[0].slice(1, beer[0].length-1)
          beers.push(beerSlice);
          }
        }
        // console.log('beers before trying to add them to all beers', beers);
      return beers;
    }).then(beers => {
      if (!beers.length) {
        // this is the base case and will stop once the 1296th page is reached
        // console.log('beers length is ', pageNum);
        res.send(allBeers);
        return;
        // remove the else if, if you want to run it for all 1295 pages
      } else if (pageNum > 3) {
        res.send(allBeers);
        return;
      } else {
        // console.log('found beers', pageNum);
        // console.log('all the beers', allBeers);
        allBeers[pageNum] = beers;
        getAllBeers(pageNum + 1);
      }
    });
  };
  getAllBeers(1);
  // res.send(allBeers);
});

app.listen(3079, function () {
  console.log('Example app listening on port 3079!')
})