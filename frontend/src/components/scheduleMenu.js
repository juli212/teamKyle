import React from 'react';


class ScheduleMenu extends React.Component {
	state = {
		newGame: {
			visible: false,
			date: '',
			time: '',
			season: null,
			// field: null,
		}
	}


	toggleNewGameForm = (e) => {
		if (e) e.preventDefault();

		let newGame = this.state.newGame
		newGame.visible = !newGame.visible
		newGame.season = newGame.visible ? this.props.schedule.id : null
		this.setState({ newGame: newGame })
	}

	submitForm = (e) => {
		if (e) e.preventDefault();

		let game = this.state.newGame
		if (game.time.trim() === '' || game.date.trim() === '') return;

		this.props.addGame(game)
		this.setState({
			newGame: {
				visible: false,
				date: '',
				time: '',
				season: null
			}
		})
	}

	updateFormInput = (e) => {
		if (e) e.preventDefault();
		let val = e.target.value
		let field = e.target.name
		let game = this.state.newGame
		game[field] = val
		this.setState({ newGame: game })
	}

	render() {
		let game = this.state.newGame;
		
		return(
			<div className='row'>
				{!game.visible && <button className='icon_button' onClick={this.toggleNewGameForm}>Add Game</button>}
				{game.visible && <NewGameForm game={game} handleInputChange={this.updateFormInput} handleSubmit={this.submitForm} hideForm={this.toggleNewGameForm} />}
				<hr />
			</div>
		)
	}
}


export default ScheduleMenu


const NewGameForm = ({...props}) =>
<form className='row_form' onSubmit={props.handleSubmit}>
	<input type='date' name='date' value={props.game.date} onChange={props.handleInputChange} />
	<input type='time' name='time' value={props.game.time} onChange={props.handleInputChange} />
	<input type='submit' value='Add' />
	<a className='cancel-link' href='/cancel' onClick={props.hideForm} >cancel</a>
</form>