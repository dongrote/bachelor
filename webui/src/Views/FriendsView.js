import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import MenuBar from '../Components/MenuBar';

class FriendsView extends Component {
  state = {friends: []};
  render() {
    return (
      <Grid divided='vertically' columns={1}>
        <Grid.Row>
          <Grid.Column>
            <MenuBar SeasonId={this.props.SeasonId} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default FriendsView;
