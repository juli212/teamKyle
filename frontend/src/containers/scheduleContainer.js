import React from 'react';


class ScheduleContainer extends React.Component {

	render() {
		let { schedules, games, selectedGame, selectedSchedule, selectSchedule, selectGame } = this.props;
		let selected = selectedSchedule ? selectedSchedule.id : 0

		return(
			<div className='row' >
				<ScheduleDropdown
					schedules={schedules}
					selected={selected}
					selectSchedule={selectSchedule} />
				<ScheduleGames games={games} selectGame={selectGame} selected={selectedGame} />
			</div>
		)
	}
}

const ScheduleDropdown = ({schedules, selected, selectSchedule}) =>
	<select className='row__element fixed left' value={selected} onChange={(e) => selectSchedule(e)}>
		<option disabled value={0}>Select Schedule</option>
		{schedules && schedules.map(sched => {
			return(
				<option key={sched.id} value={sched.id}>{sched.title}</option>
			)
		})}
	</select>

const ScheduleGames = ({games, selected, selectGame}) =>
	<div className='schedule-games row__element fluid right'>
		<div className='inner-scroll'>
			{games && games.length > 0 && games.map(g => {
				return(
					<button key={g.id} className={(selected && g.id === selected.id) ? 'game-button selected' : 'game-button'} onClick={(e) =>selectGame(e, g.id)} >
						<p>{g.day}</p>
						<p>{g.date_time}</p>
					</button>
				)
			})}
		</div>
	</div>


export default ScheduleContainer