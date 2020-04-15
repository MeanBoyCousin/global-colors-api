const colorSetType = (req) => {
    if (req.query.colorset !== undefined && req.query.colortypes !== undefined) {
        return req.query.colortypes.toUpperCase().split(',').map(type => req.query.colorset + type).join(', ')
    } else if (req.query.colorset !== undefined && req.query.colortypes === undefined) {
        return `${req.query.colorset}HEX, ${req.query.colorset}RGB, ${req.query.colorset}HSL, ${req.query.colorset}CSS`
    } else if (req.query.colorset === undefined && req.query.colortypes !== undefined) {
        return req.query.colortypes.toUpperCase().split(',').map(type => `primary${type}, secondary${type}`).join(', ')
    } else {
        return 'primaryHex, primaryRGB, primaryHSL, primaryCSS, secondaryHEX, secondaryRGB, secondaryHSL, secondaryCSS'
    }
}

const secondaryNotes = (req) => {
    if (req.query.colorset !== 'primary') {
        return ',secondaryNotes'
    } else {
        return ''
    }
}

const continentsAll = (req) => {
    if (req.query.continents !== undefined) return req.query.continents.toUpperCase().split(',').map(code => `continentCode = '${code}'`).join(' OR ')
}

const countriesAll = (req) => {
    if (req.query.countries !== undefined) return req.query.countries.toUpperCase().split(',').map(code => `countryCode = '${code}'`).join(' OR ')
}

const continentsCountriesAll = (req) => {
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

// Query logic for secondary endpoint.
const colorSetTypeSecondaryOnly = (req) => {
    if (req.query.colortypes !== undefined) {
        return req.query.colortypes.toUpperCase().split(',').map(type => `secondary${type}`).join(', ')
    } else {
        return 'secondaryHEX, secondaryRGB, secondaryHSL, secondaryCSS'
    }
}

// Query logic for /continents endpoint.
const countriesOnContinents = (req) => {
    if (req.query.countries !== undefined) {
        return `AND ${req.query.countries.toUpperCase().split(',').map(code => `countryCode = '${code}'`).join(' OR ')}`
    } else {
        return ''
    }
}

module.exports = {
    colorSetType: colorSetType,
    secondaryNotes: secondaryNotes,
    continentsCountries: continentsCountriesAll,
    colorSetTypeSecondaryOnly: colorSetTypeSecondaryOnly,
    countriesOnContinents: countriesOnContinents
}
