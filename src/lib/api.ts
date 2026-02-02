const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

let authToken: string | null = localStorage.getItem("authToken");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || error.message || "Request failed");
  }

  return response.json();
}

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  state: string;
  district?: string;
  occupation?:
    | "Farmer"
    | "Student"
    | "Business"
    | "Employed"
    | "Unemployed"
    | "Self-Employed"
    | "Other";
  annual_income?: number;
  category?: "General" | "OBC" | "SC" | "ST" | "EWS";
  is_bpl?: boolean;
  aadhaar_number?: string;
  pan_number?: string;
  aadhaar_linked?: boolean;
  pan_linked?: boolean;
  preferred_language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Scheme {
  id: string;
  name: string;
  name_hindi?: string;
  description: string;
  description_hindi?: string;
  scheme_type: "Central" | "State";
  state?: string;
  category: string;
  benefits: string;
  eligibility_criteria: Record<string, any>;
  required_documents: string[];
  application_process: string;
  official_website?: string;
  deadline?: string;
  is_active: boolean;
  launched_date?: string;
  budget_allocated?: number;
  beneficiaries_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Application {
  id: string;
  user_id: string;
  scheme_id: string;
  application_number: string;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
  submitted_at?: string;
  form_data: Record<string, any>;
  documents_uploaded: string[];
  remarks?: string;
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EligibilityCheck {
  id: string;
  user_id: string;
  scheme_id: string;
  is_eligible: boolean;
  matching_criteria: Record<string, any>;
  missing_criteria: Record<string, any>;
  confidence_score: number;
  checked_at: string;
  created_at?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  message: string;
  response: string;
  intent?: string;
  mentioned_schemes: string[];
  language: string;
  created_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type:
    | "New Scheme"
    | "Application Update"
    | "Deadline Alert"
    | "Eligibility Match";
  scheme_id?: string;
  is_read: boolean;
  created_at?: string;
}

export const api = {
  auth: {
    signUp: async (
      email: string,
      password: string,
      userData: Partial<Profile>,
    ) => {
      const response = await apiCall("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, ...userData }),
      });
      setAuthToken(response.token);
      return response;
    },
    signIn: async (email: string, password: string) => {
      const response = await apiCall("/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(response.token);
      return response;
    },
    signOut: async () => {
      setAuthToken(null);
    },
    getUser: async () => {
      const response = await apiCall("/auth/verify");
      return response.user;
    },
  },

  profile: {
    get: async () => {
      return await apiCall("/profile");
    },
    update: async (updates: Partial<Profile>) => {
      return await apiCall("/profile", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    },
  },

  schemes: {
    getAll: async () => {
      return await apiCall("/schemes");
    },
    getById: async (id: string) => {
      return await apiCall(`/schemes/${id}`);
    },
  },

  applications: {
    getAll: async () => {
      return await apiCall("/applications");
    },
    create: async (applicationData: Partial<Application>) => {
      return await apiCall("/applications", {
        method: "POST",
        body: JSON.stringify(applicationData),
      });
    },
  },

  eligibility: {
    getAll: async () => {
      return await apiCall("/eligibility");
    },
  },
};
