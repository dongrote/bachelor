import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import SeasonView from './SeasonView';

class SeasonCard extends Component {
  state = {showCard: true};
  render() {
    return this.showCard
      ? (
        <Card fluid onClick={() => this.setState({showCard: false})}>
          <Card.Content>
            <Card.Header>{props.name}</Card.Header>
            <Card.Meta>{props.role}</Card.Meta>
            <Card.Description>{props.description}</Card.Description>
          </Card.Content>
        </Card>
      )
      : <SeasonView seasonId={props.seasonId} />;
  }
}

export default SeasonCard;
