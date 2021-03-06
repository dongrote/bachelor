import React, { Component } from 'react';
import { Button, Form, Grid, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

class SignInForm extends Component {
  state = {
    email: '',
    password: '',
    buttonDisabled: true,
    error: false,
    errorMessage: '',
    busy: false,
    signInSuccess: null,
  };

  onEmailInput(email) {
    this.setState({email, buttonDisabled: email.length === 0 || this.state.password.length === 0});
  }
  onPasswordInput(password) {
    this.setState({password, buttonDisabled: password.length === 0 || this.state.email.length === 0});
  }
  async onSignInButton() {
    this.setState({busy: true});
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: Buffer.from(JSON.stringify({username: this.state.email, password: this.state.password})),
    });
    this.setState({busy: false});
    if (res.ok) {
      this.setState({signInSuccess: true});
    } else {
      const json = await res.json();
      this.setState({error: true, errorMessage: json.error.message});
    }
  }
  render() {
    if (this.state.signInSuccess === true) return <Redirect to='/dashboard' />
    return (
      <Form error={this.state.error}>
        <Form.Field required>
          <label>E-mail Address</label>
          <input
            type='email'
            placeholder='E-mail'
            onInput={event => this.onEmailInput(event.target.value)}
          />
        </Form.Field>
        <Form.Field required>
          <label>Password</label>
          <input
            type='password'
            placeholder='password'
            onInput={event => this.onPasswordInput(event.target.value)}
          />
        </Form.Field>
        <Grid columns={1}>
          <Grid.Column>
            <Grid.Row>
              <Button
                fluid
                primary
                loading={this.state.busy}
                disabled={this.state.buttonDisabled}
                type='submit'
                content='Sign In'
                onClick={() => this.onSignInButton()}
              />
            </Grid.Row>
          </Grid.Column>
        </Grid>
        <Message error header='Sign In Error' content={this.state.errorMessage} />
      </Form>
    );
  }
}

export default SignInForm;
