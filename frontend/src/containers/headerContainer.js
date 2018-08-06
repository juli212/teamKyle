import React from 'react';


class HeaderContainer extends React.Component {
	// constructor(props) {
		// super(props)
		// this.state = {

		// }
	// }

	render() {
		return (
			<header>
				<h1>Team Kyle</h1>
				{this.props.visible && <HeaderMenu /> }
			</header>
		)
	}

}


const HeaderMenu = ({...props}) =>
	<nav>
		<ul>
			<HeaderLink path='/schedule' text='schedule' />
			<HeaderLink path='/roster' text='team' />
		</ul>
	</nav>


const HeaderLink = ({...props}) =>
	<li>
		<a href={props.path} onClick={props.handleClick} >
			{props.text}
		</a>
	</li>


export default HeaderContainer