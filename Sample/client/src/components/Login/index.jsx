import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Form, Grid, Image, Message } from 'semantic-ui-react'
import GORAgent from '../GORAgent'

class Login extends React.Component {
    constructor() {
        super()
        this.state = { username: '', error: false, loading: false }
    }

    handleChange(e, { name, value })  {
        const { error } = this.state
        this.setState({ [name]: value })

        if (error) {
            this.setState({ error: false })
        }
    }

    handleLogin() {
        if (this.state.username === this.fakeUser){
           this.props.history.push('/options', { login: { name: 'Neprisijungęs', surname: '', gor: false, sessionId: null }} )
        } else {
            this.setState({ loading: true })
            GORAgent.createSession(this.state.username)
            .then((onSuccess) => {
                console.log(onSuccess)
                this.setState({ loading: false })
                this.props.history.push('/options', { login: { name: onSuccess.Name, surname: onSuccess.Surname, gor: true, sessionId: onSuccess.Id }} )
            })
            .catch((onFailure) => {
                console.log(onFailure)
                this.setState({ loading: false })
                this.setState({ error: true })
            })
        }
    }

    render() {
        return (
            <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle" >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Image src="../../logo_blue.png" style={{ marginBottom: '15px' }}/>
                    <Form size="large" onSubmit={this.handleLogin.bind(this)} error={this.state.error}>
                            <Form.Input
                                name="username"
                                fluid
                                icon="user"
                                iconPosition="left"
                                placeholder="Prisijungimas"
                                onChange={this.handleChange.bind(this)}
                                type='password'
                            />
                            <Form.Button content="Prisijungti" fluid color="blue" loading={this.state.loading} />
                            <Message error header="Prisijungti nepavyko" content="Blogas prisijungimo vardas" />
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}

export default withRouter(Login);
