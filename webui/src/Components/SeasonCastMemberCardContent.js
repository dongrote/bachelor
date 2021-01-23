import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';

export default props => (
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
);