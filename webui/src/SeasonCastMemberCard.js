import React from 'react';
import { Card, Image } from 'semantic-ui-react';

export default props => (
  <Card fluid>
    <Card.Content>
      <Card.Header>
        <Image circular avatar src={`/api/cast/${props.seasonCastMemberId}/photo`} />
        {props.firstName} {props.lastName}
      </Card.Header>
      <Card.Description>
        <p>Age: {props.age}</p>
        <p>Occupation: {props.occupation}</p>
        {props.home && (
          <p>{props.home}</p>
        )}
      </Card.Description>
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
