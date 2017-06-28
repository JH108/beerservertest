// simple polyfill for fetch
const FetchConstructor = require("fetch-ponyfill");
const fetchFill = FetchConstructor({ Promise: Promise });
module.exports = fetchFill.fetch;