import './App.css';
import Sets from './components/sets/Sets';
import { Routes, Route } from "react-router-dom";
import Login from './components/login/Login';
import { createContext, useEffect, useState } from 'react';
import { UserAuth } from './utils/types';



const UserContext = createContext<UserAuth>({})

function App() {
  const [user, setUser] = useState<UserAuth>({})
  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <div className="App">
      <UserContext.Provider value={user}>
          <Routes>
              <Route path="/" element={<Login setUser={setUser} />} />
              <Route path="/sets" element={<Sets />} />
          </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
