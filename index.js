const express = require('express');
const morgan = require('morgan');
const path = require('path');
const request = require('request')

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

  var url = 'http://api.brewerydb.com/v2/beers?key=' + API_KEY + '&name='+userReq;

  request(url, function(err, resp, body) {
    let data = JSON.parse(body);
    res.send(data);
  })
});

//This is where I want to cycle through the paginited endpoint and build a huge array
//
//http://www.brewerydb.com/developers/docs-endpoint/beer_index#1

app.get('/allbeer', (req, res) => {
  //just query page 1
  let userReq = 1;
  let beers = [];

  var url = 'http://api.brewerydb.com/v2/beers?key=' + API_KEY +"&p="+userReq;

  request(url, function(err, resp, body) {

    let parsedBody = JSON.parse(body);

      for(var j = 0; j < parsedBody.data.length; j++) {
        let element = parsedBody.data[j].name;
        let beer = element.match(/"((?:\\.|[^"\\])*)"/)
        if (beer === null) {
          beers.push(element);
        } else {
        let beerSlice = beer[0].slice(1, beer[0].length-1)
        beers.push(beerSlice);
        }
    }
  res.send(beers);
  })
});

app.listen(3079, function () {
  console.log('Example app listening on port 3079!')
})