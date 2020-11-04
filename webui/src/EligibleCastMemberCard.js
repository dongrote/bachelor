import React from 'react';
import { Card, Grid, Header, Button } from 'semantic-ui-react';

export default props => (
  <Card fluid>
    <Card.Content>
      <Card.Header>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Header content={props.firstName} />
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Button
                color={props.hasRose ? 'red' : 'green'}
                content={`${props.hasRose ? 'Take' : 'Give'} Rose`}
                onClick={props.onClick}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Header>
    </Card.Content>
  </Card>
);
