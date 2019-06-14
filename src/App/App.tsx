import React from 'react';
import { Switch, Route } from 'react-router-dom';
import GameInfo from './Game/GameInfoAsync';
import Game from './Game/GameAsync';
import { NewRoom } from './Lobby/NewRoom';
import { Room } from './Lobby/Room';
import Home from '../Home/HomeAsync';
import About from '../About/AboutAsync';
import getMessagePage from './MessagePage';
import ReactGA from 'react-ga';
import { getPageMetadata } from '../metadata';
import { registerLang, setCurrentLocale } from '@freeboardgame.org/i18n';
import translations from './translations';
import SSRHelper from './Helpers/SSRHelper';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ScrollToTop from './ScrollToTop';

ReactGA.initialize('UA-105391878-1');

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const withScrollToTop = (WrappedComponent: any) => {
  class Wrapper extends React.Component<{}, {}> {
    render() {
      return (
        <ScrollToTop>
          <WrappedComponent {...this.props} />
        </ScrollToTop>
      );
    }
  }
  return Wrapper;
};

const withGA = (WrappedComponent: any) => {
  class Wrapper extends React.Component<{}, {}> {
    render() {
      if (!SSRHelper.isSSR()) {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return Wrapper;
};

const withI18n = (WrappedComponent: any) => {
  class Wrapper extends React.Component<any, {}> {
    render() {
      const locale = this.props.match.params.locale;
      if (locale === 'en' || (locale && !(locale in translations))) {
        const ErrorPage = withWrappers(getMessagePage('error', 'messagePage.invalidLocale'));
        // pass newProps instead of this.props to avoid an infinite-loop (because of this.props.match.params.locale)
        const newProps = { ...this.props, match: { params: { locale: '' } } };
        return <ErrorPage {...newProps} />;
      }
      // set language based on URL, default to English
      const lang = locale || 'en';
      registerLang('en', translations.en);
      if (lang !== 'en') {
        registerLang(lang, translations[lang]);
      }
      setCurrentLocale(lang);
      return <WrappedComponent {...this.props} />;
    }
  }
  return Wrapper;
};

const withWrappers = (WrappedComponent: any) => {
  return withScrollToTop(withI18n(withGA(WrappedComponent)));
};

const BASEPATH = '/:locale([A-Za-z]{2})?';

class Main extends React.Component<{}, {}> {
  render() {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      document.title = getPageMetadata(window.location.pathname).title;
    }
    return (
      <MuiThemeProvider theme={theme}>
        <Switch>
          <Route exact={true} path={BASEPATH} component={withWrappers(Home)} />
          <Route exact={true} path={`${BASEPATH}/about`} component={withWrappers(About)} />
          <Route exact={true} path={`${BASEPATH}/g/:gameCode`} component={withWrappers(GameInfo)} />
          <Route exact={true} path={`${BASEPATH}/g/:gameCode/:mode`} component={withWrappers(Game)} />
          <Route exact={true} path={`${BASEPATH}/g/:gameCode/:mode/:aiLevel`} component={withWrappers(Game)} />
          <Route
            exact={true}
            path={`${BASEPATH}/g/:gameCode/:mode/:matchCode/:playerID`}
            component={withWrappers(Game)}
          />
          <Route path={`${BASEPATH}/room/new/:gameCode/:numPlayers`} exact={true} component={withWrappers(NewRoom)} />
          <Route path={`${BASEPATH}/room/:gameCode/:roomID`} exact={true} component={withWrappers(Room)} />
          <Route exact={true} component={withWrappers(getMessagePage('error', 'Not Found'))} />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default Main;
