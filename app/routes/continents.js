const express = require('express')
const router = express.Router()
const database = require('../helpers/databaseAccess')
const sqlQueries = require('../helpers/sqlQueryBuilder')
const nbw = require('../helpers/nbw')

// Continent endpoint.
router.get('/:continentCode', (req, res, next) => {
    const db = database.open(process.env.DB_PATH)

    // Move to countries endpoint.
    if (req.params.continentCode.length > 2) {
        next()
        return
    }

    // Build sql query string.
    const sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetType(req)} ${sqlQueries.secondaryNotes(req)} FROM globalColors WHERE continentCode = '${req.params.continentCode}' ${sqlQueries.countriesOnContinents(req)} ${sqlQueries.colors(req)};`

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
                    hex: (row.primaryHEX !== undefined && row.primaryHEX !== '') ?
                        nbw(req, row.primaryHEX.split('/'), '#000000', '#ffffff') : undefined,
                    rgb: (row.primaryRGB !== undefined && row.primaryRGB !== '') ?
                        nbw(req, row.primaryRGB.split('/'), 'rgb(0,0,0)', 'rgb(255,255,255)') : undefined,
                    hsl: (row.primaryHSL !== undefined && row.primaryHSL !== '') ?
                        nbw(req, row.primaryHSL.split('/'), 'hsl(0,0%,0%)', 'hsl(0,0%,100%)') : undefined,
                    css: (row.primaryCSS !== undefined && row.primaryCSS !== '') ?
                        nbw(req, row.primaryCSS.split('/'), 'black', 'white') : undefined
                },
                secondary: {
                    hex: (row.secondaryHEX !== undefined && row.secondaryHEX !== '') ?
                        nbw(req, row.secondaryHEX.split('/'), '#000000', '#ffffff') : undefined,
                    rgb: (row.secondaryRGB !== undefined && row.secondaryRGB !== '') ?
                        nbw(req, row.secondaryRGB.split('/'), 'rgb(0,0,0)', 'rgb(255,255,255)') : undefined,
                    hsl: (row.secondaryHSL !== undefined && row.secondaryHSL !== '') ?
                        nbw(req, row.secondaryHSL.split('/'), 'hsl(0,0%,0%)', 'hsl(0,0%,100%)') : undefined,
                    css: (row.secondaryCSS !== undefined && row.secondaryCSS !== '') ?
                        nbw(req, row.secondaryCSS.split('/'), 'black', 'white') : undefined
                }
            }

            // If no data for a color set, set that set equal to an empty string.
            if (Object.values(result.countries[row.country].primary).join('') === '') result.countries[row.country].primary = ''
            if (Object.values(result.countries[row.country].secondary).join('') === '') result.countries[row.country].secondary = ''

            // If colorset query is set, delete the objects for the other color set.
            if (req.query.set === 'primary') delete result.countries[row.country].secondary
            if (req.query.set === 'secondary') delete result.countries[row.country].primary
        })

        Object.keys(result).length === 0 ?
            res.json({
                error: 'sorry, nothing matches your query.'
            }) : res.json(result)
    })

    database.close(db)
})

module.exports = router
