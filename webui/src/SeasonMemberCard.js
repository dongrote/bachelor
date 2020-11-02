import React from 'react';
import { Card } from 'semantic-ui-react';

export default props => (
  <Card>
    <Card.Content>
      <Card.Header>{props.displayName}</Card.Header>
      <Card.Description>Role: {props.role}</Card.Description>
    </Card.Content>
  </Card>
);
