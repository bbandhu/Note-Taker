// Import required dependencies
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid'); // Unique id generator

// Set up port
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static("public"));

// Routes
// GET Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});



// GET Route for notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET Route for getting all notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, notes) => {
    if (err) {
      return res.status(500).json({ err });
    }

    res.json(JSON.parse(notes));
  });
});

// POST Route for adding a new note
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    id: uuidv4(),
    title,
    text
  };

  if (title && text) {
    // Read the db.json file
    fs.readFile("./db/db.json", "utf8", (err, notes) => {
      if (err) {
        return res.status(500).json({ err });
      }
      const data = JSON.parse(notes);

      // Add data to the array from db.json file
      data.push(newNote);

      // Write the new array to the db.json file
      fs.writeFile("./db/db.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ err });
        }

        // Send newly added data to the front-end
        res.json(data);
      });
    });
  } else {
    res.status(400).json({ error: "title and text are required" });
  }
});
// index.html for all other routes
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on PORT http://localhost:${PORT}`);
});