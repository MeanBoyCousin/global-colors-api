const gc = require('color-groups')

const colorSetType = req => {
    if (req.query.set !== undefined && req.query.types !== undefined) {
        return req.query.types.toUpperCase().split(',').map(type => req.query.set + type).join(', ')
    } else if (req.query.set !== undefined && req.query.types === undefined) {
        return `${req.query.set}HEX, ${req.query.set}RGB, ${req.query.set}HSL, ${req.query.set}CSS`
    } else if (req.query.set === undefined && req.query.types !== undefined) {
        return req.query.types.toUpperCase().split(',').map(type => `primary${type}, secondary${type}`).join(', ')
    } else {
        return 'primaryHex, primaryRGB, primaryHSL, primaryCSS, secondaryHEX, secondaryRGB, secondaryHSL, secondaryCSS'
    }
}

const secondaryNotes = req => {
    if (req.query.set !== 'primary') {
        return ',secondaryNotes'
    } else {
        return ''
    }
}

const continentsAll = req => {
    if (req.query.continents !== undefined) return req.query.continents.toUpperCase().split(',').map(code => `continentCode = '${code}'`).join(' OR ')
}

const countriesAll = req => {
    if (req.query.countries !== undefined) return req.query.countries.toUpperCase().split(',').map(code => `countryCode = '${code}'`).join(' OR ')
}

const continentsCountriesAll = req => {
    if (continentsAll(req) === undefined && countriesAll(req) !== undefined) {
        return `WHERE ${countriesAll(req)}`
    } else if (continentsAll(req) !== undefined && countriesAll(req) === undefined) {
        return `WHERE ${continentsAll(req)}`
    } else if (continentsAll(req) !== undefined && countriesAll(req) !== undefined) {
        return `WHERE ${countriesAll(req)} OR ${continentsAll(req)}`
    } else {
        return ''
    }
}

const colors = req => {
    if (req.query.colors !== undefined) {
        const colorList = req.query.colors.toLowerCase().split(',').flatMap(color => gc.get[color])
        const and = () => {
            if (req.query.continents !== undefined || req.query.countries !== undefined || req.params.continentCode !== undefined) {
                return 'AND '
            } else {
                return 'WHERE '
            }
        }
        if (req.query.set === undefined) {
            const stmtLineOne = `primaryCSS LIKE '%${colorList[0]}%' OR secondaryCSS LIKE '%${colorList[0]}%'`
            colorList.shift()
            const stmtRest = colorList.map(color => ` OR primaryCSS LIKE '%${color}%' OR secondaryCSS LIKE '%${color}%'`).join('')
            return `${and()}(${stmtLineOne}${stmtRest})`
        } else if (req.query.set === 'primary') {
            const stmtLineOne = `primaryCSS LIKE '%${colorList[0]}%'`
            colorList.shift()
            const stmtRest = colorList.map(color => ` OR primaryCSS LIKE '%${color}%'`).join('')
            return `${and()}(${stmtLineOne}${stmtRest})`
        } else if (req.query.set === 'secondary') {
            const stmtLineOne = `secondaryCSS LIKE '%${colorList[0]}%'`
            colorList.shift()
            const stmtRest = colorList.map(color => ` OR secondaryCSS LIKE '%${color}%'`).join('')
            return `${and()}(${stmtLineOne}${stmtRest})`
        } else {

        }
    } else {
        return ''
    }
}

// Query logic for secondary endpoint.
const colorSetTypeSecondaryOnly = req => {
    if (req.query.types !== undefined) {
        return req.query.types.toUpperCase().split(',').map(type => `secondary${type}`).join(', ')
    } else {
        return 'secondaryHEX, secondaryRGB, secondaryHSL, secondaryCSS'
    }
}

const colorsSecondary = req => {
    if (req.query.colors !== undefined) {
        const colorList = req.query.colors.toLowerCase().split(',').flatMap(color => gc.get[color])
        const and = () => {
            if (req.query.continents !== undefined || req.query.countries !== undefined) {
                return 'AND '
            } else {
                return 'WHERE '
            }
        }
        const stmtLineOne = `secondaryCSS LIKE '%${colorList[0]}%'`
        colorList.shift()
        const stmtRest = colorList.map(color => ` OR secondaryCSS LIKE '%${color}%'`).join('')
        return `${and()}(${stmtLineOne}${stmtRest})`
    } else {
        return ''
    }
}

// Query logic for /continents endpoint.
const countriesOnContinents = req => {
    if (req.query.countries !== undefined) {
        return `AND (${req.query.countries.toUpperCase().split(',').map(code => `countryCode = '${code}'`).join(' OR ')})`
    } else {
        return ''
    }
}

module.exports = {
    colorSetType: colorSetType,
    secondaryNotes: secondaryNotes,
    colors: colors,
    continentsCountries: continentsCountriesAll,
    colorSetTypeSecondaryOnly: colorSetTypeSecondaryOnly,
    colorsSecondary: colorsSecondary,
    countriesOnContinents: countriesOnContinents
}
