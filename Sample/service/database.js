import { MongoClient } from 'mongodb'

class Database {
    constructor (tmo) {
        this.db = null
        this.tmo = tmo
        this.authMechanism = 'DEFAULT'
        this.connect(this.address)
    }

    connect (addr) {
        this.addr = addr
        MongoClient.connect(this.addr, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log(`Error while connceting to database: ${err}`)
                this.retryConnection()
                return
            }
            this.db = client.db(dbName)
            console.log('Connected to the database!')

            this.db.on('close', () => {
                console.log('Database closed!')
                this.retryConnection()
            })
        })
    }

    retryConnection () {
        console.log('Reconnecting....')
        if (this.db) {
            this.db.removeAllListeners('close')
            delete this.db
        }
    }

    insert (data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                const error = new Error('Not connected to database!')
                reject(error)
            }
            const collection = this.db.collection('testtools')
            collection.insertOne(data, (err, result) => {
                if (err) {
                    const error = new Error(`Error when inserting collection ${err}`)
                    reject(error)
                }
                resolve(result)
            })
        })
    }
}

export default new Database(1000)
