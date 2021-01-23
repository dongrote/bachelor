import React from 'react';
import { Card } from 'semantic-ui-react';

const EpisodeCard = props => (
  <Card>
    <Card.Content header={props.name} />
    <Card.Content description={`Episode number ${props.num}`} />
  </Card>
);

export default EpisodeCard;
