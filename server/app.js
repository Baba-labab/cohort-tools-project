const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors")
const mongoose = require("mongoose")
const Student = require("./models/Student.model.js")
const Cohort = require("./models/Cohort.model.js")

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


//STUDENTS
app.get("/api/students", (req, res) => {
   Student.find({})
  .then(students => {
    console.log("Retrieved students:", students)
     res.status(200).json(students);
  })
  .catch(error => {
    console.error("Error while retrieving students data", error)
    res.status(500).json({ error: "Failed to retrieve students data"})
  })
});

app.post("/api/students", (req, res) => {
   Student.create(req.body)
  .then(createdStudent => {
    console.log("Retrieved students:", createdStudent)
     res.status(200).json(createdStudent);
  })
  .catch(error => {
    console.error("Error while creating student", error)
    res.status(500).json({ error: "Failed to create student"})
  })
});

//Get all students of a given cohort
app.get("/api/students/cohort/:cohortId", (req, res) => {
   Student.find({ cohort: req.params.cohortId })
   .populate("cohort")
  .then(students => {
    console.log("Retrieved students:", students)
     res.status(200).json(students);
  })
  .catch(error => {
    console.error("Error while retrieving students of cohort.", error)
    res.status(500).json({ error: "Failed to retrieve students of cohort."})
  })
});

//Get specific student by Id
app.get("/api/students/:studentId", (req, res) => {
   Student.findById(req.params.studentId)
  .then(student => {
    console.log("Retrieved student:", student)
     res.status(200).json(student);
  })
  .catch(error => {
    console.error("Error while retrieving students data", error)
    res.status(500).json({ error: "Failed to retrieve students data"})
  })
});

app.put("/api/students/:studentId", (req, res) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
  .then(updatedStudent => {
    console.log("Updated student", updatedStudent)
    res.status(200).json(updatedStudent)
  })
  .catch(error => {
    console.error("Error updating student", error)
    res.status(500).json( { error: "Error updating student."})
  })
})

app.delete("api/students/:studentId", (req, res) => {
 Student.findByIdAndDelete(req.params.studentId)
  .then(result => {
    console.log("Student deleted")
    res.status(204).send();
  })
  .catch(error => {
    console.error("Error deleting student", error)
    res.status(500).json( {error: "Error deleting studet"})
  })
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});