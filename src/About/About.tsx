import React from 'react';
import FreeBoardGameBar from '../App/FreeBoardGameBar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { t } from 'ttag';

class About extends React.Component<{}, {}> {
  render() {
    return (
      <FreeBoardGameBar>
        {this._getAboutCard()}
        {this._getContributorsCard()}
        {this._getCreditsCard()}
      </FreeBoardGameBar>
    );
  }

  _getAboutCard() {
    return (
      <Card style={{ marginTop: '16px' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {t`about.header`}
          </Typography>
          <Typography component="p">{t`about.p`}</Typography>
        </CardContent>
      </Card>
    );
  }

  _getContributorsCard() {
    return (
      <Card style={{ marginTop: '16px' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {t`about.contributors`}
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="flamecoals" />
              <Button size="small" color="primary" href="https://github.com/flamecoals">
                GitHub
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="JasonHarrison" />
              <Button size="small" color="primary" href="https://www.jasonharrison.us/?from=freeboardgame.org">
                Website
              </Button>
              <Button size="small" color="primary" href="https://github.com/jasonharrison">
                GitHub
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="JosefKuchar" />
              <Button size="small" color="primary" href="http://josefkuchar.com">
                Website
              </Button>
              <Button size="small" color="primary" href="https://github.com/JosefKuchar">
                GitHub
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }

  _getCreditsCard() {
    return (
      <Card style={{ marginTop: '16px' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {t`about.credits`}
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Chess move sound by SpliceSound" />
              <Button size="small" color="primary" href="https://freesound.org/people/SpliceSound/sounds/218333/">
                freesound.org
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Seabattle hit sound by fridobeck" />
              <Button size="small" color="primary" href="https://freesound.org/people/fridobeck/sounds/191694/">
                freesound.org
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Seabattle hit sound by qubodup" />
              <Button size="small" color="primary" href="https://freesound.org/people/qubodup/sounds/182429/">
                freesound.org
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Seabattle miss sound by InspectorJ" />
              <Button size="small" color="primary" href="https://freesound.org/people/InspectorJ/sounds/352103/">
                freesound.org
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Seabattle miss sound by CGEffex" />
              <Button size="small" color="primary" href="https://freesound.org/people/CGEffex/sounds/98335/">
                freesound.org
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Blox font (used in logo) by Brian Kent" />
              <Button size="small" color="primary" href="https://www.dafont.com/blox.font">
                dafont.com
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }
}

export default About;
