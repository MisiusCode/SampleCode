import React from 'react';
import { Button, Icon } from 'semantic-ui-react'

class StartStopButtons extends React.Component {
    getButtonSize(screenSize) {
        switch (screenSize) {
            case 'large': {
                return 'small'
            }
            case 'medium': {
                return 'tiny'
            }
            default: {
                return 'tiny'
            }
        }
    }

    renderStopButton() {
        const { type, info, screenSize, setCyclesInProgress, ejectOnCompletion } = this.props
        return (
            <Button
                icon
                compact={type === 'compact'}
                labelPosition='left'
                color='red'
                size={type === 'compact' ? 'mini' : this.getButtonSize(screenSize)}
                floated='right'
                style={{ marginLeft: '5px' }}
                onClick={() => {
                    try{fetch(`/${info.id}/test/eject?noEject=${ejectOnCompletion ? 'false' : 'true'}`)}catch(e){console.log(`Error while trying to eject`,e)}
                    fetch(`/${info.id}/test/stop`)
                    setCyclesInProgress(false)
                }}>
                Stop
            <Icon name='stop' />
            </Button>
        )
    }

    renderStartButton() {
        const { type, info, screenSize } = this.props
        return (
            <Button
                icon
                compact={type === 'compact'}
                labelPosition='left'
                color='blue'
                size={type === 'compact' ? 'mini' : this.getButtonSize(screenSize)}
                floated='right'
                onClick={() => {
                    fetch(`/${info.id}/test/request`)
                }}>
                <Icon name='play' />
                Start
            </Button>
        )
    }

    render() {
        return (
            <div id='start-stop-buttons'>
                {this.renderStopButton()}
                {this.renderStartButton()}
            </div>
        )
    }
}

export default StartStopButtons
