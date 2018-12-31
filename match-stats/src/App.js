import React, { Component } from 'react';
import './App.css';
import MatchList from './components/matchList';

class App extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      summoner:"C9 Sneaky",
      accountId: 0
    };
    this.updateSummoner.bind(this);
  }

  //get summoner's name and accountId
  componentDidMount() {
    this.callBackendAPI()
    .then(data => {
      const getName = data.name;
      const getAccountId = data.accountId;
      this.setState({summoner:getName});
      this.setState({accountId:getAccountId});
    })
    .catch(e => console.log(e));
  }

  callBackendAPI = async () => {
    const response = await fetch("/lol/summoner/v4/summoners/by-name/"+this.state.summoner+"?api_key="+process.env.REACT_APP_API_KEY);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  updateSummoner(event) {
    let patt = /^[0-9\\p{L} _\\.]+$/;
    let invalid = patt.test(event);
    if(!invalid) {
      this.setState({
        summoner: event.target.value
      });
    }
  } 

  render() {
    return (  
    <div>
      <input value={this.state.summoner} onChange={this.updateSummoner.bind(this)}/>
      <button value="" onClick={this.componentDidMount.bind(this)}>>></button>
      {this.state.accountId &&
      <div>
        <MatchList summoner={this.state.summoner}
                  accountId={this.state.accountId} />
      </div>
      }
      <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
   </div>
   );
  }
}

export default App;
