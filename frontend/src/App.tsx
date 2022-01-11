import './App.css';
import Sets from './components/sets/Sets';
import { Routes, Route, Link } from "react-router-dom";
import Login from './components/login/Login';

function App() {

    return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sets" element={<Sets />} />
        </Routes>
    </div>
  );
}

export default App;
