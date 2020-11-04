import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import AddEpisodeForm from './AddEpisodeForm';

class AddEpisodeButton extends Component {
  state = {showForm: false};
  toggleShowForm() {
    this.setState({showForm: !this.state.showForm});
  }
  render() {
    return this.state.showForm
      ? <AddEpisodeForm
          seasonId={this.props.seasonId}
          onCancel={() => this.toggleShowForm()}
          onCreate={() => {
            this.toggleShowForm();
            this.props.onCreate();
          }}
        />
      : <Button
          fluid
          primary
          icon='plus'
          content='Add Episode'
          labelPosition='left'
          onClick={() => this.toggleShowForm()}
        />;
  }
}

export default AddEpisodeButton;
