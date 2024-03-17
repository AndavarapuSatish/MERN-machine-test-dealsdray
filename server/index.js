var express = require("express");
var cors = require("cors");
var mongoClient = require("mongodb").MongoClient;

var conStr = "mongodb://127.0.0.1:27017";

var app = express();

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/users", (req, res)=>{
    mongoClient.connect(conStr)
    .then(obj=>{
      var database = obj.db("dd-assignment");
      database.collection("t_login").find({}).toArray().then(documents=>{
        res.send(documents);
        res.end();
      })
    })
    .catch(err=>{
        console.log(err);
    })
});

app.post("/addEmployee", (req, res) => {
    const employeeData = req.body;
    mongoClient.connect(conStr)
        .then(obj => {
            var database = obj.db("dd-assignment");
            database.collection("t_Employee").insertOne(employeeData)
                .then(result => {
                    console.log("Employee added successfully:", result);
                    res.status(200).json({ message: "Employee added successfully" });
                })
                .catch(error => {
                    console.error("Error adding employee:", error);
                    res.status(500).json({ error: "Failed to add employee" });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Database connection error" });
        });
});

app.get("/employeeList", (req, res)=>{
    mongoClient.connect(conStr)
    .then(obj=>{
      var database = obj.db("dd-assignment");
      database.collection("t_Employee").find({}).toArray().then(documents=>{
        res.send(documents);
        res.end();
      })
    })
    .catch(err=>{
        console.log(err);
    })
});

app.delete("/deleteEmployee/:id", (req, res) => {
    const employeeId = req.params.id;
    mongoClient.connect(conStr)
        .then(obj => {
            var database = obj.db("dd-assignment");
            database.collection("t_Employee").deleteOne({ _id: employeeId })
                .then(result => {
                    if (result.deletedCount === 1) {
                        console.log("Employee deleted successfully:", result);
                        res.status(200).json({ message: "Employee deleted successfully" });
                    } else {
                        console.log("No employee found with the given ID");
                        res.status(404).json({ error: "No employee found with the given ID" });
                    }
                })
                .catch(error => {
                    console.error("Error deleting employee:", error);
                    res.status(500).json({ error: "Failed to delete employee" });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Database connection error" });
        });
});

app.get("/getEmployee/:id", (req, res) => {
    const employeeId = req.params.id;
    mongoClient.connect(conStr)
        .then(obj => {
            var database = obj.db("dd-assignment");
            database.collection("t_Employee").findOne({ _id: employeeId })
                .then(employee => {
                    if (employee) {
                        console.log("Employee details retrieved successfully:", employee);
                        res.status(200).json(employee);
                    } else {
                        console.log("No employee found with the given ID");
                        res.status(404).json({ error: "No employee found with the given ID" });
                    }
                })
                .catch(error => {
                    console.error("Error fetching employee details:", error);
                    res.status(500).json({ error: "Failed to fetch employee details" });
                });
        })
        .catch(err => {
            console.error("Database connection error:", err);
            res.status(500).json({ error: "Database connection error" });
        });
});

// Add a new endpoint to update employee details by ID
app.put("/updateEmployee/:id", (req, res) => {
    const employeeId = req.params.id;
    const updatedEmployeeData = req.body;
    mongoClient.connect(conStr)
        .then(obj => {
            var database = obj.db("dd-assignment");
            database.collection("t_Employee").updateOne({ _id: employeeId }, { $set: updatedEmployeeData })
                .then(result => {
                    if (result.modifiedCount === 1) {
                        console.log("Employee updated successfully:", result);
                        res.status(200).json({ message: "Employee updated successfully" });
                    } else {
                        console.log("No employee found with the given ID");
                        res.status(404).json({ error: "No employee found with the given ID" });
                    }
                })
                .catch(error => {
                    console.error("Error updating employee details:", error);
                    res.status(500).json({ error: "Failed to update employee details" });
                });
        })
        .catch(err => {
            console.error("Database connection error:", err);
            res.status(500).json({ error: "Database connection error" });
        });
});

app.listen(3030);
console.log("Server started : http://127.0.0.1:3030");