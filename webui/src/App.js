import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import LandingView from './Views/LandingView';
import DashboardView from './Views/DashboardView';
import SeasonView from './Views/SeasonView';
import EpisodesView from './Views/EpisodesView';
import EpisodeView from './Views/EpisodeView';
import PicksView from './Views/PicksView';
import FriendsView from './Views/FriendsView';
import CreateNewCastMemberView from './Views/CreateNewCastMemberView';
import CreateNewEpisodeView from './Views/CreateNewEpisodeView';

const App = () => (
  <Container>
    <Switch>
      <Route path='/dashboard'>
        <DashboardView />
      </Route>
      <Route
        exact
        path='/season/:SeasonId'
        render={props => <SeasonView SeasonId={Number(props.match.params.SeasonId)} />}
      />
      <Route
        exact
        path='/season/:SeasonId/cast/new'
        render={props => <CreateNewCastMemberView SeasonId={Number(props.match.params.SeasonId)} />}
      />
      <Route
        exact
        path='/season/:SeasonId/episodes'
        render={props => <EpisodesView SeasonId={Number(props.match.params.SeasonId)} />}
      />
      <Route
        exact
        path='/season/:SeasonId/episodes/new'
        render={props => <CreateNewEpisodeView SeasonId={Number(props.match.params.SeasonId)} />}
      />
      <Route
        exact
        path='/season/:SeasonId/episodes/:EpisodeNumber'
        render={props => <EpisodeView SeasonId={Number(props.match.params.SeasonId)} EpisodeNumber={Number(props.match.params.EpisodeNumber)} />}
      />
      <Route
        exact
        path='/season/:SeasonId/picks'
        render={props => <PicksView SeasonId={Number(props.match.params.SeasonId)} />}
      />
      <Route
        exact
        path='/season/:SeasonId/friends'
        render={props => <FriendsView SeasonId={Number(props.match.params.SeasonId)} />}
      />
      <Route exact path='/'>
        <LandingView />
      </Route>
    </Switch>
  </Container>
);

export default App;
