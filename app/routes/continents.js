const express = require('express')
const router = express.Router()
const database = require('../helpers/databaseAccess')
const sqlQueries = require('../helpers/sqlQueryBuilder')

// Continent endpoint.
router.get('/:continentCode', (req, res, next) => {
    const db = database.open()

    // Move to countries endpoint.
    if (req.params.continentCode.length > 2) {
        next()
        return
    }

    // Build sql query string.
    const sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetType(req)} ${sqlQueries.secondaryNotes(req)} FROM globalColors WHERE continentCode = '${req.params.continentCode}' ${sqlQueries.countriesOnContinents(req)};`

    db.all(sql, (err, rows) => {
        if (err) throw err

        let result = {}

        if (rows.length > 0) {
            result = {
                continentName: rows[0].continent,
                continentCode: rows[0].continentCode,
                countries: {}
            }
        }

        rows.forEach(row => {
            result.countries[row.country] = {
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

            if (Object.values(result.countries[row.country].primary).join('') === '') result.countries[row.country].primary = ''
            if (Object.values(result.countries[row.country].secondary).join('') === '') result.countries[row.country].secondary = ''
        })

        Object.keys(result).length === 0
            ? res.json({
                error: 'sorry, nothing matches your query.'
            }) : res.json(result)
    })

    database.close(db)
})

module.exports = router
