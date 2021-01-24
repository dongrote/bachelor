import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import MenuBar from '../Components/MenuBar';
import AddCastMemberForm from '../Components/AddCastMemberForm';

class CreateNewCastMemberView extends Component {
  state = {};
  render() {
    return (
      <Grid divided='vertically' columns={1}>
        <Grid.Row>
          <Grid.Column>
            <MenuBar SeasonId={this.props.SeasonId} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <AddCastMemberForm SeasonId={this.props.SeasonId} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default CreateNewCastMemberView;
