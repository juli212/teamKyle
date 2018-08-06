import React from 'react';
import Players from '../components/players.js';
import GameDetail from '../components/gameDetail.js';
import ScheduleContainer from './scheduleContainer.js';
import ScheduleMenu from '../components/scheduleMenu.js';


class Content extends React.Component {
	state = {
		visibility: {
			players: true,
			roster: true,
			subs: false
		}
	}


	addPlayer = (e, id) => {
		if (e) e.preventDefault();
		if (!this.props.game) return;

		let val = e.target.parentElement.value
		let attending = {
			player: id,
			game: this.props.game.id,
			attending: val
		}

		this.props.createPlayerAttendance(attending)
	}

	selectSchedule = (e) => {
		if (e) e.preventDefault();
		let id = e.target.value
		this.props.setSchedule(id);
	}

	selectGame = (e, id) => {
		if (e) e.preventDefault();
		this.props.setGame(id);
	}

	toggleRosterVisible = () => {
		let visibility = this.state.visibility
		let visible = visibility.roster
		visibility.roster = !visible
		this.setState({visibility: visibility})
	}

	toggleSubsVisible = () => {
		let visibility = this.state.visibility
		let visible = visibility.subs
		visibility.subs = !visible
		this.setState({visibility: visibility})
	}

	updateRosterPlayer = (e, id) => {
		e.preventDefault();

		this.props.addRemoveRosterPlayer(id)
	}

	render() {
		let visibility = this.state.visibility
		let {games, players, schedules, game, schedule} = this.props
		let scheduleTitle = schedule ? schedule.title : 'No Schedule Selected'

		return (
			<div>
				<ScheduleContainer
					schedules={schedules}
					games={games}
					selectGame={this.selectGame}
					selectedGame={game}
					selectedSchedule={schedule}
					selectSchedule={this.selectSchedule} />
				{schedule && <ScheduleMenu schedule={schedule} addGame={this.props.addScheduleGame} />}
				<Players
					players={players}
					visibility={visibility}
					game={game}
					schedule={schedule}
					toggleSubsVisible={this.toggleSubsVisible}
					toggleRosterVisible={this.toggleRosterVisible}
					addPlayer={this.addPlayer}
					updateRosterPlayer={this.updateRosterPlayer}
					addPlayerToPool={this.props.addPlayerToPool} />
				{schedule && game && <GameDetail
					game={game}
					roster={schedule.roster}
					removePlayer={this.props.deletePlayerAttendance}
					switchPlayer={this.props.updatePlayerAttendance}
					scheduleTitle={scheduleTitle} /> }
			</div>
		)
	}
}

export default Content


