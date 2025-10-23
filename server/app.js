const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors")
const mongoose = require("mongoose")
const Student = require("./models/Student.model.js")
const Cohort = require("./models/Cohort.model.js")
const { errorHandler, notFoundHandler } = require("./error-handling/index.js")
const { isAuthenticated } = require("./middleware/jwt.middleware.js")

mongoose
.connect('mongodb://127.0.0.1:27017/cohorts-tools-api')
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const cohorts = require("./cohorts.json")
const students = require("./students.json")

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
app.use(cors( {
  origin: ["http://localhost:5173"]
} ));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorHandler);


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//COHORTS
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
  .then(cohorts => {
    console.log("Retrieved cohorts:", cohorts)
     res.status(200).json(cohorts);
  })
  .catch(error => {
    console.error("Error while retrieving cohorts data", error)
    res.status(500).json({ error: "Failed to retrieve cohorts data"})
  });
});

app.post("/api/cohorts", (req, res) => {
  Cohort.create(req.body)
  .then(createdCohort => {
    console.log("Cohort created", createdCohort)
    res.status(201).json(createdCohort)
  })
  .catch(error => {
    console.error("Error creating cohort", error)
    res.status(500).json( { error: "Failed to create cohort"})
  })
})

app.get("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findById(req.params.cohortId)
  .then(cohort => {
     console.log("Single cohort", cohort)
    res.status(200).json(cohort)
  })
})

app.put("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndUpdate(req.params.cohortId, req.body, { new: true })
  .then(updatedCohort => {
    console.log("Updated cohort", updatedCohort)
    res.status(200).json(updatedCohort)
  })
  .catch(error => {
    console.error("Error updating cohort", error)
    res.status(500).json( { error: "Error updating cohort."})
  })
})

app.delete("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
  .then(result => {
    console.log("Cohort deleted")
    res.status(204).send();
  })
  .catch(error => {
    console.error("Error deleting cohort", error)
    res.status(500).json( {error: "Error deleting cohort"})
  })
})




const studentsRouter = require('./routes/students.routes.js')
app.use("/api/students", studentsRouter)

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter)

app.use(notFoundHandler);


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});