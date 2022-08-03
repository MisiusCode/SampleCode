import React from 'react'
import { Header } from 'semantic-ui-react'
import { version } from '../../../package.json'

// import { doc, setDoc } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import app from '../Firebase/firebase';
//import db from '../Firebase/firebase';
class TestBoardInfo extends React.Component {

    constructor() {
        super()
        this.recTimer = null
        this.state = {
            webAppColor: '',
            testboardColor: 'red',
        }
    }

    timezoneChange(input) { //Datos keitimo funkcija
        let startTime = new Date(input);
        startTime = new Date(startTime.getTime() - (startTime.getTimezoneOffset() * 60000));
        return startTime.toISOString()
    }

    async addRecCustomID() {
        const { info, options, gor } = this.props
        getDatabase(app)
        const lastActive = new Date(Date.now()).toISOString()
        const timezoneFix = this.timezoneChange(lastActive)
        const db = getDatabase()

        set(ref(db, "Testboards/" + info.id), {
            at: timezoneFix.slice(0, -5).replace('T', ' '),
            tbID: info.id,
            hw: options.hardware,
            tbVer: info.tbVersion,
            on: typeof this.props.info.status.state !== 'undefined' ? this.props.info.status.state : 'off',
            gor: gor,
            pCode: options.productCode,
            wVer: version,
            loc: this.checkLocation(info.latitude, info.longtitude)
        })
            .catch((err) => {
                console.log(err)
            })

    }

    checkLocation(lat, long) {
        if (typeof lat !== 'number' || typeof long !== 'number') {
            return "NO"
        }

        switch (true) {
            case ((lat >= 54.64572) && (lat <= 54.64858) && (long >= 25.30270) && (long <= 25.30977)):
                return "L"

            case ((lat >= 54.66577) && (lat <= 54.66925) && (long >= 25.25258) && (long <= 25.25880)):
                return "N"

            default:
                return "OFF"
        }
    }

    checkIfExist(obj) {
        if (typeof obj === 'undefined' || Object.keys(obj).length === 0) {
            return false
        }
        return true
    }

    secToMin(sec) {
        const minutes = parseInt(sec / 60)
        const seconds = parseInt(sec - (minutes * 60))
        const minutesZero = (minutes < 10) ? '0' : ''
        const secondsZero = (seconds < 10) ? '0' : ''

        return `${minutesZero}${minutes}:${secondsZero}${seconds}`
    }

    renderTime() {
        if (!this.checkIfExist(this.props.info.status.progress)) {
            return this.secToMin(0)
        }
        return this.secToMin(this.props.info.status.progress.time)
    }

    getHeaderSize(screenSize) {
        switch (screenSize) {
            case 'large': {
                return 'h2'
            }
            case 'medium': {
                return 'h3'
            }
            default: {
                return 'h3'
            }
        }
    }

    componentDidMount() {
        this.currentWebAppVersion()
        this.currentTestRunnerVersion()
        this.addRecCustomID()
        this.recTimer = setInterval(() => {
            this.addRecCustomID()
        }, 2500)

    }

    componentWillUnmount() {
        clearInterval(this.recTimer)
    }

    currentWebAppVersion() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer -yCVZyYSEX2KBsdu-2ts");
        myHeaders.append("Cookie", "_gitlab_session=ee44480844e6dbbdee3f2f645402308b");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return new Promise((resolve, reject) => {
            fetch("", requestOptions)
                .then(response => response.json())
                .then(result => {

                    if (result[0].name !== version) {
                        this.setState({ webAppColor: "red" })
                    }
                    else {
                        this.setState({ webAppColor: "green" })
                    }
                })
                .catch(error => console.log('Web-app version error', error));
        })
    }


    currentTestRunnerVersion() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer -yCVZyYSEX2KBsdu-2ts");
        myHeaders.append("Cookie", "_gitlab_session=ee44480844e6dbbdee3f2f645402308b");
        const { info, options } = this.props
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return new Promise((resolve, reject) => {
            fetch("", requestOptions)
                .then(response => response.json())
                .then(result => {

                    let nameArr = []

                    result.forEach(element => {
                        nameArr.push(element.name)
                    });

                    const currentIndex = info.tbVersion.indexOf(".")
                    const currentVersion = info.tbVersion.substr(currentIndex + 1);

                    switch (options.hardwareCode.slice(0, 3)) {
                        case 'TAT':
                            let latestTAT = nameArr.find(hw => hw.slice(0, 3) === 'TAT')
                            if (typeof latestTAT !== 'undefined') {

                                const latestIndex = latestTAT.indexOf('.')
                                const gitVersion = latestTAT.substr(latestIndex + 1);

                                if (gitVersion !== currentVersion) {
                                    this.setState({ testboardColor: "red" })
                                }
                                else {
                                    this.setState({ testboardColor: "green" })
                                }
                            }
                            break;

                        case 'TFT':
                            let latestTFT = nameArr.find(hw => hw.slice(0, 3) === 'TFT')
                            if (typeof latestTFT !== 'undefined') {

                                const latestIndex = latestTFT.indexOf('.')
                                const gitVersion = latestTFT.substr(latestIndex + 1);

                                if (gitVersion !== currentVersion) {
                                    this.setState({ testboardColor: "red" })
                                }
                                else {
                                    this.setState({ testboardColor: "green" })
                                }
                            }
                            break;

                        case 'MOD':
                            let latestMOD = nameArr.find(hw => hw.slice(0, 3) === 'MOD')
                            if (typeof latestMOD !== 'undefined') {

                                const latestIndex = latestMOD.indexOf('.')
                                const gitVersion = latestMOD.substr(latestIndex + 1);

                                if (gitVersion !== currentVersion) {
                                    this.setState({ testboardColor: "red" })
                                }
                                else {
                                    this.setState({ testboardColor: "green" })
                                }
                            }
                            break;

                        case 'EMB':
                            let latestEMB = nameArr.find(hw => hw.slice(0, 3) === 'EMB')
                            if (typeof latestEMB !== 'undefined') {

                                const latestIndex = latestEMB.indexOf('.')
                                const gitVersion = latestEMB.substr(latestIndex + 1);

                                if (gitVersion !== currentVersion) {
                                    this.setState({ testboardColor: "red" })
                                }
                                else {
                                    this.setState({ testboardColor: "green" })
                                }
                            }
                            break;

                        default:
                            break;
                    }
                })
                .catch(error => console.log('Test-runner version error', error));
        })
    }

    render() {
        const { info, screenSize } = this.props
        const { webAppColor, testboardColor } = this.state
        const { hardwareCode, fwVersion } = this.props.options
        return (
            <Header as={this.getHeaderSize(screenSize)}>
                Testavimo trukmė: {this.renderTime()}
                <Header.Subheader>
                    <div>
                        {`Testavimo Stendo IP: ${info.ip}`}
                    </div>
                    <div style={{ color: webAppColor }}>
                        WebApp Versija: {version}
                    </div>
                    <div style={{ color: testboardColor }}>
                        Operacinės įrangos versija: {info.tbVersion}
                    </div>
                    <div>
                        Testboard ID: {info.id}
                    </div>
                    <div>
                        Pasirinktas FW: {fwVersion}
                    </div>
                    <div>
                        Pasirinktas HW: {hardwareCode}
                    </div>
                </Header.Subheader>
            </Header>
        )
    }
}

export default TestBoardInfo
