import './App.css'; // Importar los estilos globales
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './views/Login';
import Register from './views/Register';
import Profile from './views/Profile';
import Context from './contexts/Context';
import useDeveloper from './hooks/useDeveloper';

const App = () => {
  const contextValue = useDeveloper();

  return (
    <Context.Provider value={contextValue}>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </Router>
    </Context.Provider>
  );
};

export default App;
