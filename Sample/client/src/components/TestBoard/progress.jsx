import React from 'react';
import { Progress } from 'semantic-ui-react'

class TestProgress extends React.Component {
    checkIfExist(obj) {
        if (typeof obj === 'undefined' || Object.keys(obj).length === 0) {
            return false
        }
        return true
    }

    calculateProgress() {
        if (!this.checkIfExist(this.props.info.status.progress)) {
            return 0
        }

        const { progress, state } = this.props.info.status
        return state === 'PASS'
            ? 100
            : parseInt((progress.list.current / progress.list.count) * 100)
    }

    renderCurrentTest() {
        if (!this.checkIfExist(this.props.info.status.progress)) {
            return null
        }

        const { progress } = this.props.info.status
        if (progress.testGroup.currentName === '' || progress.test.currentName === '') {
            return 'Pradedama...'
        }
        if (this.props.info.status.state === 'FAIL') {
            return `Testas nesėkmingas: ${progress.testGroup.currentName}/${progress.test.currentName}`
        } else if (this.props.info.status.state === 'PASS') { 
            return 'Testas sėkmingas'
        } else {
            return `Vykdomas testas: ${progress.testGroup.currentName}/${progress.test.currentName}`
        }
    }


    renderColor() {
        const { error } = this.props
        if (error) {
            return 'red'
        }

        if (typeof this.props.info.status.state === 'undefined') {
            return 'blue'
        }

        const { state } = this.props.info.status
        switch (state) {
            case 'FAIL': {
                return 'red'
            }
            case 'PASS': {
                return 'green'
            }
            default: {
                return 'blue'
            }
        }
    }

    render() {
        const { type } = this.props
        if (type === 'compact') return (
            <Progress progress percent={this.calculateProgress()} color={this.renderColor()} size='medium' active={this.props.info.status.state === 'IN PROGRESS'}>
            {this.renderCurrentTest()}
            </Progress>
        )
        return (
            <Progress progress percent={this.calculateProgress()} color={this.renderColor()} size='large' active={this.props.info.status.state === 'IN PROGRESS'}>
                {this.renderCurrentTest()}
            </Progress>
        )
    }
}

export default TestProgress
