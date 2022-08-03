import './header.css';
import React from 'react';
import { Button, Dropdown, Image, Grid, Label, Icon, Popup } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import TestBoardsLayoutModal from './modal.jsx'
import GORAgent from '../GORAgent'
import InfoModal from './infoModal'

class Header extends React.Component {
    constructor(props){
        super(props)
        this.infoModalRef = React.createRef();
    }
    
    infoModalOpen() {
        this.infoModalRef.current.handleModalOpen();
    }
    
    handleLogout() {
        const { gor } = this.props.login

        if (!gor) {
            this.props.history.push('/')
            return
        }
        if (typeof this.props.options === 'undefined') { // logout in options window
            GORAgent.endSession()
            .then(() => this.props.history.push('/'))
            return
        }

        GORAgent.endTask(this.props.options.taskId)
            .then(() => GORAgent.endSession())
            .then(() => this.props.history.push('/'))
            .catch((onFailure) => console.log(onFailure))
    }

    render() {
        const { history, modifyTbList, testBoards } = this.props
        const { name, surname } = this.props.login
        return (
            <div id='header'>
                <Grid verticalAlign='middle'>
                    <Grid.Row columns={3}>
                        <Grid.Column textAlign='left'>
                            <Button 
                                icon='arrow left'
                                size='big'
                                circular
                                color='black'
                                floated='left'
                                style={{ width: 50, height: 50 }}
                                onClick={history.goBack.bind(this)}
                            />
                            <TestBoardsLayoutModal testBoards={testBoards} modifyTbList={modifyTbList} />
                            <InfoModal ref={this.infoModalRef} login={this.props.login} options={this.props.options} operations={this.props.operations}/>
                                {/* <div id='headeroptions' floated='left'>
                                    {this.props.options !== undefined 
                                        ?   <Label size='large'><Icon name='info circle' />Parinktys
                                                <Popup content='Pasirinkta gaminio versija' trigger={
                                                    <Label.Detail>{this.props.options.hardwareCode}</Label.Detail>} />
                                                <Popup content='Pasirinktas produkto kodas' trigger={
                                                    <Label.Detail>{this.props.options.fwVersion}</Label.Detail>} />
                                            </Label>
                                        : null}
                                </div> */}
                        </Grid.Column>
                        <Grid.Column textAlign='center'>
                            <Image src='../../logo_white.png' height='50px' inline />
                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                            <Dropdown 
                                text={`${name} ${surname}`} 
                                button
                                labeled
                                floating
                                style={{ background: '#1b1c1d', color: '#f7f7f7', marginRight: '15px' }}
                            >
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={this.infoModalOpen.bind(this)}>
                                        Sesijos informacija
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={this.handleLogout.bind(this)}>
                                        Atsijungti
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Image src='../../user.png' circular height='50px' inline />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Header)