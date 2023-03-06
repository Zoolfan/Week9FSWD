const jwt = require("jsonwebtoken");
const secretKey = "secret";
const pool = require("../config.js");

function authentication(req, res, next) {
  const { access_token } = req.headers;

  if (access_token) {
    try {
      const decoded = jwt.verify(access_token, secretKey);
      const { id, email, password } = decoded;
      const findUser = `
      SELECT * FROM users WHERE id=$1;
      `;
      pool.query(findUser, [id], (err, result) => {
        if (err) next(err);

        if (result.rows.length === 0) {
          next({ name: "ErrorNotFound" });
        } else {
          // lolos authentication
          const user = result.rows[0];

          req.loggedUser = {
            id: user.id,
            email: user.email,
            role: user.role,
            password: user.password,
          };
          next();
        }
      });
    } catch (err) {
      next({ name: "JWTerror" });
    }
  } else {
    next({ name: "Unauth" });
  }
}

function authorization(req, res, next) {
  //   console.log(req.loggedUser);
  const { id, email, role, password } = req.loggedUser;

  if (role === "admin") {
    next();
  } else {
    next({ name: "Unauthorized" });
  }
}

module.exports = { authentication, authorization };
