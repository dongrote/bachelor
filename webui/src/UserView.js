import React from 'react';
import { Grid } from 'semantic-ui-react';
import UserProfile from './UserProfile';
import CreateSeasonButton from './CreateSeasonButton';
import SeasonCard from './SeasonCard';
import ResourceGroupCard from './ResourceGroupCard';

export default props => (
  <Grid>
    <Grid.Row columns={2}>
      <Grid.Column>
        <UserProfile displayName={props.displayName} username={props.username} role={props.role} />
      </Grid.Column>
      <Grid.Column verticalAlign='middle'>
        <CreateSeasonButton />
      </Grid.Column>
    </Grid.Row>
    {props.seasons && props.seasons.map(s => (
      <Grid.Row columns={1}>
        <Grid.Column>
          <SeasonCard
            name={s.name}
            role={s.role}
            description={s.description}
          />
        </Grid.Column>
      </Grid.Row>
    ))}
    {props.groups && props.groups.map(g => (
      <Grid.Row columns={1}>
        <Grid.Column>
          <ResourceGroupCard
            name={g.name}
            role={g.role}
            description={g.description}
          />
        </Grid.Column>
      </Grid.Row>
    ))}
  </Grid>
)