"use client"
import React, { useState, useEffect } from 'react'
import AdminSideBar from '@/components/AdminSideBar'
import { MdSearch, MdPhone, MdEmail, MdPerson } from "react-icons/md";
import { FaUser, FaBuilding } from "react-icons/fa";
import { toast } from 'react-toastify';
import SpinnerComp from '@/components/Spinner';
import { useRouter } from 'next/navigation';
import { log } from 'node:console';

interface User {
  _id: string;
  userId: string;
  username: string;
  email: string;
  phone: string;
  totalContacts: number;
  createdAt: string;
}

interface Contact {
  _id: string;
  contactId: string;
  name: string;
  phones: any;
  emails: any;
}

function ContactPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data generator for users
  // const generateDummyUsers = (count: number): User[] => {
  //   const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'Michael', 'Jessica'];
  //   const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

  //   return Array.from({ length: count }, (_, index) => {
  //     const createdAt = new Date();
  //     createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

  //     return {
  //       _id: `user_${index + 1}`,
  //       userId: `USR${String(index + 1).padStart(5, '0')}`,
  //       name: `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`,
  //       email: `${firstNames[index % firstNames.length].toLowerCase()}.${lastNames[index % lastNames.length].toLowerCase()}@email.com`,
  //       phone: `+1${5550000000 + index}`,
  //       totalContacts: Math.floor(Math.random() * 20) + 5,
  //       createdAt: createdAt.toISOString()
  //     };
  //   });
  // };

  // // Dummy data generator for contacts
  // const generateDummyContacts = (userId: string, count: number): Contact[] => {
  //   const firstNames = ['Alex', 'Maria', 'James', 'Emma', 'William', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Ava'];
  //   const lastNames = ['Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson'];
  //   const companies = ['Tech Corp', 'Global Solutions', 'Innovate Inc', 'Future Enterprises', 'Digital Systems'];
  //   const relationships = ['Friend', 'Family', 'Colleague', 'Business Partner', 'Client', 'Relative'];

  //   return Array.from({ length: count }, (_, index) => {
  //     const contactDate = new Date();
  //     contactDate.setDate(contactDate.getDate() - Math.floor(Math.random() * 60));

  //     return {
  //       _id: `contact_${userId}_${index + 1}`,
  //       contactId: `CT${String(index + 1).padStart(5, '0')}`,
  //       name: `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`,
  //       phone: `+1${5551000000 + (index * 1111)}`,
  //       email: `${firstNames[index % firstNames.length].toLowerCase()}.${lastNames[index % lastNames.length].toLowerCase()}@contact.com`,
  //     };
  //   });
  // };

  const fetchUsers = async () => {
    try {
      let adminToken = localStorage.getItem('adminToken')
      if (!adminToken || adminToken == "" || adminToken == null) {
        toast.error("Invaid Login");
        router.replace('/')
      }
      let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/fetchUserwContact`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,   // send token in header
        },
      });
      let res = await req.json();
      if (res.ok) {
        console.log(res);        
        setUsers([...res.userlist]);
        setContacts([...res.firstUserContacts])
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserContacts = async (userId: string) => {
    try {
      
      setIsLoading(true);
       let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/fetchConatcListforUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({userId:userId}),
      });
      let res = await req.json();

      if (res.ok) {
        setContacts([...res.data]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    console.log(user);
    
    await fetchUserContacts(user._id);
    setSearchTerm(""); // Reset search when switching users
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredContacts = contacts.filter(contact => {
  const nameMatch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase());
  const phoneMatch = contact.phones?.[0]?.includes(searchTerm);
  const emailMatch = contact.emails?.[0]?.toLowerCase().includes(searchTerm.toLowerCase());

  return nameMatch || phoneMatch || emailMatch;
});


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <AdminSideBar page={"cnct"} />
      {isLoading && <SpinnerComp />}
      <div className="flex-1 flex sticky top-0">
        {/* Users Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-screen sticky top-0">
          {/* Header - Fixed */}
          <div className="flex-shrink-0">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white mb-2">Users</h2>
              <p className="text-gray-400 text-sm">Select a user to view their contacts</p>
            </div>

            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Users List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`p-4 border-b border-gray-700 cursor-pointer transition-colors duration-200 ${selectedUser?._id === user._id
                    ? 'bg-blue-500/20 border-blue-500/30'
                    : 'hover:bg-gray-700/50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.username.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{user.username}</h3>
                    <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-blue-400 text-xs font-medium">
                        {user.totalContacts} contacts
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts Main Content */}
        <div className="flex-1 p-8">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {selectedUser.username.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).join('')}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{selectedUser.username}'s Contacts</h1>
                    <p className="text-gray-400">
                      {selectedUser.totalContacts} contacts • Last active {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <MdSearch className="text-blue-400" />
                    <span>Search Contacts</span>
                  </h3>
                  <div className="text-gray-400 text-sm">
                    Showing <span className="text-white font-semibold">{filteredContacts.length}</span> contacts
                  </div>
                </div>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Contacts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-lg ">{contact.name}</h4>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MdPhone className="text-blue-400 text-lg" />
                        <span className="text-white font-medium">{contact.phones[0]}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MdEmail className="text-green-400 text-lg" />
                        <span className="text-gray-300 text-sm truncate">{contact.emails[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredContacts.length === 0 && searchTerm && (
                <div className="text-center py-12">
                  <MdPerson className="text-gray-500 text-4xl mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No contacts found</p>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your search terms</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <MdPerson className="text-gray-500 text-4xl mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Select a user to view their contacts</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactPage