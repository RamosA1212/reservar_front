import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Habitaciones = () => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [editHabByID, setEditHabByID] = useState(null);
    const [creating, setCreating] = useState(false);
    const [editedData, setEditedData] = useState({
      numero: '',
      valor: '',
      tipo: '',
    });
  
    const [newHabitacionData, setNewHabitacionData] = useState({
      numero: '',
      tipo: '',
      valor: '',
    });
  
    useEffect(() => {
      // Fetch habitaciones from the backend using axios
      axios.get('https://reservacion-de-hotel.onrender.com/api/habitaciones')
        .then(response => {
          setHabitaciones(response.data);
        })
        .catch(error => {
          console.error('Error fetching habitaciones:', error);
        });
    }, []);
  
    const handleEliminarHabitacion = async (codigo) => {
      // Send a DELETE request to the backend
      try {
        await axios.delete(`https://reservacion-de-hotel.onrender.com/api/habitacion/${codigo}`);
        // Update the habitaciones list after deletion
        const updatedHabitaciones = habitaciones.filter(habitacion => habitacion.codigo !== codigo);
        setHabitaciones(updatedHabitaciones);
      } catch (error) {
        console.error('Error deleting habitacion:', error);
      }
    };
  
    const handleEditarHabitacion = (habitacion) => {
      setEditHabByID(habitacion.codigo);
      setEditedData({
        numero: habitacion.numero,
        valor: habitacion.valor,
        tipo: habitacion.tipo,
      });
    };
  
    const handleSaveEdit = async () => {
      try {
        await axios.patch(`https://reservacion-de-hotel.onrender.com/api/habitacion/${editHabByID}`, editedData);
        const updatedHabitaciones = habitaciones.map(habitacion => (habitacion.codigo === editHabByID ? { ...habitacion, ...editedData } : habitacion));
        setHabitaciones(updatedHabitaciones);
        setEditHabByID(null);
        setEditedData({
          numero: '',
          valor: '',
          tipo: '',
        });
      } catch (error) {
        console.error('Error al editar habitacion:', error);
      }
    };
  
    const handleCreateHabitacion = async () => {
      try {
        // Enviar una solicitud POST al servidor con la información de la nueva habitacion
        const response = await axios.post('https://reservacion-de-hotel.onrender.com/api/habitacion', newHabitacionData);
  
        // Actualizar la lista de habitaciones con la nueva habitacion creada
        setHabitaciones([...habitaciones, response.data]);
  
        // Restaurar el estado para ocultar el formulario de creación
        setCreating(false);
  
        // Restaurar el estado de la nueva habitacion
        setNewHabitacionData({
          numero: '',
          tipo: '',
          valor: '',
        });
      } catch (error) {
        console.error('Error al crear habitacion:', error);
      }
      window.location.reload();
    };
  
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Lista de Habitaciones</h2>
  
        <button className="btn btn-primary" onClick={() => setCreating(true)}>Presione para crear</button>
        {creating && (
          // Formulario de Creación
          <div>
            <div className="form-group">
              <label htmlFor="numero">Número</label>
              <input type="text" className="form-control" id="numero" value={newHabitacionData.numero} onChange={(e) => setNewHabitacionData({ ...newHabitacionData, numero: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Tipo</label>
              <input type="text" className="form-control" id="tipo" value={newHabitacionData.tipo} onChange={(e) => setNewHabitacionData({ ...newHabitacionData, tipo: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="valor">Valor</label>
              <input type="number" step="0.01" className="form-control" id="valor" value={newHabitacionData.valor} onChange={(e) => setNewHabitacionData({ ...newHabitacionData, valor: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={handleCreateHabitacion}>Guardar</button>
            <button className="btn btn-secondary" onClick={() => setCreating(false)}>Cancelar</button>
          </div>
        )}
  
        <ul className="list-group">
          {habitaciones.map(habitacion => (
            <li key={habitacion.codigo} className="list-group-item">
              <strong>Codigo:</strong> {habitacion.codigo} | <strong>Número:</strong> {habitacion.numero} | <strong>Tipo:</strong> {habitacion.tipo} | <strong>Valor:</strong> {habitacion.valor}
              {editHabByID === habitacion.codigo ? (
                // Formulario de edición en la página principal
                <div>
                  <div className="form-group">
                    <label htmlFor="numero">Número</label>
                    <input type="text" className="form-control" id="numero" value={editedData.numero} onChange={(e) => setEditedData({ ...editedData, numero: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="valor">Valor</label>
                    <input type="number" className="form-control" id="valor" value={editedData.valor} onChange={(e) => setEditedData({ ...editedData, valor: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tipo">Tipo</label>
                    <textarea className="form-control" id="tipo" value={editedData.tipo} onChange={(e) => setEditedData({ ...editedData, tipo: e.target.value })} />
                  </div>
                  <button className="btn btn-primary" onClick={handleSaveEdit}>Guardar</button>
                </div>
              ) : (
                // Botón de editar en la página principal
                <button className="btn btn-primary" onClick={() => handleEditarHabitacion(habitacion)}>Editar</button>
              )}
              <button onClick={() => handleEliminarHabitacion(habitacion.codigo)} className="btn btn-danger btn-sm ml-2">
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default Habitaciones;