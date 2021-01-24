import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Grid } from 'semantic-ui-react';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';

class CreateSeasonForm extends Component {
  state = {title: '', disabled: true, createdEpisode: false};

  onTitleInput(title) {
    this.setState({title, disabled: title.length === 0});
  }

  async onSubmit() {
    const res = await fetch(`/api/seasons/${this.props.SeasonId}/episodes`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    });
    this.setState({createdEpisode: res.ok});
  }

  render() {
    if (this.state.createdEpisode) return <Redirect to={`/season/${this.props.SeasonId}`} />;
    return (
      <Form>
        <Form.Field required>
          <label>Title</label>
          <input
            placeholder='Title'
            value={this.state.title}
            onInput={e => this.onTitleInput(e.target.value)}
          />
        </Form.Field>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <SubmitButton disabled={this.state.disabled} content='Add' onClick={() => this.onSubmit()} />
            </Grid.Column>
            <Grid.Column>
              <Link to={`/season/${this.props.SeasonId}`}>
                <CancelButton />
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

export default CreateSeasonForm;
