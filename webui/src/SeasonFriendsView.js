import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import AddSeasonMemberButton from './AddSeasonMemberButton';
import SeasonMemberCard from './SeasonMemberCard';

class SeasonFriendsView extends Component {
  state = {friends: []};
  async fetchSeasonFriends() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/members`);
    if (res.ok) {
      const json = await res.json();
      this.setState({friends: json.members});
    }
  }
  async componentDidMount() {
    await this.fetchSeasonFriends();
  }
  render() {
    return (
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column>
            <Header content='Friends' />
          </Grid.Column>
        </Grid.Row>
        {this.state.friends.map(f => (
          <Grid.Row>
            <Grid.Column>
              <SeasonMemberCard
                userId={f.id}
                displayName={f.displayName}
                role={f.role}
              />
            </Grid.Column>
          </Grid.Row>
        ))}
        {this.props.role === 'owner' && (
          <Grid.Row>
            <Grid.Column>
              <AddSeasonMemberButton seasonId={this.props.seasonId} ResourceGroupId={this.props.ResourceGroupId} />
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    );
  }
}

export default SeasonFriendsView;
