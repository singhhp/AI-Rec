const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    usernameExsist: String,
    name: String,
    mobileNumber: String,
    email: String,
    skills:[String], // Array of strings representing skillsData
    degree: String,
    rating: String,
    predict: String
})

const EmployeeModel = mongoose.model("employees", EmployeeSchema)
module.exports = EmployeeModel
