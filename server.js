const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = 3010;
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// // GET Route for all other routes, serves homepage
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
// GET Route for all other routes, serves homepage
app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
// GET Route for getting all notes
app.get("/api/notes", (req, res) =>
  fs.readFile("./db/db.json", "utf8", (err, notes) => {
    if (err) {
      return res.status(500).json({ err });
    }

    res.json(JSON.parse(notes));
  })
);

// POST Route for adding a new note

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    //  read the db.json file
    fs.readFile("./db/db.json", "utf8", (err, notes) => {
      //  check for errors if any happened
      if (err) {
        return res.status(500).json({ err });
      }

      const data = JSON.parse(notes);
      //  add data to the array from users.json file
      data.push({
        title,
        text,
      });

      //  write the new array to the db.json file
      fs.writeFile("./db/db.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ err });
        }

        //  send newly added data to the front-end
        res.json(data[data.length - 1]);
      });
    });
  } else {
    res.status(400).json({ error: "title and text are required" });
  }
});
app.listen(PORT, () =>
  console.log(`Server listening on PORT http://localhost:${PORT}`)
);
