import React, { Component } from 'react'
import axios from "../Utils/axios";
import storage from "local-storage"
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            email: "",
            password: "",
            token: ""
        }
    }

    setEmail(e) {
        let value = e.target.value
        this.setState({ email: value })
    }

    setPassword(e) {
        let value = e.target.value
        this.setState({ password: value })
    }

    login(data) {
        return new Promise((resolve, reject) => {
            axios.post('/user/login', data)
                .then((res) => {
                    storage.set('token', res.data.token)
                    storage.set('email', this.state.email)

                    resolve()
                    window.location.href = "/"
                }).catch((err) => {
                    console.log(err.response.data.message)
                    alert(err.response.data.message)
                })
        })
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>

                        <Form>
                            <FormGroup row>
                                <Label for="email" sm={2}>Email</Label>
                                <Col sm={10}>
                                    <Input type="email" name="email" id="exampleEmail" placeholder="Email" onChange={(e) => this.setEmail(e)} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="Password" sm={2}>Password</Label>
                                <Col sm={10}>
                                    <Input type="password" name="password" id="Password" placeholder="Password" onChange={(e) => this.setPassword(e)} />
                                </Col>
                            </FormGroup>

                            <FormGroup check row>
                                <Col sm={{ size: 10, offset: 2 }}>
                                    <Button onClick={() => this.login({ email: this.state.email, password: this.state.password })}>Login</Button>
                                </Col>
                            </FormGroup>
                        </Form>

                    </Col>
                </Row>
            </Container>
        )

    }

}

export default Login