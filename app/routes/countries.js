const express = require('express')
const router = express.Router()
const database = require('../helpers/databaseAccess')
const sqlQueries = require('../helpers/sqlQueryBuilder')

// Country endpoint.
router.get('/:countryCode', (req, res) => {
    const db = database.open()

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

            if (Object.values(result.primary).join('') === '') result.primary = ''
            if (Object.values(result.secondary).join('') === '') result.secondary = ''
        })

        Object.keys(result).length === 0
            ? res.json({
                error: 'sorry, nothing matches your query.'
            }) : res.json(result)
    })

    database.close(db)
})

module.exports = router
