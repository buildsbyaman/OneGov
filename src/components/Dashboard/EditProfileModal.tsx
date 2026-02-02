import React, { useState } from "react";
import { Profile } from "../../lib/api";

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

const OCCUPATIONS = [
  "Student",
  "Farmer",
  "Employed",
  "Self-Employed",
  "Business",
  "Unemployed",
  "Other",
];

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
const GENDERS = ["Male", "Female", "Other"];

interface EditProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updates: Partial<Profile>) => Promise<void>;
}

export function EditProfileModal({
  profile,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [form, setForm] = useState<Partial<Profile>>({ ...profile });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-4xl relative animate-scale-in overflow-y-auto max-h-[100vh]">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Full Name
              </label>
              <input
                name="full_name"
                value={form.full_name ?? ""}
                onChange={handleChange}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email ?? ""}
                onChange={handleChange}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone ?? ""}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">State</label>
              <select
                name="state"
                value={form.state ?? ""}
                onChange={handleChange}
                className="input-field w-full"
                required
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
              <label className="block text-sm font-semibold mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender ?? ""}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Occupation
              </label>
              <select
                name="occupation"
                value={form.occupation ?? ""}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="">Select occupation</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category ?? ""}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Annual Income (₹)
              </label>
              <input
                name="annual_income"
                type="number"
                value={form.annual_income ?? ""}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Age</label>
              <input
                name="age"
                type="number"
                value={form.age ?? ""}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Aadhaar Number
              </label>
              <input
                name="aadhaar_number"
                value={form.aadhaar_number ?? ""}
                onChange={handleChange}
                className="input-field w-full"
                maxLength={12}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                PAN Number
              </label>
              <input
                name="pan_number"
                value={form.pan_number ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    pan_number: e.target.value.toUpperCase(),
                  }))
                }
                className="input-field w-full"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Preferred Language
              </label>
              <input
                name="preferred_language"
                value={form.preferred_language ?? ""}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Is BPL?
              </label>
              <select
                value={String(form.is_bpl ?? false)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_bpl: e.target.value === "true" }))
                }
                className="input-field w-full"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="btn-primary px-8 py-3 text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
