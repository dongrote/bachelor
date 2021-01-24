import React, { Component } from 'react';
import io from '../websocket';
import { uid } from 'uid';
import { Link } from 'react-router-dom';
import { Button, Card, Grid, Header, Icon, Placeholder } from 'semantic-ui-react';
import CastMemberCard from '../Components/CastMemberCard';
import MenuBar from '../Components/MenuBar';

class SeasonView extends Component {
  state = {
    seasonName: '',
    pickingLocked: false,
    pickLimit: 0,
    maxRoseCount: 0,
    cast: [],
    picks: [],
    userRole: null,
  };
  async fetchUserGroupRole() {
    const [profile, season] = await Promise.all([
      fetch('/api/users/profile').then(res => res.json()),
      fetch(`/api/seasons/${this.props.SeasonId}`).then(res => res.json()),
    ]);
    const seasonGroup = profile.groups.find(group => group.id === season.ResourceGroupId);
    this.setState({userRole: seasonGroup.role});
  }
  async fetchCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.SeasonId}/cast`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        maxRoseCount: Math.max(...json.seasonCastMembers.map(x => x.Roses.length)),
        cast: json.seasonCastMembers,
      });
    }
  }
  async fetchPicks() {
    const res = await fetch(`/api/seasons/${this.props.SeasonId}/picks`);
    if (res.ok) {
      this.setState({picks: await res.json()});
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
    await Promise.all([this.fetchSeasonDetails(), this.fetchCastMembers(), this.fetchPicks(), this.fetchUserGroupRole()]);
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
            <Grid divided columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Header content={this.state.seasonName} />
                  <Icon name={this.state.pickingLocked ? 'lock' : 'lock open'} /> Picking {this.state.pickingLocked ? '' : 'un'}locked.
                  <br />
                  <Icon name='check square outline' /> Permitted picks: {this.state.pickLimit}
                  <br />
                  {this.state.userRole === 'owner' && (
                    <Grid stackable columns={2}>
                      <Grid.Row>
                        <Grid.Column>
                          <Link to={`/season/${this.props.SeasonId}/episodes/new`}>
                            <Button basic primary icon='plus' content='Add New Episode' />
                          </Link>
                        </Grid.Column>
                        <Grid.Column>
                          <Link to={`/season/${this.props.SeasonId}/cast/new`}>
                            <Button basic primary icon='plus' content='Add New Cast Member' />
                          </Link>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  )}
                </Grid.Column>
                <Grid.Column>
                  <Placeholder>
                    <Placeholder.Header image>
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                      <Placeholder.Line length='short' />
                      <Placeholder.Line length='medium' />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only='tablet computer'>
          <Grid.Column>
            <Card.Group centered itemsPerRow={6}>
              {this.state.cast.map((castmember, i) => (
                <CastMemberCard
                  key={i}
                  id={castmember.id}
                  age={castmember.age}
                  homeLocation={castmember.homeLocation}
                  firstName={castmember.firstName}
                  lastName={castmember.lastName}
                  occupation={castmember.occupation}
                  roseCount={castmember.Roses.length}
                  eliminated={castmember.Roses.length < this.state.maxRoseCount}
                  picked={this.state.picks.findIndex(pick => pick.SeasonCastMemberId === castmember.id) > -1}
                />
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only='mobile'>
          <Grid.Column>
            <Card.Group centered itemsPerRow={2}>
              {this.state.userRole === 'owner' && (
                <Card raised onClick={() => alert('add new cast member')}>
                  <Icon name='plus' size='huge' color='black' />
                  <Card.Content>
                    <Card.Header>Add New Cast Member</Card.Header>
                  </Card.Content>
                </Card>
              )}
              {this.state.cast.map((castmember, i) => (
                <CastMemberCard
                  key={i}
                  id={castmember.id}
                  age={castmember.age}
                  homeLocation={castmember.homeLocation}
                  firstName={castmember.firstName}
                  lastName={castmember.lastName}
                  occupation={castmember.occupation}
                  roseCount={castmember.Roses.length}
                  eliminated={castmember.Roses.length < this.state.maxRoseCount}
                />
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SeasonView;
