import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ExternalLink,
  FileText,
  Calendar,
  MapPin,
} from "lucide-react";
import { api, Scheme } from "../../lib/api";
import { ApplicationForm } from "./ApplicationForm";

export function SchemesBrowser() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [applyingToScheme, setApplyingToScheme] = useState<Scheme | null>(null);

  useEffect(() => {
    loadSchemes();
  }, []);

  useEffect(() => {
    filterSchemes();
  }, [searchQuery, selectedCategory, selectedType, schemes]);

  const loadSchemes = async () => {
    try {
      const data = await api.schemes.getAll();
      setSchemes(data || []);
      setFilteredSchemes(data || []);
    } catch (error) {
      console.error("Error loading schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    let filtered = schemes;

    if (searchQuery) {
      filtered = filtered.filter(
        (scheme) =>
          scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          scheme.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (scheme) => scheme.category === selectedCategory,
      );
    }

    if (selectedType !== "All") {
      filtered = filtered.filter(
        (scheme) => scheme.scheme_type === selectedType,
      );
    }

    setFilteredSchemes(filtered);
  };

  const categories = ["All", ...new Set(schemes.map((s) => s.category))];
  const types = ["All", "Central", "State"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="card p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Discover Government Schemes
          </h2>
          <p className="text-sm text-gray-600">
            Browse through all available schemes across India
          </p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search schemes by name, category, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 pr-4 py-4 text-base"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium hover:border-gray-300 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium hover:border-gray-300 transition-colors"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto px-4 py-2 bg-gray-100 rounded-xl">
              <span className="text-sm font-semibold text-gray-700">
                Showing{" "}
                <span className="text-orange-600">
                  {filteredSchemes.length}
                </span>{" "}
                of {schemes.length} schemes
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="card-interactive p-6"
            onClick={() => setSelectedScheme(scheme)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                  {scheme.name}
                </h3>
                {scheme.name_hindi && (
                  <p className="text-sm text-gray-600 mt-1.5">
                    {scheme.name_hindi}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  scheme.scheme_type === "Central"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                {scheme.scheme_type}
              </span>
            </div>

            <div className="mb-4">
              <span className="badge badge-primary text-xs">
                {scheme.category}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-5 line-clamp-3 leading-relaxed">
              {scheme.description}
            </p>

            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-2 text-sm">
                <FileText className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong className="font-semibold text-gray-900">
                    Benefits:
                  </strong>{" "}
                  {scheme.benefits}
                </span>
              </div>
              {scheme.state && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>Available in {scheme.state}</span>
                </div>
              )}
              {scheme.deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>
                    Deadline: {new Date(scheme.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedScheme(scheme);
                }}
                className="btn-primary flex-1 text-sm"
              >
                View Details
              </button>
              {scheme.official_website && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(scheme.official_website, "_blank");
                  }}
                  className="p-2.5 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 rounded-xl transition-all"
                  title="Official Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedScheme && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedScheme(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                  {selectedScheme.name}
                </h2>
                {selectedScheme.name_hindi && (
                  <p className="text-lg text-gray-600 mt-2">
                    {selectedScheme.name_hindi}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`badge ${selectedScheme.scheme_type === "Central" ? "badge-info" : "badge-success"}`}
                  >
                    {selectedScheme.scheme_type}
                  </span>
                  <span className="badge badge-primary">
                    {selectedScheme.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 text-sm">📄</span>
                  </div>
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedScheme.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-sm">💰</span>
                  </div>
                  Benefits
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedScheme.benefits}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  Eligibility Criteria
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  {Object.keys(selectedScheme.eligibility_criteria).length >
                  0 ? (
                    <ul className="space-y-2.5">
                      {Object.entries(selectedScheme.eligibility_criteria).map(
                        ([key, value]) => (
                          <li
                            key={key}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-orange-600 mt-0.5">•</span>
                            <div>
                              <strong className="capitalize font-semibold text-gray-900">
                                {key.replace(/_/g, " ")}:
                              </strong>{" "}
                              {Array.isArray(value)
                                ? value.join(", ")
                                : String(value)}
                            </div>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">
                      No specific eligibility criteria listed
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-sm">📋</span>
                  </div>
                  Required Documents
                </h3>
                <ul className="space-y-2">
                  {selectedScheme.required_documents.map((doc, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span className="text-orange-600 mt-0.5">•</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 text-sm">📝</span>
                  </div>
                  Application Process
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedScheme.application_process}
                </p>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200\">
                <button
                  onClick={() => {
                    setApplyingToScheme(selectedScheme);
                  }}
                  className="btn-primary flex-1"
                >
                  Start Application
                </button>
                {selectedScheme.official_website && (
                  <button
                    onClick={() =>
                      window.open(selectedScheme.official_website, "_blank")
                    }
                    className="btn-secondary"
                  >
                    Official Website
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {applyingToScheme && (
        <ApplicationForm
          scheme={applyingToScheme}
          onClose={() => setApplyingToScheme(null)}
          onSuccess={() => {
            setApplyingToScheme(null);
            setSelectedScheme(null);
          }}
        />
      )}
    </div>
  );
}
