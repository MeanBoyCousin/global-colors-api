const sqlite3 = require('sqlite3').verbose()

const openDB = (path) => {
    const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            // console.error(err.message)
            return err
        }
    })
    return db
}

const closeDB = (db) => {
    db.close((err) => {
        if (err) {
            return console.error(err.message)
        }
    })
}

module.exports = {
    open: openDB,
    close: closeDB
}
