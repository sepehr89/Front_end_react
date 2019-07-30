import React from 'react';
import './App.css';
import 'react-widgets/dist/css/react-widgets.css';
import Combobox from 'react-widgets/lib/Combobox';
import { Component } from 'react';
import 'react-table/react-table.css';
import MaterialTable from 'material-table';
import axios from "axios";
class App extends Component {
  constructor(props) {
    super(props);
	//set state values to access from DOM
    this.state = { value_age: 'Age', value_gender: 'Gender', vakue_data: 'data1' };

  }

  async subm() {
    var arraydata = [];
	//run get query by axios based on to other comboboxes values
    await axios.get(encodeURI("http://localhost:3000/recommendFood?ages=" + this.state.value_age + "&gender=" + this.state.value_gender))
      .then(result => {
		  // convert JSON to striong to prepare for building message sentences.
        var ages = JSON.stringify(result.data);
        var jsarr = [];
        jsarr = eval('(' + ages + ')');

        var i;
        var itm = [];
        for (i = 0; i < jsarr.length; i++) {
			//build message sentences based on JSON string keys and vlues
          var vals = 'Please serve ' + jsarr[i].servings + ' time ' + jsarr[i].srvg_sz + ' of ' + jsarr[i].food + ' in the ' + jsarr[i].foodgroup + ' group ' + ' based on following instruction:\n'
            + jsarr[i].directional;
          var record = {};
          record['agehead'] = vals;
          var placeholder = [];
		  // push and merge to arraydata to provide data for the table
          placeholder.push(record);
          arraydata = [...arraydata, ...placeholder];

        }
      }, error => {
        console.error(error);
      });
	 //provide data values for the defined state
    this.setState({ data1: arraydata })
  }
  render() {
	  //define constant values of the table and comboboxes
    let gender = ['Male', 'Female'];
    let ages = ['2 to 3',
      '4 to 8',
      '9 to 13',
      '14 to 18',
      '19 to 30',
      '31 to 50',
      '51 to 70',
      '71+'];
    const columns = [{
      title: 'recom',
      field: 'agehead',
    }
    ];
    return (
      <div className="App">
        <div className="App-Compobox1">
          <Combobox
            data={gender}
            defaultValue={"Gender"}
            value_gender={this.state.value_gender}
            onChange={(value_gender) => { this.setState({ value_gender }) }}
          />
        </div>
        <div className="App-Compobox1">
          <Combobox
            data={ages}
            defaultValue={"Age"}
            value_age={this.state.value_age}
            onChange={(value_age) => { this.setState({ value_age }) }}
          />
        </div>
        <div>
          <button className="Button-Submit" onClick={this.subm.bind(this)}>
            Recommand
      </button>
        </div>
        <div className="Table-style">
          <MaterialTable
            data={this.state.data1}
            columns={columns}
            title="Recommendations"
          />
        </div>
      </div>
    );
  }
}
export default App;
