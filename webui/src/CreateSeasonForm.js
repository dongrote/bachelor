import React, { Component } from 'react';
import { Form, Grid, Button, Radio } from 'semantic-ui-react';

class CreateSeasonForm extends Component {
  state = {name: '', type: null, startDate: null, endDate: null};

  onNameInput(name) {
    this.setState({name});
  }

  onTypeChange(newType) {
    this.setState({type: newType});
  }

  onStartDateChange(newDate) {
    console.log(newDate);
    this.setState({startDate: newDate});
  }

  onEndDateChange(newDate) {
    console.log(newDate);
    this.setState({endDate: newDate});
  }

  async onSubmit() {
    const res = await fetch(`/api/seasons/`, {
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
          <label>Season Name</label>
          <input
            placeholder='Bachelor(ette) Season N'
            value={this.state.name}
            onInput={e => this.onNameInput(e.target.value)}
          />
        </Form.Field>
        <Form.Field required>
          <label>Bachelor(ette)</label>
        </Form.Field>
        <Form.Field>
          <Radio
            label='Bachelor'
            name='typeGroup'
            value='bachelor'
            checked={this.state.type === 'bachelor'}
            onChange={() => this.onTypeChange('bachelor')}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Bachelorette'
            name='typeGroup'
            value='bachelorette'
            checked={this.state.type === 'bachelorette'}
            onChange={() => this.onTypeChange('bachelorette')}
          />
        </Form.Field>
        <Form.Field>
          <label>Start Date</label>
          <input type='date' onChange={e =>  this.onStartDateChange(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>End Date</label>
          <input type='date' onChange={e => this.onEndDateChange(e.target.value)} />
        </Form.Field>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Button primary fluid type='submit' content='Create' onClick={() => this.onSubmit()} />
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