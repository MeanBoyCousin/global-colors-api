//Structure data to be sent in response for each endpoint.
const all = (rows) => {

    let result = {}

    rows.forEach(row => {

        result[row.continent] = {
            "continent": row.continent,
            "continent code": row.continentCode
        };
    })

    rows.forEach(row => {

        result[row.continent][row.country] = {
            "country": row.country,
            "country code": row.countryCode,
            "primary": {
                "hex": (row.primaryHEX !== undefined && row.primaryHEX !== '') ?
                    row.primaryHEX.split('/') : undefined,
                "rgb": (row.primaryRGB !== undefined && row.primaryRGB !== '') ?
                    row.primaryRGB.split('/') : undefined,
                "hsl": (row.primaryHSL !== undefined && row.primaryHSL !== '') ?
                    row.primaryHSL.split('/') : undefined
            },
            "secondary": {
                "hex": (row.secondaryHEX !== undefined && row.secondaryHEX !== '') ?
                    row.secondaryHEX.split('/') : undefined,
                "rgb": (row.secondaryRGB !== undefined && row.secondaryRGB !== '') ?
                    row.secondaryRGB.split('/') : undefined,
                "hsl": (row.secondaryHSL !== undefined && row.secondaryHSL !== '') ?
                    row.secondaryHSL.split('/') : undefined,
                "notes": row.secondaryNotes
            }
        }

        if (Object.values(result[row.continent][row.country]['primary']).join('') === '') result[row.continent][row.country]['primary'] = '';
        if (Object.values(result[row.continent][row.country]['secondary']).join('') === '') result[row.continent][row.country]['secondary'] = '';
    })

    return result;
};

const secondary = (rows) => {

    let result = {}

    rows.forEach(row => {

        result[row.continent] = {
            "continent": row.continent,
            "continent code": row.continentCode
        };
    })

    rows.forEach(row => {

        result[row.continent][row.country] = {
            "country": row.country,
            "country code": row.countryCode,
            "secondary": {
                "hex": (row.secondaryHEX !== undefined && row.secondaryHEX !== '') ?
                    row.secondaryHEX.split('/') : undefined,
                "rgb": (row.secondaryRGB !== undefined && row.secondaryRGB !== '') ?
                    row.secondaryRGB.split('/') : undefined,
                "hsl": (row.secondaryHSL !== undefined && row.secondaryHSL !== '') ?
                    row.secondaryHSL.split('/') : undefined,
                "notes": row.secondaryNotes
            }
        }

        if (Object.values(result[row.continent][row.country]['secondary']).join('') === '') delete result[row.continent][row.country];
        if (Object.keys(result[row.continent]).length === 2) delete result[row.continent];
    })

    return result;
};

const continents = (rows) => {

    let result = {
        "continent": rows[0].continent,
        "continent code": rows[0].continentCode
    }

    rows.forEach(row => {

        result[row.country] = {
            "country": row.country,
            "country code": row.countryCode,
            "primary": {
                "hex": (row.primaryHEX !== undefined && row.primaryHEX !== '') ?
                    row.primaryHEX.split('/') : undefined,
                "rgb": (row.primaryRGB !== undefined && row.primaryRGB !== '') ?
                    row.primaryRGB.split('/') : undefined,
                "hsl": (row.primaryHSL !== undefined && row.primaryHSL !== '') ?
                    row.primaryHSL.split('/') : undefined
            },
            "secondary": {
                "hex": (row.secondaryHEX !== undefined && row.secondaryHEX !== '') ?
                    row.secondaryHEX.split('/') : undefined,
                "rgb": (row.secondaryRGB !== undefined && row.secondaryRGB !== '') ?
                    row.secondaryRGB.split('/') : undefined,
                "hsl": (row.secondaryHSL !== undefined && row.secondaryHSL !== '') ?
                    row.secondaryHSL.split('/') : undefined,
                "notes": row.secondaryNotes
            }
        }

        if (Object.values(result[row.country]['primary']).join('') === '') result[row.country]['primary'] = '';
        if (Object.values(result[row.country]['secondary']).join('') === '') result[row.country]['secondary'] = '';
    })

    return result;
};

const countries = (rows) => {

    let result = {}

    rows.forEach(row => {

        result = {
            "country": row.country,
            "country code": row.countryCode,
            "primary": {
                "hex": (row.primaryHEX !== undefined && row.primaryHEX !== '') ?
                    row.primaryHEX.split('/') : undefined,
                "rgb": (row.primaryRGB !== undefined && row.primaryRGB !== '') ?
                    row.primaryRGB.split('/') : undefined,
                "hsl": (row.primaryHSL !== undefined && row.primaryHSL !== '') ?
                    row.primaryHSL.split('/') : undefined
            },
            "secondary": {
                "hex": (row.secondaryHEX !== undefined && row.secondaryHEX !== '') ?
                    row.secondaryHEX.split('/') : undefined,
                "rgb": (row.secondaryRGB !== undefined && row.secondaryRGB !== '') ?
                    row.secondaryRGB.split('/') : undefined,
                "hsl": (row.secondaryHSL !== undefined && row.secondaryHSL !== '') ?
                    row.secondaryHSL.split('/') : undefined,
                "notes": row.secondaryNotes
            }
        }

        if (Object.values(result['primary']).join('') === '') result['primary'] = '';
        if (Object.values(result['secondary']).join('') === '') result['secondary'] = '';
    })

    return result;
};

module.exports = {
    all: all,
    secondary: secondary,
    continents: continents,
    countries: countries
};