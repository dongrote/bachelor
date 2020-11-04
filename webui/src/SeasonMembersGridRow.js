import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import SeasonMemberCard from './SeasonMemberCard';
import AddSeasonMemberButton from './AddSeasonMemberButton';

export default props => (
  <Grid columns={1}>
    <Grid.Row>
      <Grid.Column>
        <Header content='Group Members' />
        {props.groupMembers.map(m => (
          <SeasonMemberCard
            userId={m.id}
            displayName={m.displayName}
            role={m.role}
          />
        ))}
      </Grid.Column>
    </Grid.Row>
    {props.role === 'owner' && (
      <Grid.Row>
        <Grid.Column>
          <AddSeasonMemberButton seasonId={props.seasonId} ResourceGroupId={props.ResourceGroupId} />
        </Grid.Column>
      </Grid.Row>
    )}
  </Grid>
);
