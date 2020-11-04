import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import io from './websocket';
import { uid } from 'uid';

class EligibleCastMemberCard extends Component {
  state = {hasRose: false};

  async updateHasRose() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/rose`);
    if (res.ok) {
      const json = await res.json();
      this.setState({hasRose: json.findIndex(v => v.SeasonCastMemberId === this.props.castMemberId) > -1});
    }
  }

  handleRoseCreate(event) {
    const {episode, seasonCastMember} = event;
    if (
      episode.SeasonId === this.props.seasonId &&
      episode.number === this.props.episodeNumber &&
      seasonCastMember.id === this.props.castMemberId
    ) {
      this.setState({hasRose: true});
    }
  }

  handleRoseDestroy(event) {
    const {episode, seasonCastMember} = event;
    if (
      episode.SeasonId === this.props.seasonId &&
      episode.number === this.props.episodeNumber &&
      seasonCastMember.id === this.props.castMemberId
    ) {
      this.setState({hasRose: false});
    }
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
    await this.updateHasRose();
  }

  componentWillUnmount() {
    this.uninstallEventHandler('Rose.create');
    this.uninstallEventHandler('Rose.destroy');
  }

  async awardRose() {
    await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/rose`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({castMemberId: this.props.castMemberId})
    });
  }

  async revokeRose() {
    await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/rose`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({castMemberId: this.props.castMemberId})
    });
  }

  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  {this.props.firstName}
                </Grid.Column>
                <Grid.Column textAlign='right'>
                  <Button
                    color={this.state.hasRose ? 'red' : 'green'}
                    content={`${this.state.hasRose ? 'Take' : 'Give'} Rose`}
                    onClick={() => this.state.hasRose ? this.revokeRose() : this.awardRose()}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Header>
        </Card.Content>
      </Card>
    );
  }
}

export default EligibleCastMemberCard;
