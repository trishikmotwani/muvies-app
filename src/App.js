import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignUpIn from './Components/SignUpIn';
import MovieComponent from './Components/MovieComponent';


class App extends Component {

 
  constructor(props) {
        super(props);
  }
  render() { 
    
    return (
      <div className="App">
        
          <Router>
            <Switch>
              <Route path='/' exact={true} 
                  render={(props) => (
                    <SignUpIn {...props} isAuthed={true} />
                  )}
              />
              <Route path='/signUp' exact={true} 
                  render={(props) => (
                    <SignUpIn {...props} isAuthed={true} />
                  )}
              />
              <Route path='/movies' exact={true} 
                  render={(props) => (
                    <MovieComponent {...props} isAuthed={true} />
                  )}
                  // component={MovieComponent}
              />
            </Switch>
          </Router>
        
      </div>
    );
  }
}

export default App;
