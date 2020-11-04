import React, { Component } from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';

class SeasonCastMemberPickSelector extends Component {
  state = {castMembers: [], picksLeft: null};

  async fetchCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/cast`);
    if (res.ok) {
      const json = await res.json();
      return json.seasonCastMembers;
    }
  }

  async fetchPicks() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/picks`);
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  }

  async fetchSeason() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}`);
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  }

  async populate() {
    const castMembers = await this.fetchCastMembers(),
      picks = await this.fetchPicks(),
      season = await this.fetchSeason();
    this.setState({
      picksLeft: season.pickLimit - picks.length,
      castMembers: castMembers.map(cm => ({
        id: cm.id,
        firstName: cm.firstName,
        lastName: cm.lastName,
        selected: picks.findIndex(pick => pick.SeasonCastMemberId === cm.id) !== -1,
      }))
    });
  }

  async makePick(seasonCastMemberId) {
    await fetch(`/api/seasons/${this.props.seasonId}/picks`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({seasonCastMemberId})
    });
    await this.populate();
  }

  async unmakePick(seasonCastMemberId) {
    await fetch(`/api/seasons/${this.props.seasonId}/picks`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({seasonCastMemberId})
    });
    await this.populate();
  }

  async componentDidMount() {
    await this.populate();
  }

  render() {
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header content='Make a Pick'/>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            Picks left {this.state.picksLeft}
          </Grid.Column>
        </Grid.Row>
        {this.state.castMembers.map((castMember, i) => (
          <Grid.Row key={i} columns={2}>
            <Grid.Column>
              {castMember.firstName}
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Icon
                size='large'
                name={`${castMember.selected ? 'check ' : ''}square outline`}
                onClick={() => castMember.selected ? this.unmakePick(castMember.id) : this.makePick(castMember.id)}
              />
            </Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    );
  }
}
export default SeasonCastMemberPickSelector;
