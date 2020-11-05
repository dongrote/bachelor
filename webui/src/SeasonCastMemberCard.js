import React from 'react';
import { Card } from 'semantic-ui-react';
import SeasonCastMemberCardContent from './SeasonCastMemberCardContent';

export default props => (
  <Card fluid>
    <Card.Content>
      <SeasonCastMemberCardContent
        seasonCastMemberId={props.seasonCastMemberId}
        firstName={props.firstName}
        lastName={props.lastName}
        age={props.age}
        home={props.home}
        occupation={props.occupation}
      />
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
