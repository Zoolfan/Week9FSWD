const express = require("express");
const router = express.Router();
const moviesRouter = require("./movies.js");
const pool = require("../config.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secretKey = "secret";
const { authentication } = require("../middlewares/auth.js");
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

router.use(authentication);
router.use(moviesRouter);

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  const find = `
  SELECT * FROM users WHERE email = $1`;

  pool.query(find, [email], (err, result) => {
    if (err) next(err);

    if (result.rows.length === 0) {
      next({ name: "ErrorNotFound" });
    } else {
      const data = result.rows[0];
      const comparePass = bcrypt.compareSync(password, data.password);

      if (comparePass) {
        const accessToken = jwt.sign(
          {
            id: data.id,
            email: data.email,
            role: data.role,
            password: data.password,
          },
          secretKey
        );

        res.status(200).json({
          id: data.id,
          email: data.email,
          password: data.password,
          role: data.role,
          accessToken: accessToken,
        });
      } else {
        next({ name: "WrongPass" });
      }
    }
  });
});

router.post("/register", (req, res, next) => {
  const { email, gender, password, role } = req.body;
  const hash = bcrypt.hashSync(password, salt);

  const registUser = `
  INSERT INTO users (email, gender, password, role)
  VALUES ($1,$2,$3,$4)
  `;

  pool.query(registUser, [email, gender, hash, role], (err, result) => {
    if (err) {
      next(err);
    } else {
      res.status(201).json({ message: "sukses tambah user" });
    }
  });
});

// get untuk semua tabel
router.get("/:table", (req, res, next) => {
  const { limit, page } = req.query;
  const { table } = req.params;
  let resultLimit = limit ? +limit : DEFAULT_LIMIT;
  let resultPage = page ? +page : DEFAULT_PAGE;

  const queryGet = `
      SELECT * FROM ${table} 
      ORDER BY id ASC
      LIMIT ${resultLimit} OFFSET ${(resultPage - 1) * resultLimit}`;

  pool.query(queryGet, (err, result) => {
    if (err) next(err);

    if (result.rows.length === 0) {
      next({ name: "ErrorNotFound" });
    } else {
      res.status(200).json(result.rows);
    }
  });
});

// get by id untuk semua tabel
router.get("/:table/:id", (req, res) => {
  const { table } = req.params;
  const { id } = req.params;
  const queryGetId = `
      SELECT * FROM ${table} WHERE id = ${id}`;

  pool.query(queryGetId, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(response.rows);
    }
  });
});

// delete untuk semua table
router.delete("/:table/:id", (req, res) => {
  const { table } = req.params;
  const { id } = req.params;

  const findQuery = `
     SELECT * FROM ${table} where id = ${id}
     `;

  pool.query(findQuery, (err, response) => {
    if (err) throw err;
    if (response.rows[0]) {
      const deleteQ = `DELETE FROM ${table} WHERE id = ${id}`;
      pool.query(deleteQ, (err, response) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json({ message: "delete success" });
        }
      });
    } else {
      res.status(404).json({ message: "error ID or TABLE not found" });
    }
  });
});

module.exports = router;
