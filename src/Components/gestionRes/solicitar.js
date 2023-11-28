import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
    const [editHabByID, setEditHabByID] = useState(null);
    const [creating, setCreating] = useState(false);
    const [editedData, setEditedData] = useState({
        codigo_habitacion: '',
        nombre_cliente: '',
        telefono_cliente: '',
        fecha_reservacion: '',
        fecha_entrada: '',
        fecha_salida: '',
    });

    const [newReservaData, setNewReservaData] = useState({
        codigo_habitacion: '',
        nombre_cliente: '',
        telefono_cliente: '',
        fecha_reservacion: '',
        fecha_entrada: '',
        fecha_salida: '',
    });

    useEffect(() => {
        // Fetch Reservas from the backend using axios
        axios.get('https://reservacion-de-hotel.onrender.com/api/reservas')
            .then(response => {
                setReservas(response.data);
            })
            .catch(error => {
                console.error('Error fetching Reservas:', error);
            });
    }, []);

    const handleEliminarHabitacion = async (codigo) => {
        // Send a DELETE request to the backend
        try {
            await axios.delete(`https://reservacion-de-hotel.onrender.com/api/reserva/${codigo}`);
            // Update the Reservas list after deletion
            const updatedReservas = Reservas.filter(reserva => reserva.codigo !== codigo);
            setReservas(updatedReservas);
        } catch (error) {
            console.error('Error deleting reserva:', error);
        }
    };

    const handleEditarHabitacion = (reserva) => {
        setEditHabByID(reserva.codigo);
        setEditedData({
            codigo_habitacion: reserva.codigo_habitacion,
            nombre_cliente: reserva.nombre_cliente,
            telefono_cliente: reserva.telefono_cliente,
            fecha_reservacion: reserva.fecha_reservacion,
            fecha_entrada: reserva.fecha_entrada,
            fecha_salida: reserva.fecha_salida,
        });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.patch(`https://reservacion-de-hotel.onrender.com/api/reserva/${editHabByID}`, editedData);
            const updatedReservas = Reservas.map(reserva => (reserva.codigo === editHabByID ? { ...reserva, ...editedData } : reserva));
            setReservas(updatedReservas);
            setEditHabByID(null);
            setEditedData({
                codigo_habitacion: '',
                nombre_cliente: '',
                telefono_cliente: '',
                fecha_reservacion: '',
                fecha_entrada: '',
                fecha_salida: '',
            });
        } catch (error) {
            console.error('Error al editar reserva:', error);
        }
        window.location.reload();
    };

    const handleCreateReserva = async () => {
        try {
            // Enviar una solicitud POST al servidor con la información de la nueva reserva
            const response = await axios.post('https://reservacion-de-hotel.onrender.com/api/reservar', newReservaData);

            // Actualizar la lista de Reservas con la nueva reserva creada
            setReservas([...reservas, response.data]);

            // Restaurar el estado para ocultar el formulario de creación
            setCreating(false);

            // Restaurar el estado de la nueva reserva
            setNewReservaData({
                codigo_habitacion: '',
                nombre_cliente: '',
                telefono_cliente: '',
                fecha_reservacion: '',
                fecha_entrada: '',
                fecha_salida: '',
            });
        } catch (error) {
            console.error('Error al crear reserva:', error);
        }
        window.location.reload();
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Reservas</h2>

            <button className="btn btn-primary" onClick={() => setCreating(true)}>Presione para crear</button>
            {creating && (
                // Formulario de Creación
                <div>
                    <div className="form-group">
                        <label htmlFor="codigo_habitacion">Código de Habitación</label>
                        <input type="text" className="form-control" id="codigo_habitacion" value={newReservaData.codigo_habitacion} onChange={(e) => setNewReservaData({ ...newReservaData, codigo_habitacion: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre_cliente">Nombre de Cliente</label>
                        <input type="text" className="form-control" id="nombre_cliente" value={newReservaData.nombre_cliente} onChange={(e) => setNewReservaData({ ...newReservaData, nombre_cliente: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono_cliente">Teléfono de Cliente</label>
                        <input type="text" className="form-control" id="telefono_cliente" value={newReservaData.telefono_cliente} onChange={(e) => setNewReservaData({ ...newReservaData, telefono_cliente: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_reservacion">Fecha de Reservación</label>
                        <input type="date" className="form-control" id="fecha_reservacion" value={newReservaData.fecha_reservacion} onChange={(e) => setNewReservaData({ ...newReservaData, fecha_reservacion: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_entrada">Fecha de Entrada</label>
                        <input type="date" className="form-control" id="fecha_entrada" value={newReservaData.fecha_entrada} onChange={(e) => setNewReservaData({ ...newReservaData, fecha_entrada: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_salida">Fecha de Salida</label>
                        <input type="date" className="form-control" id="fecha_salida" value={newReservaData.fecha_salida} onChange={(e) => setNewReservaData({ ...newReservaData, fecha_salida: e.target.value })} />
                    </div>
                    <button className="btn btn-primary" onClick={handleCreateReserva}>Guardar</button>
                    <button className="btn btn-secondary" onClick={() => setCreating(false)}>Cancelar</button>
                </div>
            )}

            <ul className="list-group">
                {reservas.map(reserva => (
                    <li key={reserva.codigo} className="list-group-item">
                        <strong>Codigo:</strong> {reserva.codigo} | <strong>codigo de habitacion:</strong> {reserva.codigo_habitacion} | <strong>Nombre de cliente:</strong> {reserva.nombre_cliente} | <strong>Telefono de cliente:</strong> {reserva.telefono_cliente}| <strong>fecha de reservacion:</strong> {reserva.fecha_reservacion} | <strong>fecha de entrada:</strong> {reserva.fecha_entrada}| <strong>fecha de salida:</strong> {reserva.fecha_salida}
                        {editHabByID === reserva.codigo ? (
                            // Formulario de edición en la página principal
                            <div>
                                <div className="form-group">
                                    <label htmlFor="codigo_habitacion">Código de Habitación</label>
                                    <input type="text" className="form-control" id="codigo_habitacion" value={editedData.codigo_habitacion} onChange={(e) => setEditedData({ ...editedData, codigo_habitacion: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nombre_cliente">Nombre de Cliente</label>
                                    <input type="text" className="form-control" id="nombre_cliente" value={editedData.nombre_cliente} onChange={(e) => setEditedData({ ...editedData, nombre_cliente: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="telefono_cliente">Teléfono de Cliente</label>
                                    <input type="text" className="form-control" id="telefono_cliente" value={editedData.telefono_cliente} onChange={(e) => setEditedData({ ...editedData, telefono_cliente: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fecha_reservacion">Fecha de Reservación</label>
                                    <input type="date" className="form-control" id="fecha_reservacion" value={editedData.fecha_reservacion} onChange={(e) => setEditedData({ ...editedData, fecha_reservacion: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fecha_entrada">Fecha de Entrada</label>
                                    <input type="date" className="form-control" id="fecha_entrada" value={editedData.fecha_entrada} onChange={(e) => setEditedData({ ...editedData, fecha_entrada: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fecha_salida">Fecha de Salida</label>
                                    <input type="date" className="form-control" id="fecha_salida" value={editedData.fecha_salida} onChange={(e) => setEditedData({ ...editedData, fecha_salida: e.target.value })} />
                                </div>
                                <button className="btn btn-primary" onClick={handleSaveEdit}>Guardar</button>
                            </div>
                        ) : (
                            // Botón de editar en la página principal
                            <button className="btn btn-primary" onClick={() => handleEditarHabitacion(reserva)}>Editar</button>
                        )}
                        <button onClick={() => handleEliminarHabitacion(reserva.codigo)} className="btn btn-danger btn-sm ml-2">
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reservas;