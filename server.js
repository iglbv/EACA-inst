
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
//const bcrypt = require('bcrypt'); // Import bcrypt for password hashing - VERY IMPORTANT!

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory


const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306 // Use environment variable or default to 3306
};

async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL!");
        return connection;
    } catch (error) {
        console.error("Error connecting to MySQL:", error);
        return null; // Return null instead of throwing error
    }
}

async function executeQuery(sql, params) {
    let connection = null;
    try {
        connection = await getConnection();
        if (!connection) {
            throw new Error("Failed to establish database connection.");
        }
        const [rows] = await connection.execute(sql, params);
        return rows;
    } catch (error) {
        console.error("Database error:", error);
        const errorMessage = error.message || "Unspecified database error";
        throw new Error(`Database error: ${errorMessage}`); // Re-throw the error with more details
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (endError) {
                console.error("Error closing database connection:", endError);
            }
        }
    }
}

// Default route
app.get('/', (req, res) => {
    res.send('EACAgram API is running!');
});

// --- API for posts ---
app.get('/posts', async (req, res) => {
    try {
        const userId = req.query.userId;
        const sql = userId ? 'SELECT * FROM posts WHERE userId = ?' : 'SELECT * FROM posts';
        const params = userId ? [userId] : [];
        const posts = await executeQuery(sql, params);
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: 'Failed to fetch posts: ' + error.message });
    }
});

app.post('/posts', async (req, res) => {
    try {
        const { text, userId, photoURL, date } = req.body;
        const sql = 'INSERT INTO posts (text, userId, photoURL, date) VALUES (?, ?, ?, ?)';
        const params = [text, userId, photoURL, date];
        const result = await executeQuery(sql, params);
        res.json({ id: result.insertId });
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ error: 'Failed to add post: ' + error.message });
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const sql = 'DELETE FROM posts WHERE id = ?';
        const result = await executeQuery(sql, [postId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Post not found.' });
        } else {
            res.json({ message: 'Post deleted.' });
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: 'Failed to delete post: ' + error.message });
    }
});


// --- API for users ---
app.get('/users', async (req, res) => {
    try {
        const username = req.query.username;
        const sql = username ? 'SELECT * FROM users WHERE username = ?' : 'SELECT * FROM users';
        const params = username ? [username] : [];
        const users = await executeQuery(sql, params);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: 'Failed to fetch users: ' + error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const sql = 'SELECT * FROM users WHERE id = ?';
        const user = await executeQuery(sql, [userId]);
        if (user.length === 0) {
            res.status(404).json({ error: 'User not found.' });
        } else {
            res.json(user[0]);
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: 'Failed to fetch user: ' + error.message });
    }
});


app.post('/users', async (req, res) => {
    try {
        const { username, password } = req.body;
        //  PASSWORD HASHING IS ABSOLUTELY CRITICAL HERE!!!!
        // const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        // const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        // const params = [username, hashedPassword];
        // const result = await executeQuery(sql, params);
        // res.json({ id: result.insertId });

        // Placeholder - replace with secure password hashing
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        const params = [username, password]; //INSECURE - REMOVE IN PRODUCTION!
        const result = await executeQuery(sql, params);
        res.json({ id: result.insertId });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: 'Failed to create user: ' + error.message });
    }
});


app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { avatarURL, description } = req.body;
        const sql = 'UPDATE users SET avatarURL = ?, description = ? WHERE id = ?';
        const params = [avatarURL, description, userId];
        const result = await executeQuery(sql, params);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'User not found.' });
        } else {
            res.json({ message: 'User updated.' });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Failed to update user: ' + error.message });
    }
});


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server started on port ${port}`));
