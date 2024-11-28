import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Para manejar tokens JWT (opcional, pero recomendado)


// Crear un usuario
export const createUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validar datos
        if (!username || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Hashear contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear el usuario
        const newUser = await User.create({
            username,
            password: hashedPassword,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

// Login de usuario
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar que se envíen ambos campos
        if (!username || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Buscar al usuario en la base de datos
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Comparar la contraseña con el hash almacenado
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar un token JWT (opcional)
        const token = jwt.sign(
            { userId: user.id, username: user.username }, // Payload
            'your-secret-key', // Clave secreta (debería estar en variables de entorno)
            { expiresIn: '1h' } // Tiempo de expiración
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
