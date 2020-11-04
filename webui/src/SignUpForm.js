import React, { Component } from 'react';
import { Button, Form, Grid, Message } from 'semantic-ui-react';

class SignUpForm extends Component {
  state = {
    error: false,
    errorMessage: '',
    email: '',
    password: '',
    confirmPassword: '',
    buttonDisabled: true,
  };
  onEmailInput(email) {
    this.setState({
      email,
      buttonDisabled: email.length === 0 || this.state.password.length === 0 || this.state.password !== this.state.confirmPassword,
    });
  }
  onPasswordInput(password) {
    this.setState({
      password,
      buttonDisabled: password.length === 0 || this.state.email.length === 0 || password !== this.state.confirmPassword,
    });
  }
  onConfirmPasswordInput(confirmPassword) {
    this.setState({
      confirmPassword,
      buttonDisabled: this.state.email.length === 0 || this.state.password !== confirmPassword || confirmPassword.length === 0,
    });
  }
  async onSignUpClick() {
    const res = await fetch('/api/users/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: Buffer.from(JSON.stringify({username: this.state.email, password: this.state.password})),
    });
    if (res.ok) {
      this.props.onSignUp();
    } else {
      const json = await res.json();
      this.setState({error: true, errorMessage: json.error.message});
    }
  }
  render() {
    return (
      <Form error={this.state.error}>
        <Form.Field required>
          <label>E-mail Address</label>
          <input type='email' placeholder='E-mail' onInput={event => this.onEmailInput(event.target.value)} />
        </Form.Field>
        <Form.Field required>
          <label>Password</label>
          <input type='password' placeholder='password' onInput={event => this.onPasswordInput(event.target.value)} />
        </Form.Field>
        <Form.Field required>
          <label>Confirm Password</label>
          <input type='password' placeholder='password' onInput={event => this.onConfirmPasswordInput(event.target.value)} />
        </Form.Field>
        <Grid columns={2}>
          <Grid.Column>
            <Grid.Row>
              <Button
                fluid
                primary
                disabled={this.state.buttonDisabled}
                type='submit'
                content='Sign Up'
                onClick={() => this.onSignUpClick()}
              />
            </Grid.Row>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid>
        <Message error content={this.state.errorMessage} />
      </Form>
    );
  }
}

export default SignUpForm;