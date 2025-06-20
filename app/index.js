const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

function connectToDatabase(retries = 10, delay = 5000) {
  const db = mysql.createConnection({
    host: 'db',
    user: 'user',
    password: 'password',
    database: 'nodeapp'
  });

  const connect = () => {
    db.connect((err) => {
      if (err) {
        console.error(`DB connection failed. Retries left: ${retries}.`, err.message);
        if (retries === 0) {
          process.exit(1);        } else {
          setTimeout(() => connectToDatabase(retries - 1, delay), delay);
        }
      } else {
        console.log("Connected to MySQL");

        db.query(`
          CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            msg VARCHAR(255)
          )`, (err) => {
            if (err) console.error("Table creation error:", err);
        });

        app.get('/', (req, res) => {
          db.query("SELECT * FROM messages", (err, results) => {
            if (err) return res.send("Error querying DB");

            let html = `<h1>Messages:</h1><ul>`;
            results.forEach(row => {
              html += `<li>${row.id}: ${row.msg}</li>`;
            });
            html += `</ul><a href="/form">Add New Message</a>`;
            res.send(html);
          });
        });

        app.get('/form', (req, res) => {
          res.send(`
            <h1>Add a Message</h1>
            <form action="/add" method="POST">
              <input type="text" name="msg" required placeholder="Type your message">
              <button type="submit">Submit</button>
            </form>
            <br><a href="/">Back to Messages</a>
          `);
        });

        app.post('/add', (req, res) => {
          const msg = req.body.msg;
          if (!msg) return res.send("Message cannot be empty");

          db.query("INSERT INTO messages (msg) VALUES (?)", [msg], (err) => {
            if (err) {
              console.error("Insert error:", err);
              return res.send("Insert failed");
            }

            res.redirect('/');
          });
        });

        app.listen(port, () => {
          console.log(`Node app listening at http://localhost:${port}`);
        });
      }
    });
  };

  connect();
}

connectToDatabase();

