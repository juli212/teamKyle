import React from 'react';


export const PlayerList = ({...props}) =>
	<ul className={props.listClasses}>
		{props.players && props.players.length > 0 && players.map(p => {
			<PlayerListItem player={p} key={p.id} classes={props.listItemClasses} />
		})}
	</ul>


const PlayerListItem = ({...props}) =>
	<li className={props.classes}>
		<span>{props.player.name}</span>
		<PlayerButtons visible={props.visible} edit={props.edit} attending={props.attending} clear={props.clear} notAttending={props.notAttending} />
	</li>


const PlayerButtons = ({...props}) => 
	<div className={props.visible ? 'button-row' : 'button-row hide'}>
		{props.edit && <PlayerButton click={props.edit} text='edit' />}
		{props.attending && <PlayerButton click={props.attending} text='attending' />}
		{props.notAttending && <PlayerButton click={props.notAttending} text='not attending' />}
		{props.clear && <PlayerButton click={props.clear} text='reset' />}
	</div>


const PlayerButton = ({...props}) =>
	<button onClick={props.click}>{props.text}</button>