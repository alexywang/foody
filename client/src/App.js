import logo from './logo.svg';
import './App.css';
import { Router, Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Extension } from './extension_components/Extension';
import { Home } from './site_components/Home';

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" exact component={Home}></Route>
      <Route path="/restaurants" exact component={Extension}></Route>
    </BrowserRouter>
  );
}

export default App;
