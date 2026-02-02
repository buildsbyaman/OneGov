import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { api, Application, Scheme } from "../../lib/api";

interface ApplicationWithScheme extends Application {
  scheme?: Scheme;
}

interface ApplicationsTrackerProps {
  onNavigateToSchemes?: () => void;
}

export function ApplicationsTracker({
  onNavigateToSchemes,
}: ApplicationsTrackerProps) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;

    try {
      const applicationsData = await api.applications.getAll();

      const applicationsWithSchemes = await Promise.all(
        (applicationsData || []).map(async (app) => {
          try {
            const scheme = await api.schemes.getById(app.scheme_id);
            return { ...app, scheme };
          } catch {
            return { ...app, scheme: undefined };
          }
        }),
      );

      setApplications(applicationsWithSchemes);
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "Draft":
        return <FileText className="w-5 h-5 text-gray-500" />;
      case "Submitted":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "Under Review":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "Under Review":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
    }
  };

  const filteredApplications =
    filter === "All"
      ? applications
      : applications.filter((app) => app.status === filter);

  const statusCounts = {
    All: applications.length,
    Draft: applications.filter((a) => a.status === "Draft").length,
    Submitted: applications.filter((a) => a.status === "Submitted").length,
    "Under Review": applications.filter((a) => a.status === "Under Review")
      .length,
    Approved: applications.filter((a) => a.status === "Approved").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          My Applications
        </h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status} ({count})
            </button>
          ))}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring schemes and apply for benefits you're eligible for
            </p>
            <button
              onClick={onNavigateToSchemes}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Schemes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(application.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.scheme?.name || "Unknown Scheme"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Application #{application.application_number}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          application.status,
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {new Date(
                            application.created_at!,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      {application.submitted_at && (
                        <div>
                          <p className="text-xs text-gray-500">Submitted</p>
                          <p className="text-sm text-gray-900 font-medium">
                            {new Date(
                              application.submitted_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {application.approved_at && (
                        <div>
                          <p className="text-xs text-gray-500">Approved</p>
                          <p className="text-sm text-gray-900 font-medium">
                            {new Date(
                              application.approved_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {application.remarks && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-500 mb-1">Remarks</p>
                        <p className="text-sm text-gray-700">
                          {application.remarks}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          alert(
                            `Application Details:\n\nApplication Number: ${application.application_number}\nStatus: ${application.status}\n\nFull details view will be implemented.`,
                          );
                        }}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                      {application.status === "Draft" && (
                        <button
                          onClick={() => {
                            alert(
                              `Continue application for Application #${application.application_number}. Application form will be implemented.`,
                            );
                          }}
                          className="px-4 py-2 border border-gray-300 hover:border-orange-500 hover:text-orange-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          Continue Application
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {application.status === "Submitted" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "33%" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        33% Complete
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Your application is being processed. You'll be notified of
                      any updates.
                    </p>
                  </div>
                )}

                {application.status === "Under Review" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: "66%" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        66% Complete
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Your application is under review by authorities.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
