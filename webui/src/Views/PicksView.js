import React, { Component } from 'react';
import io from '../websocket';
import { uid } from 'uid';
import { Card, Grid, List } from 'semantic-ui-react';
import CastMemberCard from '../Components/CastMemberCard';
import MenuBar from '../Components/MenuBar';

class PicksView extends Component {
  state = {
    castmembers: [],
    picks: [],
    maxRoseCount: 0,
    pickingLocked: false,
    pickLimit: 0,
  };
  async fetchPicks() {
    const res = await fetch(`/api/seasons/${this.props.SeasonId}/picks`);
    if (res.ok) {
      this.setState({picks: await res.json()});
    }
  }
  async fetchCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.SeasonId}/cast`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        maxRoseCount: Math.max(...json.seasonCastMembers.map(x => x.Roses.length)),
        castmembers: json.seasonCastMembers,
      });
    }
  }
  async fetchSeasonDetails() {
    const res = await fetch(`/api/seasons/${this.props.SeasonId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        pickLimit: json.pickLimit,
        pickingLocked: json.pickingLocked,
        seasonName: json.name,
      });
    }
  }

  async handleRoseCreate(event) {
    if (event.seasonCastMember.SeasonId === this.props.SeasonId) await this.fetchCastMembers();
  }

  async handleRoseDestroy(event) {
    if (event.seasonCastMember.SeasonId === this.props.SeasonId) await this.fetchCastMembers();
  }

  installEventHandler(event, handler) {
    handler.instance = this.instanceId;
    io.on(event, handler);
  }

  uninstallEventHandler(event) {
    io.listeners(event)
      .filter(l => l.instance === this.instanceId)
      .forEach(l => io.off(event, l));
  }

  async componentDidMount() {
    this.instanceId = uid();
    const awardRoseHandler = event => this.handleRoseCreate(event);
    const revokeRoseHandler = event => this.handleRoseDestroy(event);
    this.installEventHandler('Rose.create', awardRoseHandler);
    this.installEventHandler('Rose.destroy', revokeRoseHandler);
    await Promise.all([this.fetchPicks(), this.fetchCastMembers(), this.fetchSeasonDetails()]);
  }
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
            <List>
              <List.Item icon={this.state.pickingLocked ? 'lock' : 'unlock'} content={`Picking ${this.state.pickingLocked ? '' : 'un'}locked.`} />
              <List.Item icon='check circle outline' content={`${this.state.pickLimit - this.state.picks.length} Picks left.`} />
            </List>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only='mobile'>
          <Grid.Column>
            <Card.Group centered itemsPerRow={2}>
              {this.state.castmembers
                .filter(castmember => this.state.picks.findIndex(pick => pick.SeasonCastMemberId === castmember.id) > -1)
                .map((castmember, i) => (
                  <CastMemberCard
                    key={i}
                    id={castmember.id}
                    picked={true}
                    firstName={castmember.firstName}
                    lastName={castmember.lastName}
                    age={castmember.age}
                    occupation={castmember.occupation}
                    homeLocation={castmember.homeLocation}
                    roseCount={castmember.Roses.length}
                    eliminated={castmember.Roses.length < this.state.maxRoseCount}
                  />
                ))
              }
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only='tablet computer'>
          <Grid.Column>
            <Card.Group centered itemsPerRow={6}>
              {this.state.castmembers
                .filter(castmember => this.state.picks.findIndex(pick => pick.SeasonCastMemberId === castmember.id) > -1)
                .map((castmember, i) => (
                  <CastMemberCard
                    key={i}
                    id={castmember.id}
                    picked={true}
                    firstName={castmember.firstName}
                    lastName={castmember.lastName}
                    age={castmember.age}
                    occupation={castmember.occupation}
                    homeLocation={castmember.homeLocation}
                    roseCount={castmember.Roses.length}
                    eliminated={castmember.Roses.length < this.state.maxRoseCount}
                  />
                ))
              }
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only='mobile'>
          <Grid.Column>
            <Card.Group centered itemsPerRow={2}>
              {this.state.castmembers
                .filter(castmember => this.state.picks.findIndex(pick => pick.SeasonCastMemberId === castmember.id) === -1)
                .map((castmember, i) => (
                  <CastMemberCard
                    key={i}
                    id={castmember.id}
                    picked={false}
                    firstName={castmember.firstName}
                    lastName={castmember.lastName}
                    age={castmember.age}
                    occupation={castmember.occupation}
                    homeLocation={castmember.homeLocation}
                    roseCount={castmember.Roses.length}
                    eliminated={castmember.Roses.length < this.state.maxRoseCount}
                  />
                ))
              }
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only='tablet computer'>
          <Grid.Column>
            <Card.Group centered itemsPerRow={6}>
              {this.state.castmembers
                .filter(castmember => this.state.picks.findIndex(pick => pick.SeasonCastMemberId === castmember.id) === -1)
                .map((castmember, i) => (
                  <CastMemberCard
                    key={i}
                    id={castmember.id}
                    picked={false}
                    firstName={castmember.firstName}
                    lastName={castmember.lastName}
                    age={castmember.age}
                    occupation={castmember.occupation}
                    homeLocation={castmember.homeLocation}
                    roseCount={castmember.Roses.length}
                    eliminated={castmember.Roses.length < this.state.maxRoseCount}
                  />
                ))
              }
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default PicksView;
