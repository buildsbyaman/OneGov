import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  UserPlus,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  Shield,
  CheckCircle2,
} from "lucide-react";

interface SignupScreenProps {
  onSwitchToLogin: () => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function SignupScreen({ onSwitchToLogin }: SignupScreenProps) {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    state: "",
    occupation: "Student",
    annual_income: null,
    gender: "Male",
    category: "General",
    age: "",
    aadhaar_number: "",
    pan_number: "",
    voter_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (
      !/^[2-9]{1}[0-9]{11}$/.test(formData.aadhaar_number) ||
      /^([0-9])\1{11}$/.test(formData.aadhaar_number)
    ) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    const pan = formData.pan_number.toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      setError("Please enter a valid PAN number (e.g. ABCDE1234F)");
      return;
    }
    if (
      formData.age &&
      (Number(formData.age) < 1 || Number(formData.age) > 120)
    ) {
      setError("Please enter a valid age between 1 and 120");
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        phone: formData.phone,
        state: formData.state,
        occupation: formData.occupation as any,
        annual_income: formData.annual_income,
        gender: formData.gender as any,
        category: formData.category as any,
        age: formData.age ? Number(formData.age) : undefined,
        preferred_language: "English",
        aadhaar_number: formData.aadhaar_number,
        pan_number: pan,
        voter_id: formData.voter_id,
      });
    } catch (error: any) {
      setError(error?.message || error?.error || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  function formatIndianNumber(x: string | number) {
    let num = typeof x === "number" ? x.toString() : x;
    num = num.replace(/,/g, "");
    if (!num) return "";
    const lastThree = num.substring(num.length - 3);
    const otherNumbers = num.substring(0, num.length - 3);
    return (
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherNumbers ? "," : "") +
      lastThree
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "annual_income") {
      const raw = value.replace(/,/g, "").replace(/[^\d]/g, "");
      setFormData((prev) => ({
        ...prev,
        annual_income: raw ? Number(raw) : "",
      }));
    } else if (name === "pan_number") {
      setFormData((prev) => ({
        ...prev,
        pan_number: value.toUpperCase(),
      }));
    } else if (name === "age") {
      const ageValue = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({
        ...prev,
        age: ageValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-orange-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-green-100/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 animate-fade-in">
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-lg shadow-orange-600/30 transform hover:scale-105 transition-transform duration-300 overflow-hidden">
            <img
              src="/favicon.png"
              alt="OneGov Logo"
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Join OneGov
          </h1>
          <p className="text-base text-gray-600">
            Register to discover government schemes you're eligible for
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 p-8 animate-slide-up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-sm text-gray-600">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select your state</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Occupation
                  </label>
                  <select
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Student">Student</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business">Business Owner</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="annual_income"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Annual Income (₹)
                  </label>
                  <input
                    id="annual_income"
                    name="annual_income"
                    type="text"
                    inputMode="numeric"
                    value={formatIndianNumber(formData.annual_income ?? "")}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter annual income"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="text"
                    inputMode="numeric"
                    value={formData.age}
                    onChange={handleChange}
                    maxLength={3}
                    className="input-field"
                    placeholder="Enter your age"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Security
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Document Verification
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="aadhaar_number"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Aadhaar Number *
                  </label>
                  <input
                    id="aadhaar_number"
                    name="aadhaar_number"
                    type="text"
                    value={formData.aadhaar_number}
                    onChange={handleChange}
                    required
                    maxLength={12}
                    minLength={12}
                    pattern="[2-9]{1}[0-9]{11}"
                    className="input-field"
                    placeholder="12-digit Aadhaar number"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pan_number"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    PAN Number *
                  </label>
                  <input
                    id="pan_number"
                    name="pan_number"
                    type="text"
                    value={formData.pan_number}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    minLength={10}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    className="input-field uppercase"
                    placeholder="ABCDE1234F"
                    style={{ textTransform: "uppercase" }}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label
                    htmlFor="voter_id"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Voter ID Number
                  </label>
                  <input
                    id="voter_id"
                    name="voter_id"
                    type="text"
                    value={formData.voter_id}
                    onChange={handleChange}
                    className="input-field uppercase"
                    placeholder="ABC1234567"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm flex items-start gap-3 animate-scale-in">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="flex-1">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
