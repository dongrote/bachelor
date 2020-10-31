import React from 'react';
import { Card } from 'semantic-ui-react';

export default props => (
  <Card>
    <Card.Content>
      <Card.Header>{props.displayName}</Card.Header>
      <Card.Meta>{props.username}</Card.Meta>
    </Card.Content>
    <Card.Content extra>
      idk my bff jill
    </Card.Content>
  </Card>
);