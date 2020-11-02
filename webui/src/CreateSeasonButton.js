import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import CreateSeasonForm from './CreateSeasonForm';

class CreateSeasonButton extends Component {
  state = {showForm: false};
  toggleShowForm() {
    this.setState({showForm: !this.state.showForm});
  }
  render() {
    return this.state.showForm
      ? <CreateSeasonForm
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
          content='Create New Season'
          labelPosition='left'
          onClick={() => this.toggleShowForm()}
        />;
  }
}

export default CreateSeasonButton;