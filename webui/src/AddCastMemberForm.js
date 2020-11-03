import React, { Component } from 'react';
import { Form, Grid, Button, Radio } from 'semantic-ui-react';

class CreateSeasonForm extends Component {
  state = {firstName: '', lastName: '', age: null, occupation: null, gender: null};

  onFirstNameInput(firstName) {
    this.setState({firstName});
  }

  onLastNameInput(lastName) {
    this.setState({lastName});
  }

  onAgeInput(age) {
    this.setState({age});
  }

  onOccupationInput(occupation) {
    this.setState({occupation});
  }

  onGenderSelect(gender) {
    this.setState({gender});
  }

  async onSubmit() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/cast`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    });
    if (res.ok) {
      this.props.onCreate();
    }
  }

  render() {
    return (
      <Form>
        <Form.Field required>
          <label>First Name</label>
          <input
            placeholder='First Name'
            value={this.state.firstName}
            onInput={e => this.onFirstNameInput(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input
            placeholder='Last Name'
            value={this.state.lastName}
            onInput={e => this.onLastNameInput(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Age</label>
          <input
            placeholder='Age'
            value={this.state.age}
            type='num'
            onInput={e => this.onAgeInput(Number(e.target.value))}
          />
        </Form.Field>
        <Form.Field>
          <label>Occupation</label>
          <input
            placeholder='Occupation'
            value={this.state.occupation}
            onInput={e => this.onOccupationInput(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Male'
            name='genderGroup'
            value='m'
            checked={this.state.gender === 'm'}
            onChange={() => this.onGenderSelect('m')}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Female'
            name='genderGroup'
            value='f'
            checked={this.state.gender === 'f'}
            onChange={() => this.onGenderSelect('f')}
          />
        </Form.Field>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Button primary fluid type='submit' content='Add' onClick={() => this.onSubmit()} />
            </Grid.Column>
            <Grid.Column>
              <Button fluid content='Cancel' onClick={this.props.onCancel} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

export default CreateSeasonForm;
