import React from 'react';
import { Grid } from 'semantic-ui-react';
import UserProfile from './UserProfile';
import CreateSeasonButton from './CreateSeasonButton';
import EditProfileButton from './EditProfileButton';
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
        <EditProfileButton />
      </Grid.Column>
    </Grid.Row>
    {props.seasons && props.seasons.map(s => (
      <Grid.Row columns={1}>
        <Grid.Column>
          <SeasonCard
            seasonId={s.id}
            ResourceGroupId={s.ResourceGroupId}
            name={s.name}
            role={s.role}
            type={s.type}
            description={s.description}
          />
        </Grid.Column>
      </Grid.Row>
    ))}
  </Grid>
)
