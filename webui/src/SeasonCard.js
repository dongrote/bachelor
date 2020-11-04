import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import SeasonView from './SeasonView';

class SeasonCard extends Component {
  state = {showCard: true};
  render() {
    return this.state.showCard
      ? (
        <Card fluid onClick={() => this.setState({showCard: false})}>
          <Card.Content>
            <Card.Header>{this.props.name}</Card.Header>
            <Card.Meta>{this.props.type}</Card.Meta>
            <Card.Description>{this.props.description}</Card.Description>
          </Card.Content>
        </Card>
      )
      : <SeasonView
          seasonId={this.props.seasonId}
          seasonName={this.props.name}
          seasonDescription={this.props.description}
          seasonType={this.props.type}
          ResourceGroupId={this.props.ResourceGroupId}
          role={this.props.role}
          onHide={() => this.setState({showCard: true})}
        />;
  }
}

export default SeasonCard;
