import React from 'react';
import { Button, Icon, Modal, Table, Form, Grid, Message } from 'semantic-ui-react'
import "./commentTable.css";

class CommentModal extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            modalOpen: false,
            tbNotes: [],
            tbCounterData: [],
            testInfo: {
                totalFails: '',
                totalPasses: '',
                totalCount: ''
            },
            userInput: '',
            loader: ''
        }
    }

    getButtonSize(screenSize) {
        switch (screenSize) {
            case 'large': {
                return 'medium'
            }
            case 'medium': {
                return 'small'
            }
            default: {
                return 'small'
            }
        }
    }

    handleModalOpen() {
        this.testboardCounterCheck()
        this.testRunnerJournalCheck()
        this.setState({ modalOpen: true })
    }

    handleModalClose() {
        this.setState({ modalOpen: false })

    }

    renderTestListTable() {
        const { tbNotes } = this.state
        if (tbNotes === [] || tbNotes.length === 0) {
            return (
                <Modal.Header>
                    <Message style={{ marginBottom: '10px' }}>Sąrašas tuščias!</Message>
                </Modal.Header>
            )
        }
        else {

            tbNotes.sort((a,b) => (a.date < b.date) ? 1 : -1)

            return (
                <Grid>
                    <Grid.Column>
                        <Table color='blue' textAlign='center' className='commentTable' celled  >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Pakeitimas</Table.HeaderCell>
                                    <Table.HeaderCell width={3}>Data</Table.HeaderCell>
                                    <Table.HeaderCell width={4}>Pakeitė</Table.HeaderCell>
                                    <Table.HeaderCell width={1}>FAIL</Table.HeaderCell>
                                    <Table.HeaderCell width={1}>PASS</Table.HeaderCell>
                                    <Table.HeaderCell width={1}>Viso</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {tbNotes.map((group, idx) => (
                                    <Table.Row>
                                        <Table.Cell>{group.comment}</Table.Cell>
                                        <Table.Cell width={3}>{this.timezoneChange(group.date).slice(0, -5).replace('T', ' ')}</Table.Cell>
                                        <Table.Cell width={4}>{group.user}</Table.Cell>
                                        <Table.Cell width={1} negative>{group.F}</Table.Cell>
                                        <Table.Cell width={1} positive>{group.P}</Table.Cell>
                                        <Table.Cell width={1} warning>{group.T}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell >
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Grid.Column>
                </Grid>

            )

        }
    }

    componentWillMount() {
        this.testboardCounterCheck()
        this.testRunnerJournalCheck()
    }

    timezoneChange(input) { //Datos keitimo funkcija
        let startTime = new Date(input);
        startTime = new Date(startTime.getTime() - (startTime.getTimezoneOffset() * 60000));
        return startTime.toISOString()
    }


    testRunnerJournalCheck() {
        const { info } = this.props
        fetch(`/testboardComments?id=${info.id}`, {
        })
            .then(response =>
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })
                ).then(res => {
                    this.setState({ tbNotes: res.data.onSuccess })
                }))
            .catch(error => console.log('Test-runner journal error', error));
    }


    testboardCounterCheck() {
        const { info } = this.props
        fetch(`/getTBCounter?id=${info.id}`, {
        })
            .then(response =>
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })
                ).then(res => {
                    this.setState({ tbCounterData: res.data.onSuccess })
                }))
            .then(() => {
                this.renderTBCounterTable()
            })
            .catch(error => console.log('Test-runner counter error', error));
    }

    renderTBCounterTable() {
        const { tbCounterData } = this.state
        let fails = 0, passes = 0, total = 0;
        if (tbCounterData.length !== 0) {
            tbCounterData.forEach(entry => {
                entry.res === "P" ? passes++ : fails++
                total++
            })
        }
        this.setState({
            testInfo: { totalFails: fails, totalPasses: passes, totalCount: total }
        });

    }



    renderModal() {
        const { info } = this.props
        const { modalOpen, testInfo } = this.state
        return (
            <Modal
                open={modalOpen}
                closeOnEscape
                closeOnDimmerClick
                onClose={() => this.handleModalClose()}
                className='changesModal'
            >
                <Modal.Header>
                    <Grid>
                        <Grid.Column width={9}>
                            Testavimo stendo {info.id} pakeitimų sąrašas
                        </Grid.Column>

                        <Grid.Column width={5}>
                            <Table size='small' compact className='counterTable' celled striped>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell negative>FAIL</Table.HeaderCell>
                                        <Table.Cell negative>{testInfo.totalFails}</Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.HeaderCell positive>PASS</Table.HeaderCell>
                                        <Table.Cell positive>{testInfo.totalPasses}</Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.HeaderCell warning>Viso</Table.HeaderCell>
                                        <Table.Cell warning>{testInfo.totalCount}</Table.Cell>
                                    </Table.Row>
                                </Table.Header>
                            </Table>
                        </Grid.Column>
                        <Grid.Column width={1} floated='right'>
                            <Button
                                circular
                                icon='close'
                                floated='right'
                                color='green'
                                style={{ marginTop: '-5px' }}
                                onClick={() => this.handleModalClose()}
                            />
                        </Grid.Column>
                    </Grid>
                </Modal.Header>
                <Modal.Content>
                    {this.renderTestListTable()}
                    <Grid>
                        <Grid.Column width={10}>
                            <Form.Input
                                fluid
                                icon='comments'
                                iconPosition='left'
                                placeholder='Įveskite pakeitimus'
                                value={this.state.userInput}
                                onChange={(event) => {
                                    this.setState({
                                        userInput: event.target.value
                                    });
                                }}
                            />
                        </Grid.Column>
                        <Grid.Column width={4} floated='right'>
                            <Button color='blue' fluid size='large' className={this.state.loader} onClick={() => this.sendChanges()}>
                                Pridėti įrašą
                            </Button>
                        </Grid.Column>
                    </Grid>
                </Modal.Content>
            </Modal >
        )
    }


    setLoader(value) {
        this.setState({ loader: value })
    }

    sendChanges() {
        const { info } = this.props
        const { name, surname } = this.props.login
        const { testInfo } = this.state
        const fullName = `${name} ${surname}`

        let newMongoData = {}


        if (this.state.userInput !== '') {
            this.setLoader('disabled loading')
            Object.assign (newMongoData, {
                user: fullName,
                date: new Date(Date.now()),
                comment: this.state.userInput,
                P: testInfo.totalPasses,
                F: testInfo.totalFails,
                T: testInfo.totalCount
            })

            fetch(`/postCommentToDB`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: info.id,
                    data: newMongoData
                })
            }).then (() =>{
                this.setState({
                    userInput: ''
                });
            })
                .catch(error => console.log('Test-runner journal error', error));
        }
        else {
            console.log("ERR POST")
        }

        setTimeout(() => {
            this.testRunnerJournalCheck()
            this.setLoader(' ')
        }, 1000);
        this.setState({ userInput: '' })
    }

    renderCommentsModalButton() {
        const { screenSize } = this.props
        return (
            <Button
                icon
                floated='right'
                style={{ marginLeft: '5px', marginBottom: '5px' }}
                size={this.getButtonSize(screenSize)}
                onClick={() => this.handleModalOpen()}
            >
                <Icon name='comments' color='green' />
            </Button>
        )
    }

    render() {
        return (
            <div id='testboard-modal'>
                {this.renderCommentsModalButton()}
                {this.renderModal()}
            </div>
        )
    }
}

export default CommentModal
