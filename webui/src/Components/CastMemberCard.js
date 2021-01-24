import React from 'react';
import { Card, Dimmer, Icon, Image } from 'semantic-ui-react';

const CastMemberCard = props => (  
  <Card raised onClick={() => { if (props.onClick) props.onClick(); }}>
    <Dimmer.Dimmable blurring dimmed={props.eliminated}>
      <Image src={`/api/cast/${props.id}/photo`} />
    </Dimmer.Dimmable>
    <Card.Content>
      <Card.Header>
        {props.firstName} {props.lastName}
        {props.picked && <Icon color='blue' name='check circle outline' />}
      </Card.Header>
      {props.age && <Card.Meta>{props.age} years old</Card.Meta>}
    </Card.Content>
    {props.occupation && (<Card.Content extra>{props.occupation}</Card.Content>)}
    {props.homeLocation && (<Card.Content extra>{props.homeLocation}</Card.Content>)}
    {props.roseCount !== null && (
      <Card.Content extra>
        <Icon name='heart' color='red' /> {props.roseCount} Rose{props.roseCount === 1 ? '' : 's'}
      </Card.Content>
    )}
  </Card>
);

export default CastMemberCard;
