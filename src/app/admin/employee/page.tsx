"use client"
import React, { useState, useEffect } from 'react'
import AdminSideBar from '@/components/AdminSideBar'
import { MdSearch, MdAdd } from "react-icons/md";
import { toast } from 'react-toastify';
import { IoMdCloseCircle, IoMdTrash } from "react-icons/io";
import { FiEdit, FiUser } from "react-icons/fi";
import SpinnerComp from '@/components/Spinner';

interface Employee {
  _id: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

interface EmpModalProps {
  empData: Employee;
  closeWindow: () => void;
  fetchEmployees: () => void;
}

interface EmpFormData {
  name: string;
  phone: string;
  password: string;
  email: string;
  department: string;
  position: string;
}

export function EmpModal({ empData, closeWindow, fetchEmployees }: EmpModalProps) {
  const deleteEmployee = async () => {
    const confirmDelete = confirm("Permanently delete employee?");
    if (confirmDelete) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Employee deleted successfully!");
        fetchEmployees();
        closeWindow();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md p-6 relative">
        <button
          onClick={closeWindow}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <IoMdCloseCircle size={24} />
        </button>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <FiUser className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Employee Details</h3>
            <p className="text-gray-400 text-sm">{empData.employee_id}</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 font-medium">Name:</span>
            <p className="text-white font-medium">{empData.name}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 font-medium">Phone:</span>
            <p className="text-white font-medium">{empData.phone}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 font-medium">Email:</span>
            <p className="text-white font-medium">{empData.email}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 font-medium">Department:</span>
            <p className="text-white font-medium">{empData.department}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 font-medium">Position:</span>
            <p className="text-white font-medium">{empData.position}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 font-medium">Join Date:</span>
            <p className="text-white font-medium">{formatDate(empData.joinDate)}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 font-medium">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              empData.status === 'Active' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {empData.status}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
            <FiEdit size={18} />
            <span>Edit</span>
          </button>
          <button
            onClick={deleteEmployee}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <IoMdTrash size={18} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Dummy data generator
const generateDummyEmployees = (count: number): Employee[] => {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'Michael', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support'];
  const positions = ['Manager', 'Developer', 'Analyst', 'Specialist', 'Coordinator', 'Associate'];
  
  return Array.from({ length: count }, (_, index) => {
    const joinDate = new Date();
    joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 24));
    
    return {
      _id: `emp_${index + 1}`,
      employee_id: `EMP${String(index + 1).padStart(3, '0')}`,
      name: `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`,
      email: `${firstNames[index % firstNames.length].toLowerCase()}.${lastNames[index % lastNames.length].toLowerCase()}@company.com`,
      phone: `+1${5550000000 + index}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      joinDate: joinDate.toISOString(),
      status: Math.random() > 0.2 ? 'Active' : 'Inactive'
    };
  });
};

function EmpPage() {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [empData, setEmpData] = useState<EmpFormData>({
    name: "",
    phone: "",
    password: "",
    email: "",
    department: "",
    position: ""
  });
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployees = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate dummy data
      const dummyEmployees = generateDummyEmployees(12);
      setEmployeeList(dummyEmployees);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };

  const addEmployee = async () => {
    if (!empData.name || !empData.phone || !empData.password || !empData.email || !empData.department || !empData.position) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEmployee: Employee = {
        _id: `emp_${Date.now()}`,
        employee_id: `EMP${String(employeeList.length + 1).padStart(3, '0')}`,
        name: empData.name,
        email: empData.email,
        phone: empData.phone,
        department: empData.department,
        position: empData.position,
        joinDate: new Date().toISOString(),
        status: 'Active'
      };

      setEmployeeList(prev => [newEmployee, ...prev]);
      setEmpData({ 
        name: "", 
        phone: "", 
        password: "", 
        email: "", 
        department: "", 
        position: "" 
      });
      toast.success("Employee added successfully!");
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  }

  const filteredEmployees = employeeList.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support'];
  const positions = ['Manager', 'Developer', 'Analyst', 'Specialist', 'Coordinator', 'Associate'];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <AdminSideBar page={"emp"} />
      
      <div className="flex-1 p-8">
        {showEmployeeModal && currentEmployee && (
          <EmpModal 
            empData={currentEmployee} 
            closeWindow={() => setShowEmployeeModal(false)} 
            fetchEmployees={fetchEmployees} 
          />
        )}
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Employee Management</h1>
          <p className="text-gray-400">Manage all employees in the organization</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Employees</p>
                <h3 className="text-2xl font-bold text-white">{employeeList.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <FiUser className="text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <h3 className="text-2xl font-bold text-white">
                  {employeeList.filter(emp => emp.status === 'Active').length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Departments</p>
                <h3 className="text-2xl font-bold text-white">{new Set(employeeList.map(emp => emp.department)).size}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <FiUser className="text-purple-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New This Month</p>
                <h3 className="text-2xl font-bold text-white">
                  {employeeList.filter(emp => {
                    const joinDate = new Date(emp.joinDate);
                    const now = new Date();
                    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                  }).length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <MdAdd className="text-orange-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search employees by name, email, ID, department, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Showing <span className="text-white font-semibold">{filteredEmployees.length}</span> of <span className="text-white font-semibold">{employeeList.length}</span> employees
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">All Employees</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee._id}
                    onClick={() => {
                      setCurrentEmployee(employee);
                      setShowEmployeeModal(true);
                    }}
                    className="hover:bg-gray-700/50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                      {employee.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-white font-medium">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'Active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Employee Form */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Add New Employee</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            <input
              type="text"
              placeholder="Full Name"
              value={empData.name}
              onChange={(e) => setEmpData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={empData.phone}
              onChange={(e) => setEmpData(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={empData.email}
              onChange={(e) => setEmpData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={empData.department}
              onChange={(e) => setEmpData(prev => ({ ...prev, department: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={empData.position}
              onChange={(e) => setEmpData(prev => ({ ...prev, position: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Position</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
            <input
              type="password"
              placeholder="Password"
              value={empData.password}
              onChange={(e) => setEmpData(prev => ({ ...prev, password: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={addEmployee}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <MdAdd size={20} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmpPage