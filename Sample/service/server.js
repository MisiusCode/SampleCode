import express from 'express'
import proxy from 'express-http-proxy'
import path from 'path'
import http from 'http'
import WebSocket from 'ws'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import bodyParser from 'body-parser'
import os from 'os'
import fs from 'fs'
import tar from 'tar-fs'
import gunzip from 'gunzip-file'

export default class Server {
    constructor (port) {
        this.app = express()
        this.server = http.createServer(this.app)
        this.wss = null
        this.port = port
        this.startServer()
    }

    startServer () {
        this.configureCors()
        this.setGorProxy()
        this.setFileUpload()
        this.serveWebapp()
        this.setWebSocket()
        this.setBodyParser()
        this.createFileUploadEndpoints()

        this.server.listen(this.port, '0.0.0.0')
        console.log(`Server started on: ${this.port}`)
    }

    configureCors () {
        const corsOption = {
            origin: '/',
            optionsSuccessStatus: 200
        }
        this.app.use(cors(corsOption))
    }

    serveWebapp () {
        const location = path.resolve(__dirname, '../client/build')
        this.app.use(express.static(location))
        this.app.get('/', (req, res) => {
            res.sendFile(`${location}/index.html`)
        })
    }

    setGorProxy () {
    }

    setFileUpload () {
        this.app.use(fileUpload())
    }

    setBodyParser () {
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
    }

    setWebSocket () {
        this.wss = new WebSocket.Server({ server: this.server })

        this.wss.on('connection', (ws) => {
            console.log(`Got connection from client ${ws._socket.remoteAddress}`)
            ws.on('message', (data) => {
                console.log(`Got data from websocket ${ws._socket.remoteAddress}: ${JSON.stringify(data)}`)
            })
        })
    }

    createEndpoint (endpoint, method, callback) {
        switch (method) {
            case 'GET': {
                this.app.get(endpoint, (req, res) => {
                    callback(req, res)
                })
                break
            }
            case 'POST': {
                this.app.post(endpoint, (req, res) => {
                    callback(req, res)
                })
                break
            }
            default:
        }
    }

    createFileUploadEndpoints () {
        const dir = `${os.tmpdir()}/testtool`
        fs.mkdir(dir, (err) => {
            if (err) {
                console.log(`Failed to create folder for temporary testtool files! ${err}`)
            }
        })
        this.createEndpoint('/files/firmware', 'POST', (req, res) => {
            const firmware = req.files.file
            const fileName = firmware.name
            const extension = path.extname(fileName)
            const fulldir = req.body.fota === 'true' ? `${dir}/${fileName}` : `${dir}/firmware${extension}` // FOTA tests : regular tests
            firmware.mv(fulldir, (err) => {
                if (err) {
                    console.log(`Failed to upload firmware!: ${err}`)
                    return res.status(500).send(err)
                }

                if (extension === '.tar') {
                    const readStream = fs.createReadStream(fulldir)
                    readStream.pipe(tar.extract(`${dir}/firmware/`))

                    readStream.on('error', (err) => {
                        res.status(500).send(`Firmware untar error: ${err}`)
                    })
                    readStream.on('end', () => {
                        fs.unlink(`${dir}.tar`, err => {
                            if (err) {
                                return res.status(500).send(`Error deleting firmware.tar: ${err}`)
                            }
                            res.send('Firmware uploaded!')
                        })
                    })
                } else {
                    res.send('Firmware uploaded!')
                }
            })
        })
        this.createEndpoint('/files/configuration', 'POST', (req, res) => {
            const configuration = req.files.file
            configuration.mv(`${dir}/config.cfg`, (err) => {
                if (err) {
                    console.log(`Failed to upload configuration!: ${err}`)
                    return res.status(500).send(err)
                }
                gunzip(`${dir}/config.cfg`, `${dir}/extConfig.cfg`, () => {
                    res.send('Configuration uploaded!')
                })
            })
        })
        this.createEndpoint('/files/prepare', 'GET', (req, res) => {
            const dir = `${os.tmpdir()}/testtool`
            const writeStream = fs.createWriteStream(`${os.tmpdir()}`)
            tar.pack(dir).pipe(writeStream)

            writeStream.on('error', (err) => {
                res.status(500).send(`Files prepered error: ${err}`)
            })
            writeStream.on('finish', () => {
                res.send('Files being prepared')
            })
        })
    }
    setTestBoardProxy (tb) {
        this.app.use(`/${tb.id}/*`, proxy(`http://${tb.ip}:${tb.port}`, {
            proxyReqPathResolver: (req) => {
                return `/${req.params[0]}${req.url}`
            }
        }))
    }
}
