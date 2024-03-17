import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

export default function Dashboard({ username }) {
    const navigate = useNavigate();
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEmployeeList, setShowEmployeeList] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchEmployeeList();
    }, []); 

    const fetchEmployeeList = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3030/employeeList');
            setEmployeeList(response.data); 
        } catch (error) {
            console.error('Error fetching employee list:', error);
        }
    };

    const handleLogout = () => {
        navigate('/');
    }

    const handleAddEmployee = () => {
        setShowAddForm(true);
    }

    const handleToggleEmployeeList = () => {
        setShowEmployeeList(prevState => !prevState);
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const filteredEmployees = employeeList.filter((employee) => {
        const name = employee.f_Name ? employee.f_Name.toLowerCase() : '';
        const email = employee.f_Email ? employee.f_Email.toLowerCase() : '';
        const mobile = employee.f_Mobile ? employee.f_Mobile.toLowerCase() : '';
        const designation = employee.f_Designation ? employee.f_Designation.toLowerCase() : '';
        const gender = employee.f_gender ? employee.f_gender.toLowerCase() : '';
    
        return (
            name.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase()) ||
            mobile.includes(searchTerm.toLowerCase()) ||
            designation.includes(searchTerm.toLowerCase()) ||
            gender.includes(searchTerm.toLowerCase())
        );
    });
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    
    

    const handleDeleteEmployee = async (employeeId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:3030/deleteEmployee/${employeeId}`);
            console.log(response.data.message);
            // Update the employee list after successful deletion
            fetchEmployeeList();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }

    const handleEditEmployee = async (employeeId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:3030/getEmployee/${employeeId}`);
            setSelectedEmployee(response.data); // Update state with employee details
            setShowAddForm(true); // Show the form for editing
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const employeeData = {};
        // Populate employeeData with form values
        // (similar to your existing code for adding employees)
        try {
            if (selectedEmployee) {
                // If selectedEmployee exists, update employee
                const response = await axios.put(`http://127.0.0.1:3030/updateEmployee/${selectedEmployee._id}`, employeeData);
                console.log(response.data.message);
            } else {
                // Otherwise, add new employee
                const response = await axios.post('http://127.0.0.1:3030/addEmployee', employeeData);
                console.log(response.data.message);
            }
            // Reset form and selectedEmployee state
            event.target.reset();
            setSelectedEmployee(null);
            setShowAddForm(false);
            // Update the employee list after successful addition/update
            fetchEmployeeList();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <div className='logo'>Logo</div>
            <div className='nav'>
                <div>Username: {username}</div>
                <div><button className='button' onClick={handleLogout}>Logout</button></div>
            </div>

            <div className="container">
                <h1>Welcome to Admin Panel</h1>
                <div className='section'>
                <div><button className='button' onClick={handleToggleEmployeeList}>
                        <span className=''></span> {showEmployeeList ? 'Hide Employee List' : 'Show Employee List'}
                    </button></div>
                    <div><button className='button' onClick={handleAddEmployee}> <span className='add-icon'></span> Add Employee</button></div>
                </div>
            </div>

            {/* Add Employee Form */}
            {showAddForm && (
                <form className="addEmployeeForm" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="f_Name" id="name" required /><br />
                    <label htmlFor="email">Email</label>
                    <input type="email" name="f_Email" id="email" required /><br />
                    <label htmlFor='mobile'>Mobile no</label>
                    <input type="tel" name="f_Mobile" id="mobile" required /><br />
                    <label htmlFor="designation">Designation</label>
                    <select name="f_Designation" id="designation" required>
                        <option value="">Select Designation</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="sales">Sales</option>
                    </select><br />
                    <label htmlFor="gender">Gender</label>
                    <div className="radiobuttons">
                        <input type="radio" name="f_gender" value="male" id="male" required />
                        <label htmlFor="male">Male</label>
                        <input type="radio" name="f_gender" value="female" id="female" required />
                        <label htmlFor="female">Female</label><br />
                    </div><br />
                    <label htmlFor="course">Course</label>
                    <div className="checkboxes">
                        <input type="checkbox" name="f_Course" value="MCA" id="MCA" />
                        <label htmlFor="MCA">M.C.A.</label>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <input type="checkbox" name="f_Course" value="BCA" id="BCA" />
                        <label htmlFor="BCA">B.C.A.</label>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <input type="checkbox" name="f_Course" value="BSC" id="BSC" />
                        <label htmlFor="BSC">B.S.C.</label><br />
                    </div>
                    <label htmlFor="image">Image Upload (JPG/PNG only)</label>
                    <input type="file" name="f_Image" id="image" accept=".jpg, .jpeg, .png" required /><br />
                    <button type="submit">Add Employee</button>
                </form>
            )}

            {/* Employee List Table */}
            {showEmployeeList && (
                <div className="container">
                    <h2>Employee List</h2>
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                    <table className="employeeTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Designation</th>
                                <th>Gender</th>
                                <th>Courses</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEmployees.map((employee) => (
                                <tr key={employee.f_Id}>
                                    <td>{employee.f_Name}</td>
                                    <td>{employee.f_Email}</td>
                                    <td>{employee.f_Mobile}</td>
                                    <td>{employee.f_Designation}</td>
                                    <td>{employee.f_gender}</td>
                                    <td>{employee.f_Course ? employee.f_Course.join(', ') : ''}</td>
                                    <td><img src={employee.f_Image} alt="Employee" /></td>
                                    <td>
                                        {/* Edit and Delete buttons */}
                                        <button onClick={() => handleEditEmployee(employee._id)}>Edit</button>
                                        <button onClick={() => handleDeleteEmployee(employee._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {filteredEmployees.length > employeesPerPage && (
                            <ul className="pagination">
                                {Array(Math.ceil(filteredEmployees.length / employeesPerPage)).fill().map((_, i) => (
                                    <li key={i} className={currentPage === i + 1 ? 'active' : ''}>
                                        <button onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
