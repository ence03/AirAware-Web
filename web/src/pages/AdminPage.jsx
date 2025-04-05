import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  FaUsers,
  FaDesktop,
  FaEye,
  FaCog,
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
  FaPlusCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import { useDeviceStore } from "../store/deviceStore";

const AdminPage = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false); // New state for creating user
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [expandedUsers, setExpandedUsers] = useState([]);
  const navigate = useNavigate();

  const {
    users,
    isLoading: userLoading,
    error: userError,
    fetchUsers,
    deleteUser,
    editUser,
    createUser,
  } = useUserStore();
  const { logout } = useAuthStore();
  const {
    devices,
    isLoading: deviceLoading,
    error: deviceError,
    getDevices,
    enableDisableDevice,
  } = useDeviceStore();

  useEffect(() => {
    fetchUsers();
    getDevices();
  }, [fetchUsers, getDevices]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleViewAccount = () => {
    console.log("Viewing account...");
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  const handleEditUser = (user) => {
    setEditUserData(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editUserData) {
      await editUser(editUserData._id, editUserData);
      setShowEditModal(false);
    }
  };

  const handleCreateUser = async () => {
    await createUser(newUserData); // Call the createUser method from the store
    setShowCreateUserModal(false);
    setNewUserData({ username: "", email: "", password: "", role: "" }); // Reset the form after creating user
  };

  const handleToggleDevices = (userId) => {
    setExpandedUsers((prevState) =>
      prevState.includes(userId)
        ? prevState.filter((id) => id !== userId)
        : [...prevState, userId]
    );
  };

  const handleToggleDeviceStatus = async (deviceId, isConnected) => {
    // Toggle the device status
    await enableDisableDevice(deviceId, !isConnected); // Flip the status

    await getDevices();
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
          <div className="relative">
            <button
              className="flex items-center text-gray-600 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowSettings(!showSettings)}
            >
              <FaCog className="text-2xl" />
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                <ul className="py-2">
                  <li>
                    <button
                      onClick={handleViewAccount}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      <FaEye className="inline mr-2" /> View Account
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        <Tabs>
          <TabList className="flex space-x-4 border-b-2 pb-4 mb-6">
            <Tab
              className="px-4 py-2 text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600 focus:outline-none"
              selectedClassName="text-blue-600 border-b-2 border-blue-600"
            >
              <FaUsers className="inline mr-2" /> Users
            </Tab>
            <Tab
              className="px-4 py-2 text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600 focus:outline-none"
              selectedClassName="text-blue-600 border-b-2 border-blue-600"
            >
              <FaDesktop className="inline mr-2" /> Devices
            </Tab>
          </TabList>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center mb-4"
            >
              <FaPlusCircle className="mr-2" /> Add User
            </button>
            {userLoading ? (
              <div className="text-center text-blue-500">Loading users...</div>
            ) : userError ? (
              <div className="text-center text-red-500">{userError}</div>
            ) : (
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id || user.username}>
                        <td className="px-6 py-4">
                          {user.username || "No Username"}
                        </td>
                        <td className="px-6 py-4">
                          {user.email || "No Email"}
                        </td>
                        <td className="px-6 py-4">{user.role || "No Role"}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleDeleteUser(user._id || user.username)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash className="inline mr-2" /> Delete
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-800 ml-4"
                          >
                            <FaEdit className="inline mr-2" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center px-6 py-4">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </TabPanel>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Devices
            </h2>
            {deviceLoading ? (
              <div className="text-center text-blue-500">
                Loading devices...
              </div>
            ) : deviceError ? (
              <div className="text-center text-red-500">{deviceError}</div>
            ) : (
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Device</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.length > 0 &&
                    users.map((user) => {
                      if (user.role === "admin") return null;

                      const userDevices = devices.filter(
                        (device) => device.user?.username === user.username
                      );
                      return (
                        <React.Fragment key={user.username}>
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-left">
                              <button
                                onClick={() =>
                                  handleToggleDevices(user.username)
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {expandedUsers.includes(user.username) ? (
                                  <FaChevronUp className="inline mr-2" />
                                ) : (
                                  <FaChevronDown className="inline mr-2" />
                                )}
                                Devices for {user.username}
                              </button>
                            </td>
                          </tr>
                          {expandedUsers.includes(user.username) &&
                          userDevices.length > 0
                            ? userDevices.map((device) => (
                                <tr key={device.id || device.name}>
                                  <td className="px-6 py-4">{device.name}</td>
                                  <td className="px-6 py-4">
                                    <span
                                      className={`${
                                        device.isConnected
                                          ? "text-green-600 font-semibold"
                                          : "text-red-600 font-semibold"
                                      }`}
                                    >
                                      {device.isConnected
                                        ? "Connected"
                                        : "Disconnected"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <button
                                      onClick={() =>
                                        handleToggleDeviceStatus(
                                          device._id,
                                          device.isConnected
                                        )
                                      }
                                      className={`${
                                        device.isConnected
                                          ? "bg-red-500 text-white hover:bg-red-600"
                                          : "bg-green-500 text-white hover:bg-green-600"
                                      } px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
                                    >
                                      {device.isConnected
                                        ? "Disconnect"
                                        : "Connect"}
                                    </button>
                                  </td>
                                </tr>
                              ))
                            : null}
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            )}
          </TabPanel>
        </Tabs>

        {/* Edit User Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-md p-6 w-96">
              <h3 className="text-xl font-semibold mb-4">Edit User</h3>
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  value={editUserData.username}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Role</label>
                <select
                  value={editUserData.role}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateUserModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-md p-6 w-96">
              <h3 className="text-xl font-semibold mb-4">Create New User</h3>
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  value={newUserData.username}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      role: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 px-4 py-2 rounded-md"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCreateUser}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateUserModal(false)}
                  className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
