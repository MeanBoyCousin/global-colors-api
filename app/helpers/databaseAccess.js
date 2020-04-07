const sqlite3 = require('sqlite3').verbose()

const openDB = () => {
    const db = new sqlite3.Database('./database/globalColors.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            return console.error(err.message)
        }
        console.log('Connected to the database with SQlite3.')
    })
    return db
}

const closeDB = (db) => {
    db.close((err) => {
        if (err) {
            return console.error(err.message)
        }
        console.log('Closed the database connection.')
    })
}

module.exports = {
    open: openDB,
    close: closeDB
}
