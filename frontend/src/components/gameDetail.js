import React from 'react';

import removeIcon from '../icons/removeIcon.png';
import thumbDown from '../icons/thumbDown.png';
import playerIcon from '../icons/playerIcon2.png';
import dateIcon from '../icons/dateIcon.png';
import timeIcon from '../icons/timeIcon.png';

class GameDetail extends React.Component {
	state = {
		inPlayersVisible: true
	}

	showOutPlayers = (e) => {
		e.preventDefault();
		if (!this.state.inPlayersVisible) return;
		this.setState({ inPlayersVisible: false })
	}

	showInPlayers = (e) => {
		e.preventDefault();
		if (this.state.inPlayersVisible) return;
		this.setState({ inPlayersVisible: true })
	}

	handleRemoveClick = (e, id) => {
		if (e) e.preventDefault();

		let attending = this.findAttending(id)
		if (attending) this.props.removePlayer(attending)
	}

	switchPlayer = (e, id) => {
		if (e) e.preventDefault();

		let attending = this.findAttending(id)
		if (attending) this.props.switchPlayer(attending)
	}

	findAttending = (id) => {
		return this.props.game.attendance.find(a => a.id === id)
	}

	render() {
		let { game, scheduleTitle, roster } = this.props;
		let toShow = this.state.inPlayersVisible
		let attending = game.attendance.filter(a => a.attending === toShow);

		return (
			<div className='game-detail center-text column half-width'>
				<h2>{scheduleTitle}</h2>
				<p className='game_detail_item p'>
					<img className='game_detail_item icon' src={dateIcon} alt={game.date} />
					<span className='game_detail_item txt'>{game.date}</span>
				</p>
				<p className='game_detail_item p'>
					<img className='game_detail_item icon' src={timeIcon} alt={game.time} />
					<span className='game_detail_item txt'>{game.time}</span>
				</p>
				<div className='game-players'>
					<Players listTitle="Who's In?" attending={attending} roster={roster} removePlayer={this.handleRemoveClick} switchPlayer={this.switchPlayer} inVisible={this.state.inPlayersVisible} inPlayers={this.showInPlayers} outPlayers={this.showOutPlayers} />
				</div>
			</div>
		)
	}
}

export default GameDetail


const Players = ({attending, roster, removePlayer, switchPlayer, listTitle, inVisible, inPlayers, outPlayers}) =>
	<ul>
		<h4>{listTitle}</h4>
		<button className={inVisible ? 'button half-width' : 'button half-width faded'} onClick={inPlayers} >In</button>
		<button className={!inVisible ? 'button half-width' : 'button half-width faded'} onClick={outPlayers} >Out</button>
		{attending.map(a => {
			let isRostered = roster.includes(a.player_id)
			return( 
				<li key={a.player_id} className={isRostered ? 'list__item blue' : 'list__item purple'}>
					<span>{a.name}</span>
					<div className='button__box abs-right abs-top'>
						<IconButton
							id={a.id}
							icon={inVisible ? thumbDown : playerIcon}
							txt={inVisible ? 'Out' : 'In'}
							handleClick={switchPlayer} />
						<IconButton
							id={a.id}
							txt='remove'
							icon={removeIcon}
							handleClick={removePlayer}
							 />
					</div>
				</li>
			)
		})}
	</ul>


const IconButton = ({handleClick, id, txt, icon}) =>
	<button className='icon-button' title={txt} onClick={(e) => handleClick(e, id)}>
		<img src={icon} alt={txt} />
	</button>