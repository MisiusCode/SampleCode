import React from 'react';
import { Button, Icon, Modal, Grid, Dropdown, Form } from 'semantic-ui-react'

class TestBoardsLayoutModal extends React.Component {
    constructor() {
        super()
        this.state = {
            modalOpen: false,
            testBoardsCopy: []
        }
    }

    handleModalOpen() {
        const { testBoards } = this.props
        this.setState({ testBoardsCopy: testBoards.map((tb) => ({ ip: tb.ip, error: false })) })
        this.setState({ modalOpen: true })
    }

    handleModalClose() {
        const { testBoardsCopy } = this.state
        for (let i = 0; i < testBoardsCopy.length; i++) {
            if(testBoardsCopy[i].error) {
                return
            }
        }

        this.props.modifyTbList(this.listOriginalArray())
        this.setState({ modalOpen: false })
    }

    listOriginalArray() {
        const { testBoards } = this.props
        const { testBoardsCopy } = this.state
        return testBoardsCopy.map((tb) => testBoards.find((orgTb) => orgTb.ip === tb.ip))
    }

    buildDropdownOptions() {
        const { testBoards } = this.props
        return testBoards.map((tb) => {
            if (this.checkIfTbUsed(tb.ip)) {
                return { key: tb.ip, text: tb.ip, value: tb.ip, icon: 'close' }
            } else {
                return { key: tb.ip, text: tb.ip, value: tb.ip,}
            }     
        })
    }

    handleDropdownChange(e, {name, value}) {
        const { testBoardsCopy } = this.state
        const modifiedList = testBoardsCopy.map((tb, idx) => {
            if (idx === name) {
                return { ...tb, ip: value }
            }
            return tb
        })
        this.checkAndShowDublicates(modifiedList)
    }

    checkIfTbUsed (ip) {
        const { testBoardsCopy } = this.state

        for (let i = 0; i < testBoardsCopy.length; i++) {
            if (testBoardsCopy[i].ip === ip) {
                return true
            }
        }
        return false
    }

    checkAndShowDublicates(modifiedList) {
        let dublicates = new Array(modifiedList.length).fill(false)

        for (let i = 0; i < modifiedList.length; i++) {
            for (let j = 0; j < modifiedList.length; j++) {
                if ((modifiedList[i].ip === modifiedList[j].ip) && (i !== j)) {
                    dublicates[i] = true
                }
            }
        }
        for (let i = 0; i < dublicates.length; i++) {
            if(dublicates[i]) {
                modifiedList[i].error = true
            } else {
                modifiedList[i].error = false
            }
        }
        this.setState({ testBoardsCopy: modifiedList })
    }

    renderTbSelectionDropdown(currentIdx) {
        const { testBoardsCopy } = this.state
        return(
            <Form.Field>
                <label>{`Pozicija Nr. ${currentIdx + 1}`}</label>
                <Dropdown
                    placeholder={testBoardsCopy[currentIdx].ip}
                    fluid
                    selection
                    name={currentIdx}
                    error={testBoardsCopy[currentIdx].error}
                    value={testBoardsCopy[currentIdx].ip}
                    onChange={this.handleDropdownChange.bind(this)}
                    options={this.buildDropdownOptions()}
                />
            </Form.Field>
        )
    }
    renderModal() {
        const { modalOpen } = this.state
        return (
            <Modal
                open={modalOpen}
                closeOnEscape
                closeOnDimmerClick
                onClose={() => this.handleModalClose()}
                >
                <Modal.Header>
                    {`Testavimo stendų išdėstymas`}
                    <Button 
                        circular 
                        icon='close' 
                        floated='right'
                        color='blue'
                        style={{ marginTop: '-5px' }}
                        onClick={() => this.handleModalClose()}
                    />
                </Modal.Header>
                <Modal.Content>
                    <Form>
                        <Grid columns={3}>
                            {this.renderModalBody()}
                        </Grid>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }

    renderModalBody() {
        const { testBoardsCopy } = this.state

        return testBoardsCopy.map((tb, idx) => {
            return (
                <Grid.Column>
                    {this.renderTbSelectionDropdown(idx)}
                </Grid.Column>
            )
        })
    }

    renderLayoutButton() {
        if (this.props.testBoards === null || typeof this.props.testBoards === 'undefined' || this.props.testBoards.length === 0) {
            return null
        }
        return (
            <Button
            icon
            size='big'
            circular
            color='black'
            floated='left'
            style={{ width: 50, height: 50 }}
            onClick={() => this.handleModalOpen()}
            >
                <Icon name='th'/>
            </Button>
        )
    }

    render() {
        return (
            <div>
                {this.renderLayoutButton()}
                {this.renderModal()}
            </div>
        )
    }
}

export default TestBoardsLayoutModal
