import React from 'react';
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'
import { Grid, Message } from 'semantic-ui-react'

class MainPage extends React.Component {
	constructor() {
		super()
		this.timer = null
		this.state = {
			testBoards: [],
			count: 0,
			passed: 0,
			failed: 0,
		}
		this.handleOperationIncrease = this.handleOperationIncrease.bind(this)
		this.modifyTbList = this.modifyTbList.bind(this)
	}

	componentWillMount() {

		this.getAvailableTestBoards()
		this.timer = setInterval(() => {
			this.getAvailableTestBoards()
		}, 2500)
		this.connectWebSocket()
	}

	componentWillUnmount() {
		clearInterval(this.timer)
	}

	connectWebSocket() {
		const ws = new WebSocket(`ws://${window.location.host}`)
		ws.onmessage = (message) => {
			const msg = JSON.parse(message.data)
			let testBoardsCopy = [...this.state.testBoards]
			const idx = testBoardsCopy.map((tb) => tb.ip).indexOf(msg.ip)
			if (idx === -1) return

			let item = { ...testBoardsCopy[idx] }
			item.status = JSON.parse(msg.status)
			testBoardsCopy[idx] = item
			this.setState({ testBoards: testBoardsCopy })
		}
	}

	checkAndUpdateTbList(newList) {
		const { testBoards } = this.state
		const tbListCopy = [...testBoards]

		tbListCopy.forEach((oldTb, oldIdx) => {
			const idx = newList.findIndex((tb) => tb.ip === oldTb.ip)
			if (idx === -1) {
				tbListCopy.splice(oldIdx, 1)
			}
		})

		newList.forEach((newTb) => {
			const idx = testBoards.findIndex((tb) => tb.ip === newTb.ip)
			if (idx === -1) {
				tbListCopy.push(newTb)
			}
		})

		this.setState({ testBoards: tbListCopy })
	}

	getAvailableTestBoards() {
		fetch(`/testboards`)
			.then((response) => response.json())
			.then((json) => {
				this.checkAndUpdateTbList(json.list)
			})
			.catch((onError) => {
				console.log(`Failed to get available testBoards: ${onError}`)
				this.props.history.push('/')
			})
	}

	modifyTbList(modifiedList) {
		this.setState({ testBoards: modifiedList })
	}


    updateCounter(tbID, result) {
        let testresult = {}
            Object.assign(testresult, {
                res: result === false ? "F": "P",
                date: new Date(Date.now()),
            })
            fetch(`/addCountTB`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: tbID,
                    data: testresult
                })
            })
                .catch(error => console.log('Test-runner counter error', error));
    }


	handleOperationIncrease(tbID, pass) {
		this.updateCounter(tbID, pass)
		console.log(this.state)
		const { count, passed, failed } = this.state
		if (pass) {
			this.setState({ count: count + 1, passed: passed + 1 })

		} else {
			this.setState({ count: count + 1, failed: failed + 1 })
		}
	}

	renderZoomErrorMessage() {
		const { hardwareCode } = this.props.location.state.options
		return (
			<div style={{paddingLeft:'10px', paddingRight:'10px', paddingTop:'10px'}}>
				<Message warning>
					<p><b>Įspėjimas!</b> Pasirnktas 'ZOOM' kliento gaminių testavimas. Naudokite tik specialiai 'ZOOM' klientui modifikuotus EMB testavimo stendus (be AIN adatos).</p>
				</Message>
			</div>
		)
	}

	render() {
		const { login, options } = this.props.location.state
		const operations = { count: this.state.count, passed: this.state.passed, failed: this.state.failed }
		const { testBoards } = this.state
		return (
			<div>
				<Header
					login={login}
					options={options}
					testBoards={testBoards}
					modifyTbList={this.modifyTbList}
					operations={operations}
				/>
				{this.renderZoomErrorMessage()}
				<Dashboard
					login={login}
					options={options}
					testBoards={testBoards}
					handleOperationIncrease={this.handleOperationIncrease}

				/>

			</div>
		)
	}
}

export default MainPage;
