import React, { Component } from 'react';
import { Card, Grid, Header, Icon, Image } from 'semantic-ui-react';

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
                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column>
                        <Image circular size='tiny' src={`/api/cast/${castMember.id}/photo`} />
                      </Grid.Column>
                      <Grid.Column textAlign='right' verticalAlign='bottom'>
                        <Header content={castMember.firstName} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
                <Card.Content extra>
                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column>Roses: {castMember.roseCount}</Grid.Column>
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
