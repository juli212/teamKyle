import React from 'react';
import axios from './config-axios.js';

import removeIcon from '../icons/removeIcon.png';
import thumbDown from '../icons/thumbDown.png';
import playerIcon from '../icons/playerIcon2.png';
import groupIcon from '../icons/groupIcon.png';

import { BaseURL } from './constants.js';

class Players extends React.Component {
	state = {
		newPlayer: {
			name: ''
		},
		newPlayerFormVisible: false
	}

	handleInputChange = (e) => {
		let val = e.target.value
		let player = this.state.newPlayer
		player.name = val
		this.setState({ player: player })
	}

	toggleNewPlayerFormVisibility = () => {
		let visibility = this.state.newPlayerFormVisible
		this.setState({newPlayerFormVisible: !visibility})
	}

	createPlayer = (e) => {
		if (e) e.preventDefault();

		let player = this.state.newPlayer
		if (player.name.trim() === '') return;

		let url = `${BaseURL}/players/`

	  axios.post(url, player)
    .then(response => {
			this.props.addPlayerToPool(response.data)
			this.hideForm(null)
		})
		.catch((err) => {
			console.log(err);
		})
	}

	hideForm = (e) => {
		if (e) e.preventDefault();
		let newPlayer = {
			name: ''
		}
		this.setState({
			newPlayer: newPlayer,
			newPlayerFormVisible: false
		})
	}

	visiblePlayers(v) {
		return v.subs && v.roster ? 'all' : v.subs ? 'subs' : 'roster'
	}

	render() {
		let { players, visibility, schedule, game} = this.props;
		let roster = schedule ? schedule.roster : null
		let visiblePlayers = this.visiblePlayers(visibility)
		let attendingPlayers = game ? game.attendance : null

		if (roster && visiblePlayers === 'subs') players = players.filter(p => !roster.includes(p.id) )
		if (roster && visiblePlayers === 'roster') players = players.filter(p => roster.includes(p.id) )

		return(
			<div className='player-list half-width column'>
				<ul>
					<h4>Playas</h4>
					{roster && <button
						className={visibility.roster ? 'button half-width' : 'button half-width faded'}
						onClick={this.props.toggleRosterVisible}>Roster</button>}
					{roster &&	<button
						className={visibility.subs ? 'button half-width purple' : 'button half-width purple faded'}
						onClick={this.props.toggleSubsVisible}>Subs</button>}
					{players && players.length > 0 && players.map(p => {
						let isAttending = attendingPlayers ? !!attendingPlayers.find(a => a.player_id === p.id) : false
						let isRostered = roster ? roster.includes(p.id) : false

						return (
							<Player
								canMove={!!game}
								player={p}
								key={p.id}
								canUpdateRoster={!!roster}
								isRostered={isRostered}
								updateRosterPlayer={this.props.updateRosterPlayer}
								addPlayer={this.props.addPlayer}
								isAttending={isAttending} />)
					})}
					<li className='list_item_form'>
						{!this.state.newPlayerFormVisible && <button onClick={this.toggleNewPlayerFormVisibility} >Add Player</button>}
						{this.state.newPlayerFormVisible && <NewPlayerForm player={this.state.newPlayer} handleSubmit={this.createPlayer} handleInputChange={this.handleInputChange} hideForm={this.hideForm} />}
					</li>
				</ul>
			</div>
		)
	}
}


export default Players


const Player = ({player, addPlayer, canMove, isAttending, isRostered, updateRosterPlayer, canUpdateRoster}) => {
	let classes = ['list__item']
	if (isAttending) classes.push('faded')
	isRostered ? classes.push('bold', 'blue') : canUpdateRoster ? classes.push('purple') : null

	return(<li className={classes.join(' ')}>
		<span>{player.name}</span>
		<div className='button__box abs-right abs-top'>
			{canUpdateRoster && 
				<IconButton
					handleClick={updateRosterPlayer}
					id={player.id}
					txt={isRostered ? '-' : '+'}
					icon={isRostered ? removeIcon : groupIcon}
					val={null} title={isRostered ? 'Take off roster' : 'Add to Roster'} />}

			{canMove && !isAttending &&
				<IconButton
					handleClick={addPlayer}
					id={player.id}
					txt='IN'
					val={true}
					icon={playerIcon}
					title="I'm in!" /> }

			{canMove && !isAttending &&
				<IconButton
					disabled={!isRostered}
					handleClick={addPlayer}
					id={player.id} txt='OUT'
					val={false}
					icon={thumbDown}
					title="Can't make it" />}
			</div>
	</li>)
}


const IconButton = ({handleClick, id, icon, txt, val, title, disabled}) =>
	<button className={disabled ? 'icon-button faded' : 'icon-button'} disabled={disabled} onClick={(e) => handleClick(e, id)} title={title} value={val}>
		<img src={icon} alt={txt} />
	</button>


const NewPlayerForm = ({...props}) =>
	<form onSubmit={props.handleSubmit}>
		<input
			type='text'
			name='name'
			placeholder='name'
			value={props.player.name}
			onChange={props.handleInputChange} />
		<input type='submit' />
		<a href='/' className='cancel-link' onClick={props.hideForm}>cancel</a>
	</form>