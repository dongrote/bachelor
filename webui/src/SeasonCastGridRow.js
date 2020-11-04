import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import SeasonCastMemberCard from './SeasonCastMemberCard';
import AddCastMemberButton from './AddCastMemberButton';

class SeasonCastGridRow extends Component {
  state = {cast: []};
  async fetchCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/cast`);
    if (res.ok) {
      const json = await res.json();
      console.log('season cast members', json);
      this.setState({cast: json.seasonCastMembers});
    }
  }
  async componentDidMount() {
    await this.fetchCastMembers();
  }
  render() {
    console.log(this.props);
    return (
      <Grid columns={1}>
      <Grid.Row>
        <Grid.Column>
          <Header content='Cast Members' />
          {this.state.cast.map(c => <SeasonCastMemberCard
            firstName={c.firstName}
            lastName={c.lastName}
            age={c.age}
            occupation={c.occupation}
          />)}
        </Grid.Column>
      </Grid.Row>
      {(this.props.role === 'owner' || this.props.role === 'member') && <Grid.Row>
        <Grid.Column>
          <AddCastMemberButton
            seasonId={this.props.seasonId}
            onCreate={() => this.fetchCastMembers()}
          />
        </Grid.Column>
      </Grid.Row>}
      </Grid>
    );
  }
}

export default SeasonCastGridRow;
