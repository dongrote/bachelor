import React from 'react';
import { Card, Grid, Header, Image } from 'semantic-ui-react';

export default props => (
  <Card fluid>
    <Card.Content>
      <Grid columns={2} verticalAlign='top'>
        <Grid.Row>
          <Grid.Column>
            <Image circular size='small' src={`/api/cast/${props.seasonCastMemberId}/photo`} />
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Header content={`${props.firstName} ${props.lastName}`} />
            <p>{props.age} years old</p>
            <p>{props.home}</p>
            <p>{props.occupation}</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card.Content>
    {props.role === 'owner' && (
      <Card.Content extra>
        <form action={`/api/cast/${props.seasonCastMemberId}/photo`} enctype='multipart/form-data' method='post'>
          <input type='file' id='file' name='file' />
          <button type='submit'>Upload</button>
        </form>
      </Card.Content>
    )}
  </Card>
);
