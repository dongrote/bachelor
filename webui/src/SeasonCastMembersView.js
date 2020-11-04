import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import AddCastMemberButton from './AddCastMemberButton';
import SeasonCastMemberCard from './SeasonCastMemberCard';

class SeasonCastMembersView extends Component {
  state = {cast: []};
  async fetchCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/cast`);
    if (res.ok) {
      const json = await res.json();
      this.setState({cast: json.seasonCastMembers});
    }
  }
  async componentDidMount() {
    await this.fetchCastMembers();
  }
  render() {
    return (
      <Grid columns={1}>
        {this.state.cast.length === 0 && (
          <Grid.Row>
            <Grid.Column>
              No cast members!
            </Grid.Column>
          </Grid.Row>
        )}
        {this.state.cast.map(c => (
          <Grid.Row>
            <Grid.Column>
              <SeasonCastMemberCard
                firstName={c.firstName}
                lastName={c.lastName}
                age={c.age}
                occupation={c.occupation}
                home={c.homeLocation}
              />
            </Grid.Column>
          </Grid.Row>
        ))}
        {this.props.role === 'owner' && (
          <Grid.Row>
            <Grid.Column>
              <AddCastMemberButton seasonId={this.props.seasonId} onCreate={() => this.fetchCastMembers()} />
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    );
  }
}

export default SeasonCastMembersView;
