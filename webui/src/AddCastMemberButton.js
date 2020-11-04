import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import AddCastMemberForm from './AddCastMemberForm';

class AddCastMemberButton extends Component {
  state = {showForm: false};
  toggleShowForm() {
    this.setState({showForm: !this.state.showForm});
  }
  render() {
    return this.state.showForm
      ? <AddCastMemberForm
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
          content='Add Cast member'
          labelPosition='left'
          onClick={() => this.toggleShowForm()}
        />;
  }
}

export default AddCastMemberButton;
