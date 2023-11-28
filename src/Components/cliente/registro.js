import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const [username, serUsername] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('solicitante');
  const navigate = useNavigate();
  const aRegistro = async () => {
    try {
       const response = await axios.post('https://reservacion-de-hotel.onrender.com/api/cliente/registrarse', {
         username,
         contraseña,
         rol,
       });

       if (response.status === 200) {

        navigate('/ingreso'); 
      }

     } catch (error) {
       console.error('Error de registro:', error);
     }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username:</label>
        <input type="text" className="form-control" id="username" value={username} onChange={(e) => serUsername(e.target.value)} />
      </div>
      <div className="mb-3">
        <label htmlFor="contraseña" className="form-label">Contraseña:</label>
        <input type="password" className="form-control" id="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
      </div>
      <div className="mb-3">
        <label htmlFor="rol" className="form-label">Rol:</label>
        <select className="form-select" id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="administrador">administrador</option>
          <option value="asesor">solicitante</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={aRegistro}>Registrarse</button>
    </div>
  );
};

export default Registro;