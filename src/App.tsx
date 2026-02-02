import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginScreen } from "./components/Auth/LoginScreen";
import { SignupScreen } from "./components/Auth/SignupScreen";
import { MainDashboard } from "./components/Dashboard/MainDashboard";

function AppContent() {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-pulse overflow-hidden">
            <img
              src="/favicon.png"
              alt="OneGov Logo"
              className="w-14 h-14 object-contain"
            />
          </div>
          <p className="text-gray-600 font-medium">Loading OneGov...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showSignup ? (
      <SignupScreen onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <LoginScreen onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  return <MainDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
