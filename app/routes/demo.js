const express = require('express')
const path = require('path')
const router = express.Router()

router.use(express.static(path.join(__dirname, '/../assets')))

router.get('/', (req, res) => {
    res.render('demo.ejs')
})

module.exports = router
