import React from 'react';
// import logo from './logo.svg';
import './App.css';

import ContentContainer from './containers/contentContainer.js';
import HeaderContainer from './containers/headerContainer.js';
import FooterContainer from './containers/footerContainer.js';
import axios from './components/config-axios.js';
import { BaseURL } from './components/constants.js';


class App extends React.Component {
  state = {
    loading: false,
    menuVisible: false,
    // message: null,
    games: [],
    players: [],
    schedules: [],
    game: null,
    schedule: null
  }


  componentDidMount = () => {
    this.fetch('players');
    this.fetch('schedules');
  }

  componentDidUpdate = (prevProps, prevState) => {
    let params = this.props.match.params
    let prevParams = prevProps.match.params

    if (!this.state.game) {
      if ( (this.state.games.length > 0 && this.state.games !== prevState.games) || (params.sched_id && prevParams.sched_id !== params.sched_id) ) {
        this.updateURL(`/schedule/${params.sched_id}`)
      }
    }
    if (params.game_id && this.state.games.length > 0) {
      this.setGame(params.game_id)
    } else if (params.sched_id && this.state.schedules.length > 0) {
      this.setSchedule(params.sched_id)
    }
  } 

  fetch = (path, params=null) => {
    let url = params ? `${BaseURL}/${path}.json?${params}` : `${BaseURL}/${path}.json`

    axios.get(url)
    .then(res => {
      this.setState({
        [path]: res.data
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  updateURL = (path) => {
    this.props.history.push(path);
  }

  setSchedule = (id) => {
    let schedule = this.state.schedules.find(s => s.id.toString() === id.toString()) || null

    if (schedule !== this.state.schedule) {
      this.setState({
        schedule: schedule,
        game: null
      })

      if (schedule) {
        this.fetch('games', `season_id=${id}`)
        if (this.props.match.params.game_id) {
          this.updateURL(`/schedule/${id}/${this.props.match.params.game_id}`)
        } else {
          this.updateURL(`/schedule/${id}`)
        } 
      } else {
        this.updateURL('/')
      }
    }
  }

  setGame = (id) => {
    let game = this.state.games.find(g => g.id.toString() === id.toString()) || null

    if (game !== this.state.game && this.state.schedule) {
      this.setState({ game: game })
      this.updateURL(`/schedule/${this.state.schedule.id}/${id}`)
    } else if (!this.state.schedule) {
      this.setState({ game: null })
      this.updateURL('/')
    }
  }

  addPlayerToPool = (player) => {
    let players = this.sortPlayers([...this.state.players, player])
    this.setState({ players: players })
  }

  addPlayerToGame = (attending) => {
    let game = this.state.game
    game.attendance = this.sortPlayers([...game.attendance, attending])
    this.setState({ game: game })
  }

  createPlayerAttendance = (attending) => {
    let url = `${BaseURL}/attending/`

    axios.post(url, attending)
    .then(response => {
      this.addPlayerToGame(response.data)
    })
    .catch(err => {
      console.log(err);
    })
  }

  deletePlayerAttendance = async (attending) => {
    let id = attending.id
    let game = this.state.game
    let params = {id: id}
    let url = `${BaseURL}/attending/${id}/`

    let remove = await axios.delete(url, {
      params: params
    })
    .then(res => {
      return true
    })
    .catch(err => {
      return false
    })

    if (remove) {
      game.attendance = game.attendance.filter(a => a.id !== id)
      this.setState({ game: game })
    }
  }

  updatePlayerAttendance = (attending) => {
    let isAttending = !attending.attending
    let url = `${BaseURL}/attending/${attending.id}/`
    let params = {attending: isAttending}

    axios.patch(url, params)
    .then(res => {
      let game = this.state.game
      game.attendance.find(a => a.id === res.data.id).attending = res.data.attending
      this.setState({ game: game })
    })
    .catch(err => {
      console.log(err)
    })
  }

  addRemoveRosterPlayer = (id) => {
    let sched = this.state.schedule
    
    let params = {
      player_id: id
    }

    let url = `${BaseURL}/schedules/${sched.id}/player/`
    axios.post(url, params)
    .then(response => {
      this.setState({ schedule: response.data })
    })
    .catch(err => {
      console.log(err)
    })

  }

  addScheduleGame = (game) => {
    let params = {
      time: game.time,
      date: game.date,
      season: game.season ? game.season : this.state.schedule.id
    }
    let url = `${BaseURL}/games/`

    axios.post(url, params)
    .then(res => {
      let games = [...this.state.games, res.data]

      games.sort(function(a,b){
        if (a.date !== b.date) {
          return new Date(a.date) - new Date(b.date);
        }
        return (a.time - b.time);
      });

      this.setState({ games: games })
    })
    .catch(err => {
      console.log(err)
    })
  }

  sortPlayers = (players) => {
    return players.sort((a,b) => {
      return a.name > b.name;
    });
  }

  render = () => {
    let { loading, menuVisible, games, players, schedules, game, schedule } = this.state

    return (
      <div className='app'>
        <HeaderContainer visible={menuVisible} />
        <ContentContainer
          loading={loading}
          games={games}
          players={players}
          schedules={schedules}
          game={game}
          schedule={schedule}
          setSchedule={this.setSchedule}
          setGame={this.setGame}
          addPlayerToPool={this.addPlayerToPool}
          createPlayerAttendance={this.createPlayerAttendance}
          deletePlayerAttendance={this.deletePlayerAttendance}
          updatePlayerAttendance={this.updatePlayerAttendance}
          addRemoveRosterPlayer={this.addRemoveRosterPlayer}
          addScheduleGame={this.addScheduleGame}
          />
        <FooterContainer />
      </div>
    );
  }
}

export default App;
