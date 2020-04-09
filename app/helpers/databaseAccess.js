const sqlite3 = require('sqlite3').verbose()

const openDB = (path) => {
    const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            return console.error(err.message)
        }
    })
    console.log('Opened sqlite database.')
    return db
}

const closeDB = (db) => {
    db.close((err) => {
        if (err) {
            return console.error(err.message)
        }
    })
    console.log('Closed sqlite database.')
}

module.exports = {
    open: openDB,
    close: closeDB
}