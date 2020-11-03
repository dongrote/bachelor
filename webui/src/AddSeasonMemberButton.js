import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import AddSeasonMemberForm from './AddSeasonMemberForm';

class AddSeasonMemberButton extends Component {
  state = {showForm: false};
  toggleShowForm() {
    this.setState({showForm: !this.state.showForm});
  }
  render() {
    return this.state.showForm
      ? <AddSeasonMemberForm
          seasonId={this.props.seasonId}
          ResourceGroupId={this.props.ResourceGroupId}
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
          content='Add Group member'
          labelPosition='left'
          onClick={() => this.toggleShowForm()}
        />;
  }
}

export default AddSeasonMemberButton;
