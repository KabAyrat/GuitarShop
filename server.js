const express = require('express');
const pool = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');const express = require('express');
const pool = require('./db');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Получение всех товаров с подробной информацией о гитарах
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.image_url,
                p.stock,
                c.name as category_name,
                g.type,
                g.body_material,
                g.strings_count,
                g.brand
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN guitars g ON p.id = g.product_id
            ORDER BY p.name
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении товаров:', err);
        res.status(500).send('Ошибка при получении товаров');
    }
});

// Получение товара по ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.image_url,
                p.stock,
                c.name as category_name,
                g.type,
                g.body_material,
                g.strings_count,
                g.brand
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN guitars g ON p.id = g.product_id
            WHERE p.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка при получении товара:', err);
        res.status(500).send('Ошибка при получении товара');
    }
});

// Получение только гитар
app.get('/api/guitars', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.image_url,
                p.stock,
                g.type,
                g.body_material,
                g.strings_count,
                g.brand
            FROM products p
            JOIN guitars g ON p.id = g.product_id
            ORDER BY p.name
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении гитар:', err);
        res.status(500).send('Ошибка при получении гитар');
    }
});

// Получение уникальных брендов
app.get('/api/brands', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT brand 
            FROM guitars 
            WHERE brand IS NOT NULL 
            ORDER BY brand
        `);
        res.json(result.rows.map(row => row.brand));
    } catch (err) {
        console.error('Ошибка при получении брендов:', err);
        res.status(500).send('Ошибка при получении брендов');
    }
});

// Получение уникальных типов гитар
app.get('/api/guitar-types', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT type 
            FROM guitars 
            WHERE type IS NOT NULL 
            ORDER BY type
        `);
        res.json(result.rows.map(row => row.type));
    } catch (err) {
        console.error('Ошибка при получении типов гитар:', err);
        res.status(500).send('Ошибка при получении типов гитар');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении товаров:', err);
        res.status(500).send('Ошибка при получении товаров');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
