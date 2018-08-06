import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';


ReactDOM.render(
	<Router>
			<Switch>
				<Route exact path='/schedule/:sched_id/:game_id' component={App} />
				<Route exact path='/schedule/:sched_id' component={App} />
				<Route exact path='/' component={App} />
				<Route path="*" component={()=>(<div><p>Page Not Found</p></div>)} />
			</Switch>
	</Router>,
	document.getElementById('root'));

registerServiceWorker();


    // if (params.game_id && params.game_id !== prevParams.game_id) {
    //   let game = this.state.games.find(g => g.id.toString() === params.game_id) || null
    //   this.setState({ game: game })
    //   if (!game && this.state.schedule) {
    //     this.updateURL(`/schedule/${this.state.schedule.id}`)
    //   } else if (!game) {
    //     this.updateURL('/')
    //   }
    // } else if (params.sched_id && params.sched_id !== prevParams.sched_id) {
    //   let sched = this.state.schedules.find(s => s.id.toString() === params.sched_id) || null
    //   this.setState({ schedule: sched, game: null })
      
    //   if (sched) {
    //     this.fetch('games', `season_id=${sched.id}`)
    //   } else {
    //     this.updateURL('/')
    //   }
    // }
