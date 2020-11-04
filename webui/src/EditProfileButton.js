import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import EditProfileForm from './EditProfileForm';

class EditProfileButton extends Component {
  state = {showForm: false};
  toggleShowForm() {
    this.setState({showForm: !this.state.showForm});
  }
  render() {
    return this.state.showForm
      ? <EditProfileForm
          onCancel={() => this.toggleShowForm()}
          onSubmit={() => this.toggleShowForm()}
        />
      : <Button
          fluid
          primary
          icon='edit outline'
          labelPosition='left'
          content='Edit Profile'
          onClick={() => this.toggleShowForm()}
        />;
  }
}

export default EditProfileButton;
