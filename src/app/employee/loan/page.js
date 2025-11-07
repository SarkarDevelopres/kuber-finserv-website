"use client"
import React, { useState, useEffect } from 'react'
import EmpSideBar from '@/components/EmpSideBar'
import { MdSearch, MdFilterList } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { toast } from 'react-toastify';
import { IoMdCloseCircle } from "react-icons/io";
import { useRouter } from 'next/navigation';
import SpinnerComp from '@/components/Spinner';

function LoanEmpPage() {
  const router = useRouter();
  const [loanList, setLoanList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [searchData, setSearchData] = useState({
    loanId: "",
    loanType: "",
    status: ""
  });
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Dummy data generator
  // const generateDummyLoans = (count: number): Loan[] => {
  //   const loanTypes = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Car Loan'];
  //   const statuses: ('applied' | 'Approved' | 'Rejected' | 'Disbursed')[] = ['applied', 'Approved', 'Rejected', 'Disbursed'];
  //   const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily'];
  //   const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];

  //   return Array.from({ length: count }, (_, index) => {
  //     const loanDate = new Date();
  //     loanDate.setDate(loanDate.getDate() - Math.floor(Math.random() * 30));

  //     return {
  //       _id: `loan_${index + 1}`,
  //       loanId: `LN${String(index + 1).padStart(5, '0')}`,
  //       loanType: loanTypes[Math.floor(Math.random() * loanTypes.length)],
  //       amount: Math.floor(Math.random() * 100000) + 5000,
  //       status: statuses[Math.floor(Math.random() * statuses.length)],
  //       createdAt: loanDate.toISOString(),
  //       customerName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
  //       customerEmail: `customer${index + 1}@email.com`,
  //       duration: Math.floor(Math.random() * 60) + 12,
  //       interest: Math.random() * 5 + 3.5
  //     };
  //   });
  // };

  const fetchLoanList = async () => {
    try {
      let adminToken = localStorage.getItem('adminToken')
      if (!adminToken || adminToken == "" || adminToken == null) {
        toast.error("Invaid Login");
        router.replace('/')
      }

      let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/fetchLoanList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
      });
      let res = await req.json();

      if (res.ok) {
        console.log(res);
        
        setLoanList([...res.data]);
        setTotalAmount(res.amount);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      toast.error('Failed to fetch loans');
    } finally {
      setIsLoading(false);
    }
  };

  const searchLoans = () => {
    let filtered = loanList;

    // Apply search filters
    if (searchData.loanId) {
      filtered = filtered.filter(loan =>
        loan.loanId.toLowerCase().includes(searchData.loanId.toLowerCase())
      );
    }

    if (searchData.loanType) {
      filtered = filtered.filter(loan =>
        loan.loanType.toLowerCase().includes(searchData.loanType.toLowerCase())
      );
    }

    if (searchData.status && searchData.status !== 'All') {
      filtered = filtered.filter(loan =>
        loan.status.toLowerCase().includes(searchData.status.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(loan => loan.status === selectedStatus);
    }

    setFilteredLoans(filtered);

    // if (filtered.length === 0) {
    //   toast.info('No loans found matching your criteria');
    // }
  };

  const resetSearch = () => {
    setSearchData({ loanId: "", loanType: "", status: "" });
    setSelectedStatus('All');
    setFilteredLoans(loanList);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/20 text-green-400';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Rejected':
        return 'bg-red-500/20 text-red-400';
      case 'Disbursed':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getLoanTypeColor = (loanType) => {
    switch (loanType) {
      case 'Personal Loan':
        return 'text-purple-400';
      case 'Home Loan':
        return 'text-blue-400';
      case 'Business Loan':
        return 'text-green-400';
      case 'Education Loan':
        return 'text-orange-400';
      case 'Car Loan':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  useEffect(() => {
    // fetchLoanList();
  }, []);

  useEffect(() => {
    searchLoans();
  }, [selectedStatus, loanList]);

  const statusCounts = {
    All: loanList.length,
    Pending: loanList.filter(loan => loan.status === 'applied').length,
    Approved: loanList.filter(loan => loan.status === 'approved').length,
    Rejected: loanList.filter(loan => loan.status === 'rejected').length,
    Disbursed: loanList.filter(loan => loan.status === 'disbursed').length,
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <EmpSideBar page={"loan"} />
      {isLoading && <SpinnerComp />}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Loan Management</h1>
          <p className="text-gray-400">Manage and track all loan applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`bg-gray-800 rounded-2xl p-4 border cursor-pointer transition-all duration-200 ${selectedStatus === status
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600'
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{status}</p>
                  <h3 className="text-2xl font-bold text-white">{count}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'All' ? 'bg-blue-500/20' :
                  status === 'Pending' ? 'bg-yellow-500/20' :
                    status === 'Approved' ? 'bg-green-500/20' :
                      status === 'Rejected' ? 'bg-red-500/20' :
                        'bg-blue-500/20'
                  }`}>
                  <FaFileInvoiceDollar className={
                    status === 'All' ? 'text-blue-400' :
                      status === 'Pending' ? 'text-yellow-400' :
                        status === 'Approved' ? 'text-green-400' :
                          status === 'Rejected' ? 'text-red-400' :
                            'text-blue-400'
                  } />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <MdSearch className="text-blue-400" />
            <span>Search Loans</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Loan ID"
              value={searchData.loanId}
              onChange={(e) => setSearchData(prev => ({ ...prev, loanId: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Loan Type"
              value={searchData.loanType}
              onChange={(e) => setSearchData(prev => ({ ...prev, loanType: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={searchData.status}
              onChange={(e) => setSearchData(prev => ({ ...prev, status: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="applied">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="disbursed">Disbursed</option>
            </select>
            <div className="flex space-x-3">
              <button
                onClick={searchLoans}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <MdSearch size={18} />
                <span>Search</span>
              </button>
              <button
                onClick={resetSearch}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Loan Applications</h3>
            <div className="text-gray-400 text-sm">
              Showing <span className="text-white font-semibold">{filteredLoans.length}</span> of <span className="text-white font-semibold">{loanList.length}</span> loans
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Loan ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Loan Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Interest</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLoans.map((loan, index) => (
                  <tr
                    key={loan._id}
                    onClick={() => setCurrentLoan(loan)}
                    className="hover:bg-gray-700/50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                      {loan.loanId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-white font-medium text-sm">{loan.customerName}</p>
                        <p className="text-gray-400 text-xs">{loan.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getLoanTypeColor(loan.loanType)}`}>
                        {loan.loanType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      {formatCurrency(loan.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {loan.duration} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {loan.interest}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(loan.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLoans.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <FaFileInvoiceDollar className="text-gray-500 text-4xl mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No loans found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Total Amount Footer */}
        <div className="mt-4 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Loan Amount</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Average Loan Size</p>
              <p className="text-xl font-semibold text-white">
                {formatCurrency(totalAmount/2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanEmpPage