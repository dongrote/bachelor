import React from 'react';
import { Grid } from 'semantic-ui-react';
import UserProfile from './UserProfile';
import CreateSeasonButton from './CreateSeasonButton';
import SeasonCard from './SeasonCard';

export default props => (
  <Grid>
    <Grid.Row columns={2}>
      <Grid.Column>
        <UserProfile
          displayName={props.displayName}
          username={props.username}
          role={props.role}
          onSignOut={props.onSignOut}
        />
      </Grid.Column>
      <Grid.Column verticalAlign='middle'>
        <CreateSeasonButton onCreate={props.onSeasonCreate} />
      </Grid.Column>
    </Grid.Row>
    {props.seasons && props.seasons.map(s => (
      <Grid.Row columns={1}>
        <Grid.Column>
          <SeasonCard
            seasonId={s.id}
            name={s.name}
            role={s.role}
            description={s.description}
          />
        </Grid.Column>
      </Grid.Row>
    ))}
  </Grid>
)
