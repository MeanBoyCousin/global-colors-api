const nbw = (req, array, black, white) => {
    if (req.query.nbw === '') {
        return array.filter(color => color !== black).filter(color => color !== white)
    } else {
        return array
    }
}

module.exports = nbw
