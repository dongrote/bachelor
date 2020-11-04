import React from 'react';
import { Button, Card } from 'semantic-ui-react';

export default props => (
  <Card>
    <Card.Content>
      <Card.Header>{props.displayName}</Card.Header>
      <Card.Meta>System Role: {props.role}</Card.Meta>
      <Card.Description>{props.username}</Card.Description>
    </Card.Content>
    <Card.Content extra>
      idk my bff jill
    </Card.Content>
    <Card.Content extra>
      <Button
        fluid
        icon='sign-out'
        labelPosition='right'
        content='Sign Out'
        onClick={async () => {
          await fetch('/auth/logout');
          props.onSignOut();
        }}
      />
    </Card.Content>
  </Card>
);