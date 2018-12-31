import React from 'react';
import MatchData from './matchData';

class MatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches:[],
      maxMatches: 5,
      totalGames: ''
    }
  }

  //refresh match data if summoner changed
  componentDidUpdate(prevState) {
    if(this.props.accountId !== prevState.accountId) {
      this.setState({matches:[]});
      this.setState({totalGames:''});
      this.componentDidMount();
    }
  }

  //get list of matches
  componentDidMount() {
    this.callBackendAPI()
      .then(data => {
      let getMatches = data.matches;
      let totalMatches = data.totalGames;
      for(let i = 0; i < this.state.maxMatches; i++) {
       this.setState({
         matches: [...this.state.matches, getMatches[i].gameId]
       })
      }
      this.setState({totalGames:totalMatches});
    })
    .catch(err => err);
  }

  callBackendAPI = async () => {
    const response = await fetch("/lol/match/v4/matchlists/by-account/"+this.props.accountId+"?api_key="+process.env.REACT_APP_API_KEY);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };  

  render() {
  //display matches in a list
	 const matches = this.state.matches.map((match) =>
    <li key = {match.toString()}>
      <MatchData match={match}
      					 summoner={this.props.summoner}/>
    </li>
	  );
    return (
      <div>
      	<h1>Summoner: {this.props.summoner} </h1>
      	<h3>Total matches: {this.state.totalGames}</h3>
      	<p><small>(displaying first five)</small></p>
        <div>
	        <ol>
	        	{matches}
	        </ol>
        </div>
      </div>
    );
  }
}

export default MatchList;