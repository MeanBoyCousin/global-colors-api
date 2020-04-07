const express = require('express')
const router = express.Router()
const database = require('../helpers/databaseAccess')
const sqlQueries = require('../helpers/sqlQueryBuilder')

// All endpoint.
router.get('/', (req, res) => {
    const db = database.open()

    // Build sql query string.
    const sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetType(req)} ${sqlQueries.secondaryNotes(req)} FROM globalColors ${sqlQueries.continentsCountries(req)};`

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
                primary: {
                    hex: (row.primaryHEX !== undefined && row.primaryHEX !== '')
                        ? row.primaryHEX.split('/') : undefined,
                    rgb: (row.primaryRGB !== undefined && row.primaryRGB !== '')
                        ? row.primaryRGB.split('/') : undefined,
                    hsl: (row.primaryHSL !== undefined && row.primaryHSL !== '')
                        ? row.primaryHSL.split('/') : undefined
                },
                secondary: {
                    hex: (row.secondaryHEX !== undefined && row.secondaryHEX !== '')
                        ? row.secondaryHEX.split('/') : undefined,
                    rgb: (row.secondaryRGB !== undefined && row.secondaryRGB !== '')
                        ? row.secondaryRGB.split('/') : undefined,
                    hsl: (row.secondaryHSL !== undefined && row.secondaryHSL !== '')
                        ? row.secondaryHSL.split('/') : undefined,
                    notes: row.secondaryNotes
                }
            }

            if (Object.values(result[row.continent].countries[row.country].primary).join('') === '') result[row.continent].countries[row.country].primary = ''
            if (Object.values(result[row.continent].countries[row.country].secondary).join('') === '') result[row.continent].countries[row.country].secondary = ''
        })

        res.json(result)
    })

    database.close(db)
})

module.exports = router
