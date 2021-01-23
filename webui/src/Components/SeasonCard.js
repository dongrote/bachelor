import React from 'react';
import { Card } from 'semantic-ui-react';

const SeasonCard = props => (
  <Card fluid>
    <Card.Content>
      <Card.Header>{props.name}</Card.Header>
      <Card.Meta>{props.type}</Card.Meta>
      <Card.Description>{props.description}</Card.Description>
    </Card.Content>
  </Card>
);

export default SeasonCard;
