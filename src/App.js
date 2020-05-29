import React from 'react';
import Axios from "axios";
import './index.css';

export default class App extends React.Component{
  constructor(props){
      super(props);

      this.getStatesData = this.getStatesData.bind(this);
  }

  state = {
      confirmed :0,
      cured: 0,
      death: 0,
      total: 0,
      states: [],
  };


  componentDidMount(){
      this.getData();

  }

  async getData(){
      const resApi = await Axios.get("https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise/");
      const resStates = await Axios.get("https://covid19-india-adhikansh.herokuapp.com/states");
      const states = [];
      for(var i = 0; i < resStates.data.state.length; i++){
          states.push(resStates.data.state[i].name);
      }
      //const res = await Axios.get(`https://covid19-india-adhikansh.herokuapp.com/state/${states[0]}`);

    let res = resApi.data.data.statewise.filter(d => 
        {return d.state.match(states[0])});

      //const countries = Object.keys(resCountries.data.countries);
      this.setState({
        confirmed:res[0].confirmed,
        cured:res[0].recovered,
        death:res[0].deaths,
        total:res[0].active,
          states,
          indiaConfirmed: resApi.data.data.total.confirmed,
          indiaRecovered: resApi.data.data.total.recovered,
          indiaDeaths: resApi.data.data.total.deaths,
          indiaActive: resApi.data.data.total.active
      });
  }

  async getStatesData(e){
      if(e.target.value === null) {
          return this.getData();     
      }

      let stateValue = e.target.value;
      
      try{
      const resApi = await Axios.get("https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise/");
      let res = resApi.data.data.statewise.filter(d => 
        {return d.state.match(stateValue)});
      this.setState({
        confirmed:res[0].confirmed,
        cured:res[0].recovered,
        death:res[0].deaths,
        total:res[0].active,
      });
  }
  catch(err){
      if(err.response.status===404)
      this.setState({
          confirmed:"No data available..",
          cured:"No data available..",
          death:"No data available..",
          total:"No data available..",
      });
  }
  }

  renderStatesOptions(){
      return this.state.states.map(( state, j) =>{
      return <option key={j}>{ state }</option>
      });

  }

  render(){
      return (
      <div className="container">
          <h1>Covid-19 India Tracker</h1>
          <div className="flex">
          <div className="box confirmed">
              <h3>Confirmed Cases</h3>
              <h4>{this.state.indiaConfirmed}</h4>
          </div>
          <div className="box recovered">
              <h3>Recovered Cases</h3>
              <h4>{this.state.indiaRecovered}</h4>
          </div>
          <div className="box deaths">
              <h3>Deaths</h3>
              <h4>{this.state.indiaDeaths}</h4>
          </div>
          <div className="box total">
              <h3>Total Active</h3>
              <h4>{this.state.indiaActive}</h4>
          </div>
          </div>

          <h2>Select State:</h2>
          <select className="dropdown" onChange={this.getStatesData}>
              {this.renderStatesOptions()}
          </select>

          <div className="flex">

          <div className="box confirmed">
              <h3>Confirmed Cases</h3>
              <h4>{this.state.confirmed}</h4>
          </div>
          <div className="box recovered">
              <h3>Recovered Cases</h3>
              <h4>{this.state.cured}</h4>
          </div>
          <div className="box deaths">
              <h3>Deaths</h3>
              <h4>{this.state.death}</h4>
          </div>
          <div className="box total">
              <h3>Total</h3>
              <h4>{this.state.total}</h4>
          </div>
          </div>
          
      </div>);
  }
}