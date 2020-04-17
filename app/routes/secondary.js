const express = require('express')
const router = express.Router()
const database = require('../helpers/databaseAccess')
const sqlQueries = require('../helpers/sqlQueryBuilder')
const nbw = require('../helpers/nbw')

// Secondary colors endpoint. Only returns countries that actually have a secondary for a smaller response.
router.get('/', (req, res) => {
    const db = database.open(process.env.DB_PATH)

    // Build sql query string.
    const sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetTypeSecondaryOnly(req)}, secondaryNotes FROM globalColors ${sqlQueries.continentsCountries(req)} ${sqlQueries.colorsSecondary(req)};`

    db.all(sql, (err, rows) => {
        if (err) throw err

        const result = {}

        rows.forEach(row => {
            result[row.continent] = {
                continentName: row.continent,
                continentCode: row.continentCode,
                countries: {}
            }
        })

        rows.forEach(row => {
            result[row.continent].countries[row.country] = {
                countryName: row.country,
                countryCode: row.countryCode,
                secondary: {
                    hex: (row.secondaryHEX !== undefined && row.secondaryHEX !== '') ?
                        nbw(req, row.secondaryHEX.split('/'), '#000000', '#ffffff') : undefined,
                    rgb: (row.secondaryRGB !== undefined && row.secondaryRGB !== '') ?
                        nbw(req, row.secondaryRGB.split('/'), 'rgb(0,0,0)', 'rgb(255,255,255)') : undefined,
                    hsl: (row.secondaryHSL !== undefined && row.secondaryHSL !== '') ?
                        nbw(req, row.secondaryHSL.split('/'), 'hsl(0,0%,0%)', 'hsl(0,0%,100%)') : undefined,
                    css: (row.secondaryCSS !== undefined && row.secondaryCSS !== '') ?
                        nbw(req, row.secondaryCSS.split('/'), 'black', 'white') : undefined,
                    notes: row.secondaryNotes
                }
            }

            // If no secondary data, delete the country.
            if (Object.values(result[row.continent].countries[row.country].secondary).join('') === '' || Object.values(result[row.continent].countries[row.country].secondary).slice(0, 4).join('') === '') delete result[row.continent].countries[row.country]
        })

        res.json(result)
    })

    database.close(db)
})

module.exports = router
