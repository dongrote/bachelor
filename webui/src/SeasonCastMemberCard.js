import React from 'react';
import { Card } from 'semantic-ui-react';

export default props => (
  <Card fluid>
    <Card.Content>
      <Card.Header>{props.firstName} {props.lastName}</Card.Header>
      <Card.Description>
        <p>Age: {props.age}</p>
        <p>Occupation: {props.occupation}</p>
        {props.home && (
          <p>{props.home}</p>
        )}
      </Card.Description>
    </Card.Content>
  </Card>
);
