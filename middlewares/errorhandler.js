function errorHandler(err, req, res, next) {
  if (err.name === "ErrorNotFound") {
    res.status(404).json({ message: "Error Not Found : ini error handler" });
  } else if (err.name === "WrongPass") {
    res.status(400).json({ message: "Password Salah : ini error handler" });
  } else if (err.name === "Unauth") {
    res.status(400).json({ message: "Unauthenticated : ini error handler" });
  } else if (err.name === "Unauthorized") {
    res.status(401).json({ message: "Unauthorized : ini error handler" });
  } else if (err.name === "JWTerror") {
    res.status(400).json({ message: "JWT error : ini error handler" });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
  console.log(err);
}

module.exports = errorHandler;
