const express = require('express')
const router = express.Router()
const database = require('../helpers/databaseAccess')
const sqlQueries = require('../helpers/sqlQueryBuilder')

// Country endpoint.
router.get('/:countryCode', (req, res) => {
    const db = database.open(process.env.DB_PATH)

    // Build sql query string.
    const sql = `SELECT country, countryCode, ${sqlQueries.colorSetType(req)} ${sqlQueries.secondaryNotes(req)} FROM globalColors WHERE countryCode = '${req.params.countryCode}';`

    db.all(sql, (err, rows) => {
        if (err) throw err

        let result = {}

        rows.forEach(row => {
            result = {
                countryName: row.country,
                countryCode: row.countryCode,
                primary: {
                    hex: (row.primaryHEX !== undefined && row.primaryHEX !== '')
                        ? row.primaryHEX.split('/') : undefined,
                    rgb: (row.primaryRGB !== undefined && row.primaryRGB !== '')
                        ? row.primaryRGB.split('/') : undefined,
                    hsl: (row.primaryHSL !== undefined && row.primaryHSL !== '')
                        ? row.primaryHSL.split('/') : undefined,
                    css: (row.primaryCSS !== undefined && row.primaryCSS !== '')
                        ? row.primaryCSS.split('/') : undefined
                },
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

            // If no data for a color set, set that set equal to an empty string.
            if (Object.values(result.primary).join('') === '') result.primary = ''
            if (Object.values(result.secondary).join('') === '') result.secondary = ''

            // If colorset query is set, delete the objects for the other color set.
            if (req.query.colorset === 'primary') delete result.secondary
            if (req.query.colorset === 'secondary') delete result.primary
        })

        Object.keys(result).length === 0
            ? res.json({
                error: 'sorry, nothing matches your query.'
            }) : res.json(result)
    })

    database.close(db)
})

module.exports = router
