const express = require('express')
const router = express.Router()
const database = require('../helpers/databaseAccess')
const sqlQueries = require('../helpers/sqlQueryBuilder')
const nbw = require('../helpers/nbw')

// All endpoint.
router.get('/', (req, res) => {
    const db = database.open(process.env.DB_PATH)

    // Build sql query string.
    const sql = `SELECT continent, continentCode, country, countryCode, ${sqlQueries.colorSetType(req)}${sqlQueries.secondaryNotes(req)} FROM globalColors ${sqlQueries.continentsCountries(req)} ${sqlQueries.colors(req)};`

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
                        nbw(req, row.secondaryCSS.split('/'), 'black', 'white') : undefined,
                    notes: row.secondaryNotes
                }
            }

            // If no data for a color set, set that set equal to an empty string.
            if (Object.values(result[row.continent].countries[row.country].primary).join('') === '' || Object.values(result[row.continent].countries[row.country].primary).slice(0, 4).join('') === '') result[row.continent].countries[row.country].primary = ''
            if (Object.values(result[row.continent].countries[row.country].secondary).join('') === '' || Object.values(result[row.continent].countries[row.country].secondary).slice(0, 4).join('') === '') result[row.continent].countries[row.country].secondary = ''

            // If colorset query is set, delete the objects for the other color set.
            if (req.query.set === 'primary') delete result[row.continent].countries[row.country].secondary
            if (req.query.set === 'secondary') delete result[row.continent].countries[row.country].primary
        })

        res.json(result)
    })

    database.close(db)
})

module.exports = router
