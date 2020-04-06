const express = require('express');
//Modules
const database = require('./databaseAccess.js');
const sqlQueries = require('./sqlQueryBuilder');
const dataStructurers = require('./endpointDataStructurers');
//Middleware
const timeout = require('connect-timeout');
const pretty = require('express-prettify');
const cors = require('cors');

//Setup express app.
const app = express();
app.use(timeout('5s'));
app.use(pretty({
    query: 'prettify'
}));
app.use(cors({
    methods: "GET"
}));

//All endpoint.
app.get('/api/v1/all', (req, res) => {

    let db = database.open();

    //Build sql query string.
    let sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetType(req)} ${sqlQueries.secondaryNotes(req)} FROM globalColors ${sqlQueries.continentsCountries(req)};`;

    db.all(sql, (err, rows) => {
        if (err) throw err;

        let result = dataStructurers.all(rows);

        res.json(result);
    });

    database.close(db);
});

//Secondary colors endpoint. Only returns countries that actually have a secondary. Smaller response.
app.get('/api/v1/secondary', (req, res) => {

    let db = database.open();

    //Build sql query string.
    let sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetTypeSecondaryOnly(req)} ${sqlQueries.secondaryNotes(req)} FROM globalColors ${sqlQueries.continentsCountries(req)};`;

    db.all(sql, (err, rows) => {
        if (err) throw err;

        let result = dataStructurers.secondary(rows);

        res.json(result);
    });

    database.close(db);
});

//Continent endpoint.
app.get('/api/v1/:continentCode', (req, res, next) => {

    let db = database.open();

    //Build sql query string.
    let sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetType(req)} ${sqlQueries.secondaryNotes(req)} FROM globalColors WHERE continentCode = '${req.params.continentCode}' ${sqlQueries.countriesOnContinents(req)};`;

    db.all(sql, (err, rows) => {
        if (err) throw err;

        //Skip to country endpoint if code doesn't match a continent.
        if (rows.length === 0) {
            next();
            return;
        };

        let result = dataStructurers.continents(rows);

        res.json(result);
    });

    database.close(db);
});

//Country endpoint.
app.get('/api/v1/:countryCode', (req, res) => {

    let db = database.open();

    //Build sql query string.
    let sql = `SELECT country, countryCode, ${sqlQueries.colorSetType(req)} ${sqlQueries.secondaryNotes(req)} FROM globalColors WHERE countryCode = '${req.params.countryCode}';`;

    db.all(sql, (err, rows) => {
        if (err) throw err;

        let result = dataStructurers.countries(rows);

        Object.keys(result).length === 0 ?
            res.json({
                "error": "data not found"
            }) : res.json(result);
    });

    database.close(db);
});

app.listen(3000);
console.log('Listening on port 3000!');