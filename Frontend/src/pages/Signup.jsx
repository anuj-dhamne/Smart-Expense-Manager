import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        budgetAmount: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, name, email, password, budgetAmount } = formData;
        if (
            !username.trim() ||
            !name.trim() ||
            !email.trim() ||
            !password.trim() ||
            !budgetAmount.trim()
        ) {
            toast.error("All fields are required.");
            return;
        }

        const payload = new FormData();
        payload.append("username", formData.username.trim());
        payload.append("name", name.trim());
        payload.append("email", email.trim());
        payload.append("password", password.trim());
        payload.append("budgetAmount", budgetAmount.trim());
        if (avatar) payload.append("avatar", avatar);

        for (let [key, value] of payload.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER}/users/register`,
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success("Registration successful!");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            if(error.status===404){
                toast.error("Username or Email already taken !")
            }else if(error.status===400){
                toast.error("Unable to Upload Avatar");
            }else{
                toast.error("Registeration Failed !");
            }
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 w-full max-w-md space-y-4"
                >
                    <h2 className="text-2xl font-bold text-center text-[#4b74ed]">Sign Up</h2>

                    {["username", "name", "email", "budgetAmount"].map((field) => (
                        <div key={field}>
                            <label className="block mb-1 font-semibold text-gray-700 capitalize">
                                {field === "budgetAmount" ? "Monthly Budget (₹)" : field}
                            </label>
                            <input
                                type={field === "budgetAmount" ? "number" : "text"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[#66c1ba]"
                                required
                            />
                        </div>
                    ))}

                    {/* Password Field with toggle */}
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[#66c1ba]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-2 text-gray-500 hover:text-[#4b74ed] transition"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Avatar (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="w-full text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4b74ed] hover:bg-[#3a5fc7] text-white font-bold py-2 px-4 rounded-lg transition flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        ) : (
                            "Register →"
                        )}
                    </button>
                    <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#4b74ed] hover:underline font-medium">
                        Login
                    </Link>
                </p>
                </form>
                

            </div>

        </>

    );
};

export default Signup;
