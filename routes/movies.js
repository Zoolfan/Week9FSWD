const express = require("express");
const router = express.Router();
const pool = require("../config.js");
const { authorization } = require("../middlewares/auth.js");

// insert data
router.post("/movies", authorization, (req, res) => {
  const { title, genres, year } = req.body;
  const queryPost = `
          INSERT INTO movies (title, genres, year)
          VALUES
          ($1,$2,$3)`;

  pool.query(queryPost, [title, genres, year], (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({ message: "Sukses menambahkan data" });
    }
  });
});

// update data
router.put("/movies/:id", (req, res) => {
  const { id } = req.params;
  const { title, genres, year } = req.body;
  const queryPut = `
    UPDATE movies
    SET title= $1, genres = $2, year=$3
    WHERE id = ${id};`;

  pool.query(queryPut, [title, genres, year], (err, response) => {
    if (err) {
      throw err;
    } else {
      res.status(200).json({ message: "Berhasl update movies" });
    }
  });
});

module.exports = router;
