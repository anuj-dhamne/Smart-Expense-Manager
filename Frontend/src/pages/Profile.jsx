import { useState } from "react";
import { Camera } from "lucide-react";
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast'
import axios from "axios";

const Profile = () => {

  const userInfo = useAuthStore((state) => state.user);

  const [user, setUser] = useState(userInfo);
  const [passwordPopup, setPasswordPopup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field) => {
  setUser((prev) => ({
    ...prev,
    [field]: !prev[field],
  }));
  };

const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.patch(
      `${import.meta.env.VITE_SERVER}/users/update-avatar`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    setUser((prev) => ({
      ...prev,
      avatar: res.data.data.avatar,
    }));

    toast.success("Avatar updated!");
    // update Zustand store
    const updateUser = useAuthStore.getState().login;
    updateUser(res.data.data);

  } catch (err) {
    console.error(err);
    toast.error("Failed to upload avatar.");
  }
};

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // const formData = new FormData();
      // formData.append("name", user.name);
      // formData.append("email", user.email);
      // formData.append("budgetAmount", user.budgetAmount);
      // formData.append("budgetSurpassAlert", user.budgetSurpassAlert);
      // formData.append("isMailAllow", user.isMailAllow);

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/update-details`,
        {
          name :user.name,
          email:user.email,
          budgetAmount:user.budgetAmount,
          budgetSurpassAlert:user.budgetSurpassAlert,
          isMailAllow:user.isMailAllow
        },
        {
          withCredentials: true,
        }
      );
      console.log("Res in Profile : ",res);
      toast.success("Profile updated successfully!");

      // Optional: Update Zustand store with new data
      const updateUser = useAuthStore.getState().login;
      updateUser(res.data.data); // assuming backend returns updated user

    } catch (err) {
      console.error(err);
      if(err.status===400){
        toast.error("Email is already exists !");
      }else{
        toast.error("Failed to update profile.");
      }
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/users/change-password`,
        {
          oldPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      toast.success("Password changed successfully!");
      setPasswordPopup(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to change password.";
      toast.error(msg);
    }
  };


  return (
    <div className="flex-1 bg-gray-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-[#4b74ed] mb-6">Profile</h1>

      <form onSubmit={handleSave} className="space-y-10">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left section: Editable fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Monthly Budget (₹)</label>
              <input
                type="number"
                name="budgetAmount"
                value={user.budgetAmount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Notifications */}
            <div className="space-y-3">
              <p className="font-semibold text-gray-700">Notifications</p>
              <div className="flex justify-between items-center">
                <span>• Budget Surpass Alert</span>
                <input
                  type="checkbox"
                  checked={user.budgetSurpassAlert}
                  onChange={() => handleToggle("budgetSurpassAlert")}
                  className="scale-125"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>• Monthly Summary Email</span>
                <input
                  type="checkbox"
                  checked={user.isMailAllow}
                  onChange={() => handleToggle("isMailAllow")}
                  className="scale-125"
                />
              </div>
            </div>
          </div>

          {/* Right section: Avatar, username, password */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-28 h-28">
              <img
                src={
                  user.avatar ||
                  "https://ui-avatars.com/api/?name=User&background=66c1ba&color=fff"
                }
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
                <Camera size={16} />
                <input type="file" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <p className="font-semibold text-gray-700">{user.username}</p>
            <button
              type="button"
              onClick={() => setPasswordPopup(true)}
              className="text-sm text-[#4b74ed] underline hover:text-[#3a5fc7]"
            >
              change password
            </button>
          </div>
        </div>

        {/* Save Changes */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#4b74ed] hover:bg-[#3a5fc7] text-white px-6 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Password Popup */}
      {passwordPopup && (
        <>
          <div
            onClick={() => setPasswordPopup(false)}
            className="fixed inset-0 bg-black/30 z-10"
          />
          <div className="fixed bg-white p-6 rounded-lg shadow-lg z-20 w-80 max-w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-4">
            <h2 className="text-lg font-semibold text-[#4b74ed]">Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <button
              onClick={handleChangePassword}
              className="w-full bg-[#66c1ba] hover:bg-[#58a69f] text-white py-2 rounded"
            >
              Change
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
