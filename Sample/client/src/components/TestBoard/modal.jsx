import React from 'react';
import { Button, Icon, Modal, Table, Checkbox } from 'semantic-ui-react'

class TestConfigModal extends React.Component {
    constructor() {
        super()
        this.state = {
            testConfig: null,
            modalOpen: false,
            selectAll: true
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

    handleTestListChange(modifiedGroup, modifiedIdx) {
        const { testConfig } = this.state
        const modifiedList = testConfig.testList.map((group, idx) => {
            if (idx === modifiedIdx) {
                return { name: modifiedGroup.name, enabled: !modifiedGroup.enabled }
            } else {
                return group
            }
        })
        const modifiedConfig = { ...testConfig, ...{ testList: modifiedList } }
        this.setState({ testConfig: modifiedConfig})
    }

    handleSelectAll() {
        const { testConfig, selectAll } = this.state
        const modifiedList = testConfig.testList.map((group) => {
            return { name: group.name, enabled: !selectAll }
        })
        const modifiedConfig = { ...testConfig, ...{ testList: modifiedList } }
        this.setState({ testConfig: modifiedConfig, selectAll: !selectAll })
    }

    handleModalOpen() {
        const { info } = this.props

        fetch(`/${info.id}/test/config`)
            .then((onSuccess) => onSuccess.json())
            .then((testConfig) => this.setState({ testConfig, modalOpen: true }))
            .catch((onError) => console.log(`Failed to get testboard test list! ${onError}`))
    }

    handleModalClose() {
        const { info } = this.props
        const { testConfig } = this.state

        fetch(`/${info.id}/test/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list: testConfig })
        })
            .then(() =>  this.setState({ modalOpen: false }))
            .catch((onError) => console.log(`Failed to modify testboard test list! ${onError}`))
    }

    renderTestListTable() {
        const { testConfig, selectAll } = this.state
        if (testConfig === null || typeof testConfig.testList === 'undefined' || Object.keys(testConfig.testList).length === 0) {
            return (
                <Modal.Header>
                    Sąrašas tuščias!
                </Modal.Header>
            )
        }
        return (
            <Table singleLine color='blue' textAlign='center'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Testų grupė</Table.HeaderCell>
                    <Table.HeaderCell>
                        Įtraukti į sąrašą
                        <Checkbox 
                            checked={selectAll}
                            onChange={this.handleSelectAll.bind(this)}
                            style={{ marginLeft: '10px', paddingTop: '3px' }}
                        />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {testConfig.testList.map((group, idx) => (
                    <Table.Row>
                        <Table.Cell>{group.name}</Table.Cell>
                        <Table.Cell>
                            <Checkbox 
                                checked={group.enabled} 
                                onChange={this.handleTestListChange.bind(this, group, idx)}
                            />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
            </Table>
        )
    }
    
    renderModal() {
        const { info } = this.props
        const { modalOpen } = this.state

        return (
            <Modal
                open={modalOpen}
                closeOnEscape
                closeOnDimmerClick
                onClose={() => this.handleModalClose()}
                >
                <Modal.Header>
                    {`Testavimo stendo ${info.ip} testų sąrašas`}
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
                    {this.renderTestListTable()}
                </Modal.Content>
            </Modal>
        )
    }

    renderTestConfigButton() {
        const { screenSize } = this.props
        return (
            <Button
                icon
                floated='right'
                style={{ marginLeft: '5px', marginBottom: '5px' }}
                size={this.getButtonSize(screenSize)}
                onClick={() => this.handleModalOpen()}
            >
                <Icon name='tasks' color='blue' />
            </Button>
        )
    }

    render() {
        return (
            <div id='testboard-modal'>
                {this.renderTestConfigButton()}
                {this.renderModal()}
            </div>
        )
    }
}

export default TestConfigModal
