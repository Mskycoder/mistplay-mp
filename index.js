const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const FlexSearch = require("flexsearch");

const app = express();
const port = 3000;


// TODO: MySQL DB
let data = JSON.parse(fs.readFileSync('games.json', 'utf8'))

// index creation
var index = new FlexSearch({
    tokenize: "full",
    doc: {
        id: "pid",
        field: "title"
    }
})

index.add(data)

app.get('/search', function (req, res) {
    // Sort by rating / rating count
    sortBy = req.query.order == "rating" ?
        (a, b) => b.rating - a.rating :
        (a, b) => b.rCount - a.rCount

    // index search
    results = index.search(req.query.search, {
        limit: req.query.limit,
        sort: sortBy
    })
    res.send(results)
});

//TODO error handling

app.listen(port, () => console.log(`listening on port ${port}!`));