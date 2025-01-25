const express = require('express')
const cors = require('cors') // Importa CORS
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors()) // Habilita CORS
app.use(express.json())

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(403).json({ error: 'No se proporcionó un token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.email = decoded.email
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

// Ruta para registrar un usuario
app.post('/usuarios', async (req, res) => {
  const { email, password, rol, lenguage } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, password, rol, lenguage]
    )
    res.status(201).json({ message: 'Usuario registrado', usuario: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
})

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND password = $2', [email, password])
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

// Ruta para obtener datos del usuario autenticado
app.get('/usuarios', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [req.email])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del usuario' })
  }
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
