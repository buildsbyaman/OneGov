import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  FileText,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AIAssistant } from "../Chat/AIAssistant";
import { EligibilityDashboard } from "./EligibilityDashboard";
import { SchemesBrowser } from "./SchemesBrowser";
import { ApplicationsTracker } from "./ApplicationsTracker";

type Tab = "dashboard" | "chat" | "schemes" | "applications" | "profile";

export function MainDashboard() {
  const { profile, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigation = [
    { id: "dashboard" as Tab, name: "Dashboard", icon: LayoutDashboard },
    { id: "chat" as Tab, name: "AI Assistant", icon: MessageSquare },
    { id: "schemes" as Tab, name: "Browse Schemes", icon: Search },
    { id: "applications" as Tab, name: "My Applications", icon: FileText },
    { id: "profile" as Tab, name: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md shadow-orange-600/30 bg-white overflow-hidden">
                <img
                  src="/favicon.png"
                  alt="OneGov Logo"
                  className="w-9 h-9 object-contain"
                  style={{ display: "block" }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  OneGov
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  One Nation, One Gateway
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {profile?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{profile?.state}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center ring-2 ring-orange-200 ring-offset-2">
                  <User className="w-5 h-5 text-orange-700" />
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? "bg-orange-50 text-orange-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-2 border-t border-gray-200 pt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex gap-6">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100/50 p-3 sticky top-24">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md shadow-orange-600/30"
                          : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`}
                      />
                      <span className="font-semibold text-sm">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === "dashboard" && <EligibilityDashboard />}
            {activeTab === "chat" && (
              <div className="h-[calc(100vh-200px)]">
                <AIAssistant />
              </div>
            )}
            {activeTab === "schemes" && <SchemesBrowser />}
            {activeTab === "applications" && (
              <ApplicationsTracker
                onNavigateToSchemes={() => setActiveTab("schemes")}
              />
            )}
            {activeTab === "profile" && (
              <div className="card p-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  My Profile
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Full Name
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {profile?.full_name}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </label>
                      <p className="text-base font-medium text-gray-900">
                        {profile?.email || "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Phone
                      </label>
                      <p className="text-base font-medium text-gray-900">
                        {profile?.phone || "Not provided"}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        State
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {profile?.state}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Occupation
                      </label>
                      <p className="text-base font-medium text-gray-900">
                        {profile?.occupation}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Category
                      </label>
                      <p className="text-base font-medium text-gray-900">
                        {profile?.category}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Annual Income
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        ₹{profile?.annual_income?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Gender
                      </label>
                      <p className="text-base font-medium text-gray-900">
                        {profile?.gender}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex gap-3">
                      <div
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          profile?.aadhaar_linked
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {profile?.aadhaar_linked ? "✓" : "✗"} Aadhaar Linked
                      </div>
                      <div
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          profile?.pan_linked
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {profile?.pan_linked ? "✓" : "✗"} PAN Linked
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-primary mt-8"
                    onClick={() => setEditModalOpen(true)}
                  >
                    Edit Profile
                  </button>
                  {editModalOpen && profile && (
                    <EditProfileModal
                      profile={profile}
                      onClose={() => setEditModalOpen(false)}
                      onSave={async (updates) => {
                        const { api } = await import("../../lib/api");
                        await api.profile.update(updates);
                        await refreshProfile();
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
