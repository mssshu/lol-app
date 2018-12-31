import React from 'react';
import RunesData from '../lib/dragontail-8.24.1/8.24.1/data/en_US/runesReforged.json';
import SpellsData from '../lib/dragontail-8.24.1/8.24.1/data/en_US/summoner.json';
import ItemsData from '../lib/dragontail-8.24.1/8.24.1/data/en_US/item.json';
import ChampionData from '../lib/dragontail-8.24.1/8.24.1/data/en_US/champion.json'

class MatchData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runeIds:[],
      itemIds:[],
      runes:[],
      spells:[],
      items:[]
    }
    this.setMatchData.bind(this);
    this.setParticipantData.bind(this);
    this.getChampion.bind(this);
    this.getSpells.bind(this);
    this.getItems.bind(this);
    this.getRunes.bind(this);
  }

 //get all the match stats
  componentDidMount() {
    fetch("/lol/match/v4/matches/"+ this.props.match +"?api_key="+process.env.REACT_APP_API_KEY)
    .then(results => {
      return results.json();
    }).then(data => {
      this.setMatchData(data);
    })
    .catch(e => e)
  }

  setMatchData(oneMatch) {
  	let getDurationMins = oneMatch.gameDuration / 60;
  	let getDurationRemainderSecs = oneMatch.gameDuration % 60;
  	let getDuration = getDurationMins.toFixed(0) + ":"
  										+ getDurationRemainderSecs;

  	this.setState({duration:oneMatch.gameDuration});
  	this.setState({durationPretty:getDuration});

    //get summoner's data for the match
  	for(let i = 0; i <= oneMatch.participantIdentities.length; i++) {
  		if(oneMatch.participantIdentities[i].player.summonerName === this.props.summoner) {
  			this.setState({participantId:oneMatch.participantIdentities[i].participantId});
  			break;
  		}
  	}

  	this.setParticipantData(oneMatch.participants[this.state.participantId]);
  	this.setStaticData(oneMatch.participants[this.state.participantId]);

  }

  setParticipantData(participant) {
    //get outcome
    let getOutcome = participant.stats.win ? 'Victory' : 'Defeat';
    this.setState({outcome:getOutcome});

    //get kda
    let getKda = (participant.stats.assists + participant.stats.kills) / participant.stats.deaths;
    this.setState({kda:getKda.toFixed(0)});

		//get total creep score
    let getCreepScore = 0;
    let totalCreeps = Object.values(participant.timeline.creepsPerMinDeltas);
    for(let i = 0; i < totalCreeps.length; i++) {
    	getCreepScore += totalCreeps[i];

		}
    this.setState({creepScore:getCreepScore.toFixed(2)});

    //get creep score per min
    let getCreepMin = getCreepScore / (this.state.duration / 60);
    this.setState({creepMin:getCreepMin.toFixed(2)});
  }

  setStaticData(participant) {
    //get champion info
  	this.setState({championLvl:participant.stats.champLevel});
  	this.getChampion(participant.championId);

  	//get the two spell ids
    this.getSpells(participant.spell1Id, participant.spell2Id);

    //get item ids
    let keys = Object.keys(participant.stats);
	 	for(let i = 0; i < keys.length; i++) {
	 		if(keys[i].includes("item")) {
	 			let item = Object.values(participant.stats)[i];
	 			this.setState({
					itemIds: [...this.state.itemIds, item]
				})
	 		}
	 	}
    this.getItems();

  	//get rune ids
	 	for(let i = 0; i < participant.runes.length; i++) {
    	this.setState({
				runeIds: [...this.state.runeIds, participant.runes[i].runeId]
			})
    }
    this.getRunes();
  }

  getChampion(championId) {
  	let keys = Object.keys(ChampionData.data);
  	for(let i = 0; i < keys.length; i++) {
  		let champion = ChampionData.data[keys[i]];
  		if(parseInt(champion.key) === championId) {
  			this.setState({championName:champion.name})
  		}
  	}
  }

  getSpells(spellOneId, spellTwoId) {
  	let keys = Object.keys(SpellsData.data);
		let spellOne = SpellsData.data[keys[spellOneId]];
		let spellTwo = SpellsData.data[keys[spellTwoId]];
		
		if(spellOne.key !== undefined && spellOne.key !== null) {
			this.setState({ spells: [...this.state.spells, spellOne.image.full]});
		}

		if(spellTwo.key !== undefined && spellTwo.key !== null) {
			this.setState({ spells: [...this.state.spells, spellTwo.image.full]});
		}
  }

  getItems() {
  	for(let i = 0; i < this.state.itemIds.length; i++) {
  		let item = ItemsData.data[this.state.itemIds[i]];
  		if(item !== undefined && item !== null) {
  			this.setState({ items: [...this.state.items, item]});
  		}
  	}
  }

  getRunes() {
  	for(let i = 0; i < RunesData.length; i++) {
  		let slots = RunesData[i].slots;

  		for(let j = 0; j < slots.length; j++) {
  			let getRunes = slots[j].runes;

  			for(let k = 0; k < getRunes.length; k++) {

		  		if(this.state.runeIds.includes(getRunes[k].id)) {
		  			let image = getRunes[k].icon;
		  			this.setState({ runes: [...this.state.runes, image]});
		  		}
		  	}
  		}
  	}
  }

	render() {
		const runes = this.state.runes.map((img, index) =>
	    <td align="center" key={index}>
	      <img src={require('../lib/dragontail-8.24.1/img/' + img)} alt="Rune"></img>
	      <br/><br/>
	    </td>
	  );

	  const spells = this.state.spells.map((img, index) =>
	    <td align="center" key={index}>
	      <img src={require('../lib/dragontail-8.24.1/8.24.1/img/spell/' + img)} alt="Spell"></img>
	    	<br/><br/>
	    </td>
	  );

	  const items = this.state.items.map((item, index) =>
	    <td align="center" key={index}>
	      <img src={require('../lib/dragontail-8.24.1/8.24.1/img/item/' + item.image.full)} alt="Item"></img>
	      <p>{item.name} --</p>
	    	<br/><br/>
	    </td>	
	  );

		return (
		<div>

			<table>
				<tbody>
					<tr>
						<td align="center"><b>MatchId</b> --</td>
						<td align="center"><b>Outcome</b> --</td>
		        <td align="center"><b>Duration</b> --</td>
		        <td align="center"><b>Champion Name</b> --</td>
		        <td align="center"><b>Champion Level</b> --</td>
		        <td align="center"><b>KDA</b> --</td>
		        <td align="center"><b>Creep Score</b> --</td>
		        <td align="center"><b>Creep Score per Min</b></td>
		      </tr>

		      <tr>
						<td align="center">{this.props.match}</td>
						<td align="center">{this.state.outcome}</td>
		        <td align="center">{this.state.durationPretty}</td>
		        <td align="center">{this.state.championName}</td>
		        <td align="center">{this.state.championLvl}</td>
		        <td align="center">{this.state.kda}</td>
		        <td align="center">{this.state.creepScore}</td>
		        <td align="center">{this.state.creepMin}</td>
		      
		      </tr>
		    </tbody>
	    </table>
	    <br/>

	    <div>
	    <table><tbody>

	    <tr><td><b>Runes</b></td></tr>
	    <tr>{runes}</tr>

	    <tr><td><b>Spells</b></td></tr>
	    <tr>{spells}</tr>

	    <tr><td><b>Items</b></td></tr>
	    <tr>{items}</tr>

	    </tbody></table>
	    </div>

    </div>	
		);
	}	
}

export default MatchData;