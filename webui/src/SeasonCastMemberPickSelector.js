import React, { Component } from 'react';
import { Card, Grid, Header, Icon } from 'semantic-ui-react';
import SeasonCastMemberCardContent from './SeasonCastMemberCardContent';

class SeasonCastMemberPickSelector extends Component {
  state = {castMembers: [], picksLeft: null};

  async fetchCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/cast`);
    if (res.ok) {
      const json = await res.json();
      console.log(json.seasonCastMembers);
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
    const markedCastMembers = castMembers.map(cm => ({
      id: cm.id,
      firstName: cm.firstName,
      lastName: cm.lastName,
      home: cm.homeLocation,
      occupation: cm.occupation,
      age: cm.age,
      roseCount: cm.Roses.length,
      selected: picks.findIndex(pick => pick.SeasonCastMemberId === cm.id) !== -1,
    }));
    markedCastMembers.sort((left, right) => {
      if (left.selected === right.selected) return 0;
      return left.selected && !right.selected ? -1 : 1;
    });
    this.setState({
      picksLeft: season.pickLimit - picks.length,
      castMembers: markedCastMembers,
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
          <Grid.Row key={i} columns={1}>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  <SeasonCastMemberCardContent
                    seasonCastMemberId={castMember.id}
                    firstName={castMember.firstName}
                    lastName={castMember.lastName}
                    age={castMember.age}
                    home={castMember.home}
                    occupation={castMember.occupation}
                  />
                </Card.Content>
                <Card.Content extra>
                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column>
                        <Icon color='red' name='heart' /> {castMember.roseCount} Rose{castMember.roseCount === 1 ? '' : 's'}
                      </Grid.Column>
                      <Grid.Column textAlign='right'>
                        <Icon
                          size='large'
                          name={`${castMember.selected ? 'check ' : ''}square outline`}
                          onClick={() => castMember.selected ? this.unmakePick(castMember.id) : this.makePick(castMember.id)}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    );
  }
}
export default SeasonCastMemberPickSelector;
