import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Habitaciones from './Components/gestionHab/administrar';
import Reservas from './Components/gestionRes/solicitar';
import Registro from './Components/cliente/registro';
import Ingreso from './Components/cliente/Ingreso';

function App() {
  return (
    <div className="App">

      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Registro />}></Route>
            <Route path="/ingreso" element={<Ingreso />}></Route>
            <Route path="/administrar" element={<Habitaciones></Habitaciones>}></Route>
            <Route path='/reservar' element={<Reservas></Reservas>}></Route>
          </Routes>
        </div>

      </Router>

    </div>
  );
}

export default App;
