import React, { Component } from 'react';
import { Button, Form, Grid } from 'semantic-ui-react';

class EditProfileForm extends Component {
  state = {};
  async fetchUserProfile() {
    const res = await fetch('/api/users/profile');
    if (res.ok) {
      const json = await res.json();
      this.setState({
        displayName: json.displayName,
        firstName: json.firstName,
        lastName: json.lastName,
        username: json.username,
      });
    }
  }
  async saveUserProfile() {
    const body = {
      displayName: this.state.displayName,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };
    const res = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });
    if (res.ok) {
      this.props.onCancel();
    }
  }
  async componentDidMount() {
    await this.fetchUserProfile();
  }
  onFirstNameInput(firstName) { this.setState({firstName}); }
  onLastNameInput(lastName) { this.setState({lastName}); }
  onDisplayNameInput(displayName) { this.setState({displayName}); }
  render() {
    return (
      <Form>
        <Form.Field>
          <label>Username</label>
          <input readOnly disabled value={this.state.username} />
        </Form.Field>
        <Form.Field>
          <label>First Name</label>
          <input value={this.state.firstName} placeholder='First Name' onInput={e => this.onFirstNameInput(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input value={this.state.lastName} placeholder='Last Name' onInput={e => this.onLastNameInput(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Display Name</label>
          <input value={this.state.displayName} placeholder='Display Name' onInput={e => this.onDisplayNameInput(e.target.value)} />
        </Form.Field>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Button fluid primary type='submit' content='Save' onClick={() => this.saveUserProfile()} />
            </Grid.Column>
            <Grid.Column>
              <Button fluid content='Cancel' onClick={() => this.props.onCancel()} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

export default EditProfileForm;
