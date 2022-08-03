import React from 'react';
import { Header } from 'semantic-ui-react'

class TestBoardState extends React.Component {
    statusToReadable(state) {
        switch (state) {
            case 'IN PROGRESS': {
                return 'Testavimas vykdomas...'
            }
            case 'FAIL': {
                return 'Testas nesėkmingas'
            }
            case 'PASS': {
                return 'Testas sėkmingas'
            }
            default: {
                return 'Laukiama...'
            }
        }
    }

    renderState() {
        const { status } = this.props.info
        const { error, errorMessage } = this.props

        if (error) {
            return errorMessage
        }

        if (typeof status === 'undefined') {
            return 'Laukiama...'
        }
        
        return this.statusToReadable(status.state)
    }

    renderColor() {
        const { error } = this.props
        if (error) {
            return 'red'
        }

        if (typeof this.props.info.status.state === 'undefined') {
            return 'black'
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
                return 'black'
            }
        }
    }

    render() {
        return (
            <Header as='h2' color={this.renderColor()}>
                {this.renderState()}
            </Header>
        )
    }
}

export default TestBoardState
