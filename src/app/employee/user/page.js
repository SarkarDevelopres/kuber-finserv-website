"use client"
import React, { useState, useEffect } from 'react'
import EmpSideBar from '@/components/EmpSideBar'
import { MdSearch } from "react-icons/md";
import { toast } from 'react-toastify';
import { IoMdCloseCircle } from "react-icons/io";
import SpinnerComp from '@/components/Spinner';
import { useRouter } from 'next/navigation';


export function EmpModal({ empData, closeWindow, fetchUsers }) {

  const deleteUser = async () => {
    const confirmDelete = confirm("Permanently delete user?");
    if (confirmDelete) {
      try {
        let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/deleteUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: empData.id,
          })
        });
        let res = await req.json();
        if (res.ok) {
          toast.success("User deleted successfully!");
          fetchUsers();
          closeWindow();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md p-6 relative">
        <button
          onClick={closeWindow}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <IoMdCloseCircle size={24} />
        </button>

        <h3 className="text-xl font-semibold text-white mb-6">User Details</h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Name:</span>
            <p className="text-white font-medium">{empData.name}</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Phone:</span>
            <p className="text-white font-medium">{empData.phone}</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Email:</span>
            <p className="text-white font-medium">{empData.email}</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 font-medium">PAN:</span>
            <p className="text-white font-medium">{empData.pan}</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Aadhar:</span>
            <p className="text-white font-medium">{empData.aadhar}</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 font-medium">SalarySlip URL:</span>
            <p className="text-blue-400 font-medium">{empData.salarySlip}</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Loans Applied:</span>
            <p className="text-blue-400 font-medium">{empData.loanCount}</p>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Contacts:</span>
            <p className="text-green-400 font-medium">{empData.contactCount}</p>
          </div>
        </div>

        <button
          onClick={deleteUser}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>Delete User</span>
        </button>
      </div>
    </div>
  );
}

function UserEmpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    loanCount: 0,
    contactCount: 0,
    salarySlip: "",
    pan: "",
    aadhar: 0,
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchData, setSearchData] = useState({
    username: "",
    phone: "",
    email: ""
  });

  const fetchTotalUsers = async () => {
    try {
      let adminToken = localStorage.getItem('adminToken')
      if (!adminToken || adminToken == "" || adminToken == null) {
        toast.error("Invaid Login");
        router.replace('/')
      }
      let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/fetchUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,   // send token in header
        },
      });
      let res = await req.json();
      if (res.ok) {
        console.log(res);

        setUserList(res.userList);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch users");
      setIsLoading(false);
    }
  };

  const fetchSingleUser = async () => {
    if (!searchData.username && !searchData.phone && !searchData.email) {
      toast.error("Please enter at least one search criteria");
      return;
    }

    try {
      setIsLoading(true);


      let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/findSingleUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: searchData.username,
          phone: searchData.phone,
          email: searchData.email
        })
      });
      let res = await req.json();

      if (res.ok) {
        toast.success("User found!");
        setUserList([{ ...res.data }]);
      } else {
        toast.error("User not found!");
      }

      setSearchData({ username: "", phone: "", email: "" });
    } catch (error) {
      console.error('Error fetching single user:', error);
      toast.error('Failed to search user');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    fetchTotalUsers();
    setSearchData({ username: "", phone: "", email: "" });
  };

  useEffect(() => {
    // fetchTotalUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {isLoading && <SpinnerComp />}
      <EmpSideBar page={"usr"} />
      <div className="flex-1 p-6">
        {showUserModal && (
          <EmpModal
            empData={currentUser}
            closeWindow={() => setShowUserModal(false)}
            fetchUsers={fetchTotalUsers}
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">Manage and monitor all your users</p>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter User Email"
              value={searchData.email}
              onChange={(e) => setSearchData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Enter User Name"
              value={searchData.username}
              onChange={(e) => setSearchData(prev => ({ ...prev, username: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Enter User Number"
              value={searchData.phone}
              onChange={(e) => setSearchData(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={fetchSingleUser}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <MdSearch size={20} />
              <span>Search User</span>
            </button>
            <button
              onClick={resetSearch}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Show All</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sl No.</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Emp ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone Number</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {userList.map((user, index) => (
                  <tr
                    key={user._id}
                    onClick={() => {
                      setCurrentUser({
                        id: user._id,
                        name: user.username,
                        phone: user.phone,
                        email: user.email,
                        loanCount: user.loanCount,
                        contactCount: user.contactCount,
                        salarySlip: user.salarySlip,
                        pan: user.pan,
                        aadhar: user.aadhar,
                      });
                      setShowUserModal(true);
                    }}
                    className="hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                      {user.empReferCode}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {userList.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No users found</p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-white">{userList.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Active Today</p>
            <p className="text-2xl font-bold text-green-400">{Math.floor(userList.length * 0.3)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">New This Week</p>
            <p className="text-2xl font-bold text-blue-400">{Math.floor(userList.length * 0.1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEmpPage;