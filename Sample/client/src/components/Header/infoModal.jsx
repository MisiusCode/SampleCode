import React from 'react';
import { Button, Modal } from 'semantic-ui-react'

class InfoModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            infoModalOpen: false,
            optionsSet: false,
            operationsSet: false
        }
    }

    handleModalClose(){
        this.setState({ infoModalOpen: false })
    }

    handleModalOpen(){
        this.setState({ infoModalOpen: true })
        if(typeof this.props.options !== 'undefined'){ 
            this.setState({ optionsSet: true })
        } else {
            this.setState({ optionsSet: false })
        }
        if(typeof this.props.operations !== 'undefined'){ 
            this.setState({ operationsSet: true })
        } else {
            this.setState({ operationsSet: false })
        }
    }

    render() {
        const { name, surname } = this.props.login

        return (
        <Modal
            open={this.state.infoModalOpen}
            closeOnEscape={this.handleModalClose.bind(this)}
            closeOnDimmerClick={this.handleModalClose.bind(this)}
            onClose={this.handleModalClose.bind(this)}
            >
            <Modal.Header style={{ color: '#428bca' }}>
                {`Sesijos informacija`}
                <Button 
                    circular 
                    icon='close' 
                    floated='right'
                    color='blue'
                    style={{ marginTop: '-5px' }}
                    onClick={this.handleModalClose.bind(this)}
                />
            </Modal.Header>
            <Modal.Content style={{ fontSize: '15px' }}>
                <table class="ui celled table">
                <tbody>
                    <tr>
                        <td>Vartotojas</td>
                        <td>{`${name} ${surname}`}</td>
                    </tr>
                    <tr>
                        <td>Operacijų skaičius</td>
                        <td>{`${this.state.operationsSet ? this.props.operations.count : 0 }`}</td>
                    </tr>
                    <tr>
                        <td>Sėkmingos operacijos</td>
                        <td style={{ color: 'green' }}>{`${this.state.operationsSet ? this.props.operations.passed : 0 }`}</td>
                    </tr>
                    <tr>
                        <td>Nesėkmingos operacijos</td>
                        <td style={{ color: 'red' }}>{`${this.state.operationsSet ? this.props.operations.failed : 0 }`}</td>
                    </tr>
                    <tr>
                        <td>Operacijos kodas</td>
                        <td>{`${this.state.optionsSet ? this.props.options.operationCode : 'nepasirinkta'}`}</td>
                    </tr>
                    <tr>
                        <td>Produkto kodas</td>
                        <td>{`${this.state.optionsSet ? this.props.options.productCode : 'nepasirinkta'}`}</td>
                    </tr>
                    <tr>
                        <td>Firmware versija</td>
                        <td>{`${this.state.optionsSet ? this.props.options.fwVersion : 'nepasirinkta'}`}</td>
                    </tr> 
                </tbody>
                </table>
            </Modal.Content>
        </Modal>
    )}
}

export default InfoModal
