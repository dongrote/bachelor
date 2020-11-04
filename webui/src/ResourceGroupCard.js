import React from 'react';
import { Card } from 'semantic-ui-react';

export default props => (
  <Card fluid>
    <Card.Content>
      <Card.Header>{props.name}</Card.Header>
      <Card.Meta>{props.role}</Card.Meta>
      <Card.Description>{props.description}</Card.Description>
    </Card.Content>
  </Card>
);