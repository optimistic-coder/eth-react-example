import React, { Component } from "react";
import ListOfInfo from "./contracts/ListOfInfo.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
 constructor(props){
   super(props)
  this.state = {
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    task:'',
    taskCount:0,
    allTask:[] 
   };
   this.handleChange = this.handleChange.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
 }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ListOfInfo.networks[networkId];
      const instance = new web3.eth.Contract(
        ListOfInfo.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance }, this.getDataFromBlockChain);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getDataFromBlockChain = async () => {
    const { accounts, contract } = this.state;
    var taskcount = await contract.methods.taskCount().call()
    var t = []
    for(var i = 1;i<=taskcount;i++){
        var ts = await contract.methods.tasks(i).call()
        t.push(ts)
    }
    this.setState({taskcount:taskcount,allTask:t})
   
   
  };
  handleChange(event) {
    this.setState({task: event.target.value});
  }

  async handleSubmit(event) {
    const { accounts, contract } = this.state;

    event.preventDefault();
    console.log(this.state.task)
    await contract.methods.createTask(this.state.task).send({ from: accounts[0] });
    window.location.reload()
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
       <h1>Hello everybody this gragrory</h1>
       <p>{this.state.accounts[0]}</p>
       <input type="text" value={this.state.task} onChange={this.handleChange} />
       <button onClick={this.handleSubmit}>Submit</button>
        {this.state.allTask.length!==0&&(
          <>{this.state.allTask.map(t=>{
            return(
              <p>{t.content}</p>
            )
          })}</>
        )}
      </div>
    );
  }
}

export default App;
