import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { api, Scheme, EligibilityCheck } from "../../lib/api";
import { ApplicationForm } from "./ApplicationForm";

interface SchemeWithEligibility extends Scheme {
  eligibility?: EligibilityCheck;
}

export function EligibilityDashboard() {
  const { user, profile } = useAuth();
  const [schemes, setSchemes] = useState<SchemeWithEligibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "eligible" | "ineligible">(
    "all",
  );
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  useEffect(() => {
    loadSchemes();
  }, [user]);

  const loadSchemes = async () => {
    if (!user) return;

    try {
      const schemesData = await api.schemes.getAll();
      const eligibilityData = await api.eligibility.getAll();

      const schemesWithEligibility = (schemesData || []).map((scheme) => {
        const eligibility = eligibilityData?.find(
          (e) => e.scheme_id === scheme.id,
        );
        return { ...scheme, eligibility };
      });

      setSchemes(schemesWithEligibility);
    } catch (error) {
      console.error("Error loading schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = (
    scheme: Scheme,
  ): { eligible: boolean; reason: string; score: number } => {
    if (!profile)
      return { eligible: false, reason: "Profile incomplete", score: 0 };

    const criteria = scheme.eligibility_criteria;
    let matches = 0;
    let total = 0;
    const reasons: string[] = [];

    if (criteria.min_age || criteria.max_age) {
      total++;
      if (profile.age || profile.date_of_birth) {
        const age =
          profile.age ||
          (profile.date_of_birth
            ? new Date().getFullYear() -
              new Date(profile.date_of_birth).getFullYear()
            : 0);
        if (
          (!criteria.min_age || age >= criteria.min_age) &&
          (!criteria.max_age || age <= criteria.max_age)
        ) {
          matches++;
        } else {
          reasons.push(
            `Age should be between ${criteria.min_age || 0}-${criteria.max_age || 100}`,
          );
        }
      }
    }

    if (criteria.occupation) {
      total++;
      if (
        Array.isArray(criteria.occupation)
          ? criteria.occupation.includes(profile.occupation)
          : criteria.occupation === profile.occupation
      ) {
        matches++;
      } else {
        reasons.push(
          `Only for ${Array.isArray(criteria.occupation) ? criteria.occupation.join(", ") : criteria.occupation}`,
        );
      }
    }

    if (criteria.state) {
      total++;
      if (
        Array.isArray(criteria.state)
          ? criteria.state.includes(profile.state)
          : criteria.state === profile.state
      ) {
        matches++;
      } else {
        reasons.push(
          `Only for ${Array.isArray(criteria.state) ? criteria.state.join(", ") : criteria.state} state`,
        );
      }
    }

    if (criteria.max_income || criteria.max_annual_income) {
      total++;
      const maxIncome = criteria.max_income || criteria.max_annual_income;
      if (profile.annual_income && profile.annual_income <= maxIncome) {
        matches++;
      } else {
        reasons.push(`Annual income must be ≤ ₹${maxIncome.toLocaleString()}`);
      }
    }

    if (criteria.gender) {
      total++;
      if (profile.gender === criteria.gender) {
        matches++;
      } else {
        reasons.push(`Only for ${criteria.gender}`);
      }
    }

    if (criteria.category) {
      total++;
      if (
        Array.isArray(criteria.category)
          ? criteria.category.includes(profile.category)
          : criteria.category === profile.category
      ) {
        matches++;
      } else {
        reasons.push(
          `Only for ${Array.isArray(criteria.category) ? criteria.category.join(", ") : criteria.category} category`,
        );
      }
    }

    if (criteria.is_bpl !== undefined) {
      total++;
      if (profile.is_bpl === criteria.is_bpl) {
        matches++;
      } else {
        reasons.push(
          criteria.is_bpl ? "Only for BPL families" : "Not for BPL families",
        );
      }
    }

    const score = total > 0 ? matches / total : 0;
    const eligible = total > 0 && score >= 0.7;

    return {
      eligible,
      reason: eligible
        ? "You meet the eligibility criteria"
        : total === 0
          ? "Eligibility criteria not fully supported"
          : reasons[0] || "Criteria not met",
      score,
    };
  };

  const filteredSchemes = schemes.filter((scheme) => {
    if (filter === "all") return true;
    const check = checkEligibility(scheme);
    return filter === "eligible" ? check.eligible : !check.eligible;
  });

  const eligibleCount = schemes.filter(
    (s) => checkEligibility(s).eligible,
  ).length;
  const totalBenefits = schemes
    .filter((s) => checkEligibility(s).eligible && s.budget_allocated)
    .reduce((sum, s) => sum + (s.budget_allocated || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card bg-gradient-to-br from-green-500 via-green-600 to-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-50 text-sm font-semibold uppercase tracking-wide">
                Eligible Schemes
              </p>
              <p className="text-4xl font-bold mt-3">{eligibleCount}</p>
              <p className="text-green-100 text-xs mt-1">Available for you</p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-50 text-sm font-semibold uppercase tracking-wide">
                Total Schemes
              </p>
              <p className="text-4xl font-bold mt-3">{schemes.length}</p>
              <p className="text-blue-100 text-xs mt-1">In total</p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-50 text-sm font-semibold uppercase tracking-wide">
                Your State
              </p>
              <p className="text-2xl font-bold mt-3">{profile?.state}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Eligibility Status
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Based on your profile information
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                filter === "all"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("eligible")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                filter === "eligible"
                  ? "bg-green-600 text-white shadow-md shadow-green-600/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Eligible
            </button>
            <button
              onClick={() => setFilter("ineligible")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                filter === "ineligible"
                  ? "bg-gray-600 text-white shadow-md shadow-gray-600/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Not Eligible
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                No schemes found in this category
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            filteredSchemes.map((scheme) => {
              const eligibility = checkEligibility(scheme);
              return (
                <div
                  key={scheme.id}
                  className={`border-2 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg group ${
                    eligibility.eligible
                      ? "border-green-200 bg-gradient-to-br from-green-50 to-white hover:border-green-300"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                        eligibility.eligible ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {eligibility.eligible ? (
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                      ) : (
                        <XCircle className="w-7 h-7 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {scheme.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="badge badge-primary">
                              {scheme.category}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span
                              className={`badge ${scheme.scheme_type === "Central" ? "badge-info" : "badge-success"}`}
                            >
                              {scheme.scheme_type}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                            eligibility.eligible
                              ? "bg-green-100 text-green-700 border-2 border-green-200"
                              : "bg-gray-100 text-gray-600 border-2 border-gray-200"
                          }`}
                        >
                          {eligibility.eligible
                            ? "✓ Eligible"
                            : "✗ Not Eligible"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-3 line-clamp-2 leading-relaxed">
                        {scheme.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">
                          {scheme.benefits}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-700">
                            Match Score
                          </span>
                          <span className="font-bold text-gray-900">
                            {Math.round(eligibility.score * 100)}%
                          </span>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              eligibility.eligible
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-gray-400 to-gray-500"
                            }`}
                            style={{ width: `${eligibility.score * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      {!eligibility.eligible && (
                        <div className="mt-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-700">
                            <strong className="font-semibold text-gray-900">
                              Why not eligible:
                            </strong>{" "}
                            {eligibility.reason}
                          </p>
                        </div>
                      )}
                      <div className="mt-5 flex gap-3">
                        {scheme.official_website && (
                          <button
                            onClick={() =>
                              window.open(scheme.official_website, "_blank")
                            }
                            className="btn-secondary flex-1 text-sm"
                          >
                            Official Website
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        {eligibility.eligible && (
                          <button
                            onClick={() => setSelectedScheme(scheme)}
                            className="btn-primary flex-1 text-sm"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedScheme && (
        <ApplicationForm
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onSuccess={() => {
            setSelectedScheme(null);
            loadSchemes();
          }}
        />
      )}
    </div>
  );
}
