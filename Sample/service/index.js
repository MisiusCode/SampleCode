import NetworkScanner from './networkScanner'
import TestBoardHandler from './testBoardHandler'
import Server from './server'
import DB from './database'
import commentDB from './commentDatabase'
import tbCounterDatabase from './tbCounterDatabase'
import open from 'open'
import os from 'os'
import { exec } from 'child_process'
const { Client } = require('ssh2')
export default class Service {
    constructor (port) {
        this.port = port
        this.ns = null
        this.tbList = []
        this.latitude = null
        this.longtitude = null
    }
    async init () {
        console.log(`${'-'.repeat(15)} WEBAPP ADVANCED ${'-'.repeat(15)}`)
        this.initNetworkScanner()
        this.initServer()
        this.deleteFiles()
        if (process.platform === 'win32') { // auto open doesn't work properly when packaging application for linux.
            await open(``)
        }
    }

    initNetworkScanner () {
        const networkInterfaces = os.networkInterfaces()
        const operatingSystem = os.type()
        if (operatingSystem === 'Linux') {
            for (const name of Object.keys(networkInterfaces)) {
                for (const net of networkInterfaces[name]) {
                    if (net.family === 'IPv4' && !net.internal) {
                        localIP = net.address.split('.').splice(0, 3).join('.')
                    }
                }
            }
        }
        console.log(`Operating system detected:`, os.type())
        console.log(`Local IP:`, localIP)
        this.ns.on('done', (newTbList) => {
            // Removal of disconnected devices
            this.tbList.forEach((oldTb, tbIdx) => {
                const idx = newTbList.map((tb) => tb.id).indexOf(oldTb.tbInfo.id)
                if (idx === -1) {
                    this.removeTestBoardHandler(tbIdx)
                }
            })

            // Adding new devices
            newTbList.forEach((newTb) => {
                const idx = this.tbList.map((tb) => tb.tbInfo.id).indexOf(newTb.id)
                if (idx === -1) {
                    this.initTestBoardHandler(newTb)
                }
            })
        })

        this.ns.scanNetwork()

        setInterval(() => {
            this.ns.scanNetwork()
        }, 10000)
    }

    initServer () {
        this.getLocation()

        setTimeout(() => {
            this.getLocation()
        }, 2500)

        this.server = new Server(this.port)
        this.server.createEndpoint('/testboards', 'GET', (req, res) => {
            const list = this.tbList.map((tb) => {
                const { tbInfo, tbStatus } = tb
                return { ...tbInfo, status: tbStatus, latitude: this.latitude, longtitude: this.longtitude }
            })
            res.json({ list })
        })
        this.server.createEndpoint('/removefiles', 'GET', (req, res) => {
            this.deleteFiles()
            res.json({ message: 'Files removed' })
        })
        this.server.createEndpoint('/statistic', 'POST', (req, res) => {
            const statistic = JSON.parse(req.body.data)
            const log = req.files.log
            DB.insert({ ...statistic, log })
                .then((onSuccess) => res.json({ message: 'Statistic uploaded to DB', result: onSuccess }))
                .catch((onError) => res.json({ message: 'Failed to upload statistic to DB', result: onError }))
        })

        this.server.createEndpoint('/testboardComments', 'GET', (req, res) => {
            commentDB.get(req.query.id)
                .then((onSuccess) => {
                    // console.log(onSuccess)
                    res.json({ onSuccess })
                })
                .catch((onError) => console.log(onError))
        })

        this.server.createEndpoint('/postCommentToDB', 'POST', (req, res) => {
            commentDB.insert(req.body)
                .then((onSuccess) => res.send('ok'))
                .catch((onError) => console.log(onError))
        })

        this.server.createEndpoint('/getTBCounter', 'GET', (req, res) => {
            tbCounterDatabase.get(req.query.id)
                .then((onSuccess) => {
                    // console.log(onSuccess)
                    // console.log(onSuccess)
                    res.json({ onSuccess })
                })
                .catch((onError) => console.log(onError))
        })

        this.server.createEndpoint('/addCountTB', 'POST', (req, res) => {
            tbCounterDatabase.insert(req.body)
                .then((onSuccess) => res.send('ok'))
                .catch((onError) => console.log(onError))
        })
    }

    initTestBoardHandler (tb) {
        const tbh = new TestBoardHandler(this.server, tb)
        this.tbList.push(tbh)
    }

    removeTestBoardHandler (idx) {
        this.tbList[idx].delete()
        this.tbList.splice(idx, 1)
    }

    deleteConfig () {
        if (process.platform === 'win32') {
            return this.executeCommand(``)
        }
    }

    deleteConfigExt () {
        if (process.platform === 'win32') {
            return this.executeCommand(``)
        }
    }

    deleteFiles () {
        this.deleteDir()
            .then(() => this.deleteConfig())
            .then(() => this.deleteConfigExt())
            .then(() => console.log('Files deleted!'))
            .catch((onError) => console.log(`shit: ${onError}`))
    }

    deleteDir () {

    }

    executeCommand (command, timeout) {
        return new Promise((resolve, reject) => {
            const tmo = timeout || 0
            exec(command, { timeout: tmo }, (err, stdout, stderr) => {
                if (err) {
                    const error = new Error(err)
                    reject(error)
                }
                if (stderr) {
                    const error = new Error(stderr)
                    reject(error)
                }
                resolve(stdout)
            })
        })
    }
}
