import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';



const Ingreso = () => {
    const [username, serUsername] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate();

    function getCookie(name) {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    const aLogin = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post('https://reservacion-de-hotel.onrender.com/api/cliente/ingresar', {
                username,
                contraseña,

            }, {
                withCredentials: true
            },);
            const token = response.data.token;
            if (response.status === 200) {
                setCookie('token', token, 1);
                const usuario = jwtDecode(token);
                if (token) {
                    switch (usuario.rol) {
                        case 'solicitante':
                            navigate('/reservar');
                            break;
                        case 'administrador':
                            navigate('/administrar');
                            break;
                        default:
                            console.error('Rol no reconocido');
                            break;
                    }

                } else {
                    console.error('Error de inicio de sesión: No se recibió un token en la respuesta');
                }
            }
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
        }

    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username:</label>
                <input type="text" className="form-control" id="username" value={username} onChange={(e) => serUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="contraseña" className="form-label">Contraseña:</label>
                <input type="password" className="form-control" id="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={aLogin}>Iniciar Sesión</button>
        </div>
    );
};

export default Ingreso;

