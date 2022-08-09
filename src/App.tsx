import React, { useEffect } from 'react';
import "./styles.css";

import Routes from './routes';

function App() {

  useEffect(() => {
    //console.log(window.location)
  }, [])

  return (
    <Routes />
  );
}

export default App;
