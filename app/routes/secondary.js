const express = require('express')
const router = express.Router()
const database = require('../helpers/databaseAccess')
const sqlQueries = require('../helpers/sqlQueryBuilder')

// Secondary colors endpoint. Only returns countries that actually have a secondary for a smaller response.
router.get('/', (req, res) => {
    const db = database.open(process.env.DB_PATH)

    // Build sql query string.
    const sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetTypeSecondaryOnly(req)}, secondaryNotes FROM globalColors ${sqlQueries.continentsCountries(req)};`

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
                    hex: (row.secondaryHEX !== undefined && row.secondaryHEX !== '')
                        ? row.secondaryHEX.split('/') : undefined,
                    rgb: (row.secondaryRGB !== undefined && row.secondaryRGB !== '')
                        ? row.secondaryRGB.split('/') : undefined,
                    hsl: (row.secondaryHSL !== undefined && row.secondaryHSL !== '')
                        ? row.secondaryHSL.split('/') : undefined,
                    css: (row.secondaryCSS !== undefined && row.secondaryCSS !== '')
                        ? row.secondaryCSS.split('/') : undefined,
                    notes: row.secondaryNotes
                }
            }

            // If no secondary data, delete the country.
            if (Object.values(result[row.continent].countries[row.country].secondary).join('') === '') delete result[row.continent].countries[row.country]
        })

        res.json(result)
    })

    database.close(db)
})

module.exports = router
