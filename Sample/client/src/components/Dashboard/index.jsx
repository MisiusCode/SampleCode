import './dashboard.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import TestBoard from '../TestBoard'
import { Grid, Icon, Header, Message } from 'semantic-ui-react'

class Dashboard extends React.Component {

    renderTestBoardSegements() {
        const { login, options, testBoards, operations, handleOperationIncrease } = this.props

        if (testBoards.length === 0) {
            return (
                <div id='refresh'>
                    <Header icon size='huge'>
                        <Icon loading name='refresh' color='blue' />
                        Nėra prijungtų testavimo stendų
                    </Header>
                </div>
            )
        } 
        return testBoards.map((tb) => 
            <Grid.Column key={tb.id.toString()}>
                <TestBoard info={tb} login={login} options={options} operations={operations} handleOperationIncrease={handleOperationIncrease}/>
            </Grid.Column>
        )
    }

    render() {
        return (
            <div id='dashboard'>
                <Grid columns={3}>
                    {this.renderTestBoardSegements()}
                </Grid>
            </div>
        )
    }
}

export default withRouter(Dashboard)
