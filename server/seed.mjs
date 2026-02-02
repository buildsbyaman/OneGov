import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "OneGov";

const sampleSchemes = [
  {
    id: "nsp-1",
    name: "National Scholarship Portal",
    category: "Education",
    description:
      "Centralized portal for various scholarships offered by the Government of India. It provides a common platform for students to apply for various scholarships.",
    scheme_type: "Central",
    benefits:
      "Financial assistance ranging from ₹10,000 to ₹2,00,000 per year depending on the scholarship type, course, and level of education.",
    eligibility_criteria: {
      occupation: ["Student"],
      min_age: 16,
      max_age: 35,
      category: ["SC", "ST", "OBC", "General", "EWS"],
    },
    required_documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Caste Certificate (if applicable)",
      "Previous year marksheet",
      "Bank Account Details",
      "Passport size photograph",
    ],
    application_process:
      "Visit scholarships.gov.in, register with your details, fill the application form for the desired scholarship, upload required documents, and submit. Track application status online.",
    official_website: "https://scholarships.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pre-matric-scholarship-1",
    name: "Pre-Matric Scholarship",
    category: "Education",
    description:
      "Scholarship scheme for SC/ST students studying in classes 9 and 10 to reduce dropout rates and improve participation.",
    scheme_type: "Central",
    benefits:
      "₹3,000 to ₹6,000 per annum for students in classes 9-10, including tuition fees, textbooks, and other educational expenses.",
    eligibility_criteria: {
      occupation: ["Student"],
      category: ["SC", "ST"],
      max_annual_income: 250000,
    },
    required_documents: [
      "School enrollment certificate",
      "Caste certificate",
      "Income certificate",
      "Aadhaar card",
      "Bank account passbook",
    ],
    application_process:
      "Apply through National Scholarship Portal. Register, fill application form, upload documents, submit before deadline. School verification required.",
    official_website: "https://scholarships.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "post-matric-scholarship-1",
    name: "Post-Matric Scholarship",
    category: "Education",
    description:
      "Financial assistance for SC/ST/OBC students pursuing higher education after class 10.",
    scheme_type: "Central",
    benefits:
      "₹10,000 to ₹2,00,000 per year depending on course (ITI, diploma, degree, postgraduate). Covers tuition fees, maintenance allowance, and other charges.",
    eligibility_criteria: {
      occupation: ["Student"],
      category: ["SC", "ST", "OBC"],
      max_annual_income: 250000,
    },
    required_documents: [
      "College admission letter",
      "Caste certificate",
      "Income certificate",
      "Previous year marksheet",
      "Fee receipt",
      "Bank account details",
    ],
    application_process:
      "Register on NSP portal, select Post-Matric Scholarship scheme, complete application, upload all documents, submit for institutional verification.",
    official_website: "https://scholarships.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "inspire-scholarship-1",
    name: "INSPIRE Scholarship",
    category: "Education",
    description:
      "Innovation in Science Pursuit for Inspired Research. Scholarship for students pursuing science courses to encourage science education.",
    scheme_type: "Central",
    benefits:
      "₹80,000 per year for 5 years (₹5,000 per month + ₹20,000 annual grant for summer training, books, etc.)",
    eligibility_criteria: {
      occupation: ["Student"],
      min_age: 17,
      max_age: 22,
    },
    required_documents: [
      "Class 12 marksheet",
      "Admission proof in BSc/BS/MSc",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Apply online at inspire-dst.gov.in. Students must have scored 60% or above in class 12 in science stream. Selection based on merit.",
    official_website: "https://inspire-dst.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pragati-scholarship-1",
    name: "Pragati Scholarship for Girls",
    category: "Education",
    description:
      "Scholarship for girl students in technical education to promote women in engineering.",
    scheme_type: "Central",
    benefits:
      "₹50,000 per year (₹30,000 tuition fees + ₹20,000 incidental charges) for girl students pursuing technical degree courses.",
    eligibility_criteria: {
      occupation: ["Student"],
      gender: "Female",
      max_annual_income: 800000,
    },
    required_documents: [
      "Admission letter from AICTE approved institute",
      "Income certificate",
      "Class 12 marksheet",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Apply through AICTE portal. Two girls per family are eligible. Selection based on merit and family income.",
    official_website: "https://www.aicte-india.org",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "saksham-scholarship-1",
    name: "Saksham Scholarship",
    category: "Education",
    description:
      "Scholarship for differently-abled students pursuing technical education to promote inclusive education.",
    scheme_type: "Central",
    benefits:
      "₹50,000 per year for technical degree/diploma courses. Covers tuition fees and study materials.",
    eligibility_criteria: {
      occupation: ["Student"],
      disability_percentage: 40,
      max_annual_income: 800000,
    },
    required_documents: [
      "Disability certificate (minimum 40%)",
      "Admission letter from AICTE approved institute",
      "Income certificate",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Apply through AICTE portal during admission period. Certificate of disability from competent authority required.",
    official_website: "https://www.aicte-india.org",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "nmms-1",
    name: "National Means-cum-Merit Scholarship",
    category: "Education",
    description:
      "Scholarship for meritorious students from economically weaker sections studying in classes 9-12.",
    scheme_type: "Central",
    benefits:
      "₹12,000 per year for students in classes 9-12. Amount directly transferred to student's bank account.",
    eligibility_criteria: {
      occupation: ["Student"],
      max_annual_income: 350000,
      min_percentage: 55,
    },
    required_documents: [
      "Class 8 marksheet (minimum 55%)",
      "Income certificate",
      "School enrollment certificate",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "State-level examination conducted annually. Apply through respective State Education Department. Must clear the selection test.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pm-shri-schools-1",
    name: "PM SHRI Schools Scheme",
    category: "Education",
    description:
      "PM Schools for Rising India - Upgradation of schools to showcase National Education Policy 2020 implementation.",
    scheme_type: "Central",
    benefits:
      "Comprehensive infrastructure development, smart classrooms, laboratories, sports facilities, and quality education for students.",
    eligibility_criteria: {
      school_type: ["Government", "Government-aided"],
    },
    required_documents: [
      "School recognition certificate",
      "Infrastructure assessment report",
      "School management committee details",
    ],
    application_process:
      "Schools selected by State/UT governments. Focus on exemplary schools in each district to serve as model institutions.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "samagra-shiksha-1",
    name: "Samagra Shiksha Abhiyan",
    category: "Education",
    description:
      "Integrated scheme for school education covering pre-school to class 12. Aims to ensure inclusive and equitable quality education.",
    scheme_type: "Central",
    benefits:
      "Free textbooks, uniforms, mid-day meals, infrastructure development, teacher training, and support for inclusive education.",
    eligibility_criteria: {
      school_students: true,
    },
    required_documents: ["School enrollment certificate", "Aadhaar card"],
    application_process:
      "Implemented through State/UT governments. Benefits provided directly through schools. No separate application needed for students.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "nishtha-1",
    name: "NISHTHA",
    category: "Education",
    description:
      "National Initiative for School Heads' and Teachers' Holistic Advancement - Integrated teacher training programme.",
    scheme_type: "Central",
    benefits:
      "Free training for teachers and school heads covering pedagogy, learning outcomes, leadership, and NEP 2020 implementation.",
    eligibility_criteria: {
      occupation: ["Teacher", "School Administrator"],
    },
    required_documents: [
      "Teacher employment certificate",
      "School ID",
      "Aadhaar card",
    ],
    application_process:
      "Nomination by school/education department. Online and offline training modules available through DIKSHA platform.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "ayushman-bharat-1",
    name: "Ayushman Bharat – PMJAY",
    category: "Health",
    description:
      "Pradhan Mantri Jan Arogya Yojana - World's largest health insurance scheme providing cashless treatment to poor families.",
    scheme_type: "Central",
    benefits:
      "₹5 lakh per family per year for secondary and tertiary care hospitalization. Covers 1,393 procedures including surgeries, treatments, and diagnostics.",
    eligibility_criteria: {
      is_bpl: true,
      secc_database: true,
    },
    required_documents: [
      "Aadhaar card",
      "SECC 2011 data verification",
      "Family ID",
      "Ration card (if applicable)",
    ],
    application_process:
      "Check eligibility at pmjay.gov.in. Get Ayushman Card from nearest Common Service Centre or hospital. Treatment cashless at empanelled hospitals.",
    official_website: "https://pmjay.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "nhm-1",
    name: "National Health Mission (NHM)",
    category: "Health",
    description:
      "Comprehensive health care delivery system improving availability and accessibility of quality healthcare, especially in rural areas.",
    scheme_type: "Central",
    benefits:
      "Free healthcare services, medicines, diagnostics, maternal and child health services, disease control programs at government health facilities.",
    eligibility_criteria: {
      all_citizens: true,
    },
    required_documents: ["Aadhaar card (for registration)"],
    application_process:
      "Visit nearest government health facility (PHC, CHC, District Hospital). No application needed - services provided directly.",
    official_website: "https://nhm.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "jsy-1",
    name: "Janani Suraksha Yojana (JSY)",
    category: "Health",
    description:
      "Safe motherhood intervention to reduce maternal and neonatal mortality by promoting institutional delivery.",
    scheme_type: "Central",
    benefits:
      "₹1,400 (rural) or ₹1,000 (urban) cash assistance for delivery in government facility or accredited private institution. Free delivery care included.",
    eligibility_criteria: {
      gender: "Female",
      pregnant: true,
      is_bpl: true,
    },
    required_documents: [
      "BPL card or SECC certificate",
      "Pregnancy registration card (MCP card)",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Register pregnancy at nearest Anganwadi or health center. Deliver at government hospital or accredited facility. Cash transferred post-delivery.",
    official_website:
      "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pmmvy-1",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    category: "Health",
    description:
      "Maternity benefit programme providing cash incentive to pregnant and lactating mothers for first live birth.",
    scheme_type: "Central",
    benefits:
      "₹5,000 in three installments (₹1,000 + ₹2,000 + ₹2,000) directly to bank account. Compensates for wage loss during pregnancy.",
    eligibility_criteria: {
      gender: "Female",
      pregnant: true,
      first_child: true,
      min_age: 19,
    },
    required_documents: [
      "MCP card",
      "Aadhaar card",
      "Bank account passbook",
      "Identity proof",
    ],
    application_process:
      "Register at Anganwadi Centre or approved health facility within 150 days of pregnancy. Fill Form 1A, 1B, and 1C at different stages.",
    official_website: "https://pmmvy.wcd.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "ntbep-1",
    name: "National TB Elimination Programme",
    category: "Health",
    description:
      "Programme to eliminate tuberculosis in India by 2025. Provides free diagnosis and treatment for TB patients.",
    scheme_type: "Central",
    benefits:
      "Free TB diagnosis, complete treatment, medicines, nutritional support of ₹500 per month during treatment period. Nikshay Poshan Yojana provides direct benefit transfer.",
    eligibility_criteria: {
      tb_patient: true,
    },
    required_documents: [
      "Aadhaar card",
      "Medical diagnosis proof",
      "Bank account details",
    ],
    application_process:
      "Get tested at any government health facility. If diagnosed, register on Nikshay portal. Treatment and nutritional support provided.",
    official_website: "https://tbcindia.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pm-kisan-1",
    name: "PM-KISAN",
    category: "Agriculture",
    description:
      "Pradhan Mantri Kisan Samman Nidhi - Income support to all landholding farmer families across the country.",
    scheme_type: "Central",
    benefits:
      "₹6,000 per year in three equal installments of ₹2,000 each, directly transferred to farmer's bank account.",
    eligibility_criteria: {
      occupation: ["Farmer"],
      land_ownership: true,
    },
    required_documents: [
      "Aadhaar card",
      "Land ownership documents",
      "Bank account passbook",
      "Citizenship proof",
    ],
    application_process:
      "Self-registration at pmkisan.gov.in or visit Common Service Centre. Provide land records, Aadhaar, and bank details. Amount transferred quarterly.",
    official_website: "https://pmkisan.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pmfby-1",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Agriculture",
    description:
      "Comprehensive crop insurance scheme providing financial support to farmers in case of crop loss due to natural calamities.",
    scheme_type: "Central",
    benefits:
      "Up to 90% premium subsidy. Coverage for pre-sowing to post-harvest losses. Claims settled based on area approach for widespread calamities.",
    eligibility_criteria: {
      occupation: ["Farmer"],
      crop_cultivation: true,
    },
    required_documents: [
      "Land ownership or tenancy proof",
      "Aadhaar card",
      "Bank account details",
      "Sowing certificate",
    ],
    application_process:
      "Apply during crop season at bank, CSC, or insurance company. Farmers pay only 1.5-2% premium for Kharif and 2% for Rabi crops.",
    official_website: "https://pmfby.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "soil-health-card-1",
    name: "Soil Health Card Scheme",
    category: "Agriculture",
    description:
      "Promotes soil testing and balanced fertilization. Provides farmers with soil nutrient status and recommendations.",
    scheme_type: "Central",
    benefits:
      "Free soil testing every 2-3 years. Customized fertilizer recommendations to improve productivity and reduce costs. Soil health card issued to each farmer.",
    eligibility_criteria: {
      occupation: ["Farmer"],
    },
    required_documents: ["Land records", "Farmer identification"],
    application_process:
      "Contact nearest Soil Testing Laboratory or Agriculture Department. Provide soil samples from your field. Receive Soil Health Card with recommendations.",
    official_website: "https://soilhealth.dac.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "kcc-1",
    name: "Kisan Credit Card (KCC)",
    category: "Agriculture",
    description:
      "Credit support to farmers for agricultural needs including cultivation, post-harvest, and allied activities.",
    scheme_type: "Central",
    benefits:
      "Concessional credit up to ₹3 lakh at 7% interest (4% with timely repayment). Simple and flexible credit facility. Insurance coverage included.",
    eligibility_criteria: {
      occupation: ["Farmer"],
      land_ownership: true,
    },
    required_documents: [
      "Aadhaar card",
      "Land records",
      "Identity proof",
      "Address proof",
      "Passport size photograph",
    ],
    application_process:
      "Apply at any commercial bank, RRB, or cooperative bank. Submit application form with land documents. Card issued within 15 days.",
    official_website: "https://pmkisan.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pmksy-1",
    name: "PM Krishi Sinchai Yojana (PMKSY)",
    category: "Agriculture",
    description:
      "'Har Khet Ko Pani' - Irrigation scheme to expand cultivable area and improve water use efficiency.",
    scheme_type: "Central",
    benefits:
      "Financial assistance for drip/sprinkler irrigation (up to 55% subsidy), watershed development, and water conservation. Micro-irrigation support.",
    eligibility_criteria: {
      occupation: ["Farmer"],
      land_ownership: true,
    },
    required_documents: [
      "Land ownership documents",
      "Aadhaar card",
      "Bank account details",
      "Caste certificate (if applicable)",
    ],
    application_process:
      "Apply through State Agriculture Department. Submit proposal for irrigation equipment/infrastructure. Subsidy provided after installation and verification.",
    official_website: "https://pmksy.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "beti-bachao-1",
    name: "Beti Bachao Beti Padhao",
    category: "Women & Child",
    description:
      "Campaign to address declining Child Sex Ratio and promote education and empowerment of girl child.",
    scheme_type: "Central",
    benefits:
      "Awareness programs, improved access to education, financial incentives through linked schemes like Sukanya Samriddhi Yojana. Multi-sectoral action for girl child welfare.",
    eligibility_criteria: {
      gender: "Female",
      max_age: 18,
    },
    required_documents: [
      "Birth certificate",
      "School enrollment certificate",
      "Aadhaar card",
      "Parent's ID proof",
    ],
    application_process:
      "Access benefits through schools and Anganwadi centres. Link with Sukanya Samriddhi accounts at post offices or banks. Community-level awareness programs.",
    official_website: "https://wcd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "sukanya-samriddhi-1",
    name: "Sukanya Samriddhi Yojana",
    category: "Women & Child",
    description:
      "Small deposit savings scheme for girl child with attractive interest rate and tax benefits.",
    scheme_type: "Central",
    benefits:
      "8% interest rate (approx), tax benefits under Section 80C, maturity after 21 years or marriage after 18 years. Higher interest than regular savings.",
    eligibility_criteria: {
      gender: "Female",
      max_age: 10,
    },
    required_documents: [
      "Girl child's birth certificate",
      "Parent/Guardian identity proof",
      "Address proof",
      "Passport size photographs",
    ],
    application_process:
      "Open account at post office or authorized bank. Minimum deposit ₹250 per year, maximum ₹1.5 lakh. Account can be opened till girl turns 10.",
    official_website: "https://www.indiapost.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "one-stop-centre-1",
    name: "One Stop Centre Scheme",
    category: "Women & Child",
    description:
      "Integrated support and assistance to women affected by violence, in private and public spaces.",
    scheme_type: "Central",
    benefits:
      "24/7 emergency response, medical aid, legal counseling, psychological support, temporary shelter, and support for filing FIR. All services under one roof.",
    eligibility_criteria: {
      gender: "Female",
      violence_victim: true,
    },
    required_documents: [
      "Identity proof (if available)",
      "Medical reports (if any)",
      "Complaint/FIR copy (if filed)",
    ],
    application_process:
      "Walk-in to nearest One Stop Centre or call 181 Women Helpline. Services provided free of cost. Available in all districts.",
    official_website: "https://wcd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "poshan-abhiyaan-1",
    name: "POSHAN Abhiyaan",
    category: "Women & Child",
    description:
      "Prime Minister's Overarching Scheme for Holistic Nutrition - National nutrition mission for children, pregnant women, and lactating mothers.",
    scheme_type: "Central",
    benefits:
      "Supplementary nutrition, growth monitoring, nutrition education, take-home rations, hot cooked meals through Anganwadi centres. Focus on first 1000 days.",
    eligibility_criteria: {
      beneficiary_type: [
        "Pregnant women",
        "Lactating mothers",
        "Children under 6",
      ],
    },
    required_documents: [
      "Aadhaar card",
      "Anganwadi registration",
      "Birth certificate (for children)",
      "MCP card (for pregnant women)",
    ],
    application_process:
      "Register at nearest Anganwadi Centre. Regular health check-ups and nutrition counseling provided. Growth monitoring through POSHAN Tracker app.",
    official_website: "https://poshanabhiyaan.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pm-cares-children-1",
    name: "PM CARES for Children",
    category: "Women & Child",
    description:
      "Support scheme for children who lost both parents or surviving parent or legal guardian/adoptive parents to COVID-19.",
    scheme_type: "Central",
    benefits:
      "₹10 lakh corpus on turning 23, ₹4,000 monthly stipend till 23, free education, health insurance of ₹5 lakh under Ayushman Bharat.",
    eligibility_criteria: {
      max_age: 18,
      covid_orphan: true,
    },
    required_documents: [
      "Death certificate of parent(s) with COVID-19 mentioned",
      "Birth certificate of child",
      "Guardian's identity proof",
      "Bank account details",
    ],
    application_process:
      "Apply through District Magistrate office. Submit death certificate and child's documents. Benefits provided through PM CARES Fund.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pmay-1",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    category: "Housing",
    description:
      "Housing for All - Affordable housing scheme for urban and rural poor, EWS, LIG, and MIG categories.",
    scheme_type: "Central",
    benefits:
      "Interest subsidy up to ₹2.67 lakh on home loans, construction assistance of ₹1.2-1.5 lakh for rural, ₹1-2.5 lakh for urban. Pucca house with basic amenities.",
    eligibility_criteria: {
      max_annual_income: 1800000,
      category: ["EWS", "LIG", "MIG"],
      no_pucca_house: true,
    },
    required_documents: [
      "Aadhaar card",
      "Income certificate",
      "Bank account details",
      "Property documents (if applicable)",
      "Caste certificate (if applicable)",
    ],
    application_process:
      "Apply online at pmaymis.gov.in for urban or pmayg.nic.in for rural. Fill application with family and income details. Subsidy directly credited after verification.",
    official_website: "https://pmaymis.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "swachh-bharat-1",
    name: "Swachh Bharat Mission",
    category: "Housing",
    description:
      "Clean India Mission - Nationwide campaign for sanitation, waste management, and hygiene.",
    scheme_type: "Central",
    benefits:
      "Free toilet construction (₹12,000 assistance), solid waste management, IEC activities, community toilets in urban areas. ODF (Open Defecation Free) certification.",
    eligibility_criteria: {
      no_toilet: true,
      is_bpl: true,
    },
    required_documents: [
      "Aadhaar card",
      "BPL card or income certificate",
      "Bank account details",
      "Address proof",
    ],
    application_process:
      "Apply through Gram Panchayat (rural) or Urban Local Body (urban). Submit application for toilet construction. Amount released in installments after verification.",
    official_website: "https://swachhbharatmission.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "day-nrlm-1",
    name: "Deendayal Antyodaya Yojana – NRLM",
    category: "Housing",
    description:
      "National Rural Livelihoods Mission for poverty alleviation through women's self-help groups and skill development.",
    scheme_type: "Central",
    benefits:
      "Interest subvention on loans, financial assistance to SHGs, skill training, market linkages, revolving fund support up to ₹15,000 per SHG.",
    eligibility_criteria: {
      is_bpl: true,
      rural_residence: true,
    },
    required_documents: [
      "Aadhaar card",
      "BPL card",
      "Bank account details",
      "SHG membership certificate",
    ],
    application_process:
      "Join Self Help Group through local coordinator. Register with NRLM. Access training, loans, and marketing support through SHG.",
    official_website: "https://nrlm.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "amrut-1",
    name: "AMRUT Mission",
    category: "Housing",
    description:
      "Atal Mission for Rejuvenation and Urban Transformation - Ensures water supply, sewerage, and urban amenities.",
    scheme_type: "Central",
    benefits:
      "24x7 water supply, sewerage and septage management, storm water drains, urban transport, green spaces in 500 cities.",
    eligibility_criteria: {
      urban_residence: true,
      amrut_city: true,
    },
    required_documents: ["Residence proof", "Aadhaar card"],
    application_process:
      "Benefits provided at city level through Urban Local Bodies. Citizens can register grievances on civic portal. Infrastructure development ongoing.",
    official_website: "https://amrut.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "smart-cities-1",
    name: "Smart Cities Mission",
    category: "Housing",
    description:
      "Urban renewal and retrofitting program to develop 100 cities with smart solutions and improved quality of life.",
    scheme_type: "Central",
    benefits:
      "Smart infrastructure, technology-based solutions, sustainable development, improved civic services, better urban planning in selected smart cities.",
    eligibility_criteria: {
      smart_city_resident: true,
    },
    required_documents: ["Residence proof in smart city area"],
    application_process:
      "Benefits provided through city-level initiatives. Citizen engagement through mobile apps and portals. Smart solutions for traffic, waste, water, etc.",
    official_website: "https://smartcities.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "mgnrega-1",
    name: "MGNREGA",
    category: "Employment",
    description:
      "Mahatma Gandhi National Rural Employment Guarantee Act - Provides 100 days of guaranteed wage employment in rural areas.",
    scheme_type: "Central",
    benefits:
      "Minimum 100 days of wage employment per year at ₹200-300 per day (state-wise). Unemployment allowance if work not provided within 15 days.",
    eligibility_criteria: {
      min_age: 18,
      rural_residence: true,
      willing_to_work: true,
    },
    required_documents: [
      "Aadhaar card",
      "Bank account with Aadhaar linkage",
      "Residence proof",
      "Passport size photograph",
    ],
    application_process:
      "Apply to Gram Panchayat for job card. Register with Job Card number, bank details. Demand work through application. Wages directly transferred to bank.",
    official_website: "https://nrega.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "skill-india-1",
    name: "Skill India / PMKVY",
    category: "Employment",
    description:
      "Pradhan Mantri Kaushal Vikas Yojana - Flagship skill development scheme for youth.",
    scheme_type: "Central",
    benefits:
      "Free skill training in 40+ sectors, ₹8,000 average monetary reward on certification, placement assistance, recognition of prior learning.",
    eligibility_criteria: {
      min_age: 15,
      max_age: 45,
      unemployed_or_school_dropout: true,
    },
    required_documents: [
      "Aadhaar card",
      "Bank account details",
      "Educational certificates",
      "Identity proof",
    ],
    application_process:
      "Register on pmkvyofficial.org or Skill India portal. Choose training center and course. Complete training and assessment. Get NSQF certificate.",
    official_website: "https://www.pmkvyofficial.org",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "naps-1",
    name: "National Apprenticeship Promotion Scheme (NAPS)",
    category: "Employment",
    description:
      "Promotes apprenticeship training and provides financial incentives to employers and apprentices.",
    scheme_type: "Central",
    benefits:
      "Stipend support, 25% of stipend shared by government (up to ₹1,500/month), apprenticeship training in industry, employment opportunities.",
    eligibility_criteria: {
      min_age: 14,
      max_age: 35,
      educational_qualification: ["Class 5 to Graduate"],
    },
    required_documents: [
      "Educational certificates",
      "Aadhaar card",
      "Bank account details",
      "Age proof",
    ],
    application_process:
      "Register on apprenticeshipindia.gov.in portal. Search for apprenticeship opportunities. Apply to establishments. Sign apprenticeship contract.",
    official_website: "https://apprenticeshipindia.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "atal-pension-1",
    name: "Atal Pension Yojana",
    category: "Employment",
    description:
      "Pension scheme for unorganized sector workers providing guaranteed monthly pension after 60 years.",
    scheme_type: "Central",
    benefits:
      "Guaranteed pension of ₹1,000 to ₹5,000 per month after 60 years. Government co-contribution for eligible subscribers. Spouse pension on death.",
    eligibility_criteria: {
      min_age: 18,
      max_age: 40,
      unorganized_sector: true,
    },
    required_documents: ["Aadhaar card", "Bank account", "Mobile number"],
    application_process:
      "Visit bank or post office. Fill APY form. Provide Aadhaar and bank details. Choose pension amount. Auto-debit facility for contributions.",
    official_website: "https://npscra.nsdl.co.in/scheme-details-atal.php",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pm-shram-yogi-1",
    name: "Pradhan Mantri Shram Yogi Maandhan",
    category: "Employment",
    description:
      "Pension scheme for unorganized workers earning less than ₹15,000 per month.",
    scheme_type: "Central",
    benefits:
      "Guaranteed monthly pension of ₹3,000 after 60 years. Equal contribution by worker and government. Family pension available.",
    eligibility_criteria: {
      min_age: 18,
      max_age: 40,
      max_monthly_income: 15000,
      unorganized_worker: true,
    },
    required_documents: [
      "Aadhaar card",
      "IFSC code and bank account details",
      "Mobile number",
    ],
    application_process:
      "Visit Common Service Centre. Register with Aadhaar and bank details. Monthly contribution ₹55 to ₹200 based on entry age. LIC manages pension fund.",
    official_website: "https://maandhan.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pmjdy-1",
    name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    category: "Finance",
    description:
      "National Mission for Financial Inclusion - Ensuring access to financial services like banking, credit, insurance, and pension.",
    scheme_type: "Central",
    benefits:
      "Zero-balance bank account, RuPay debit card, ₹2 lakh accident insurance, ₹30,000 life insurance, overdraft facility up to ₹10,000.",
    eligibility_criteria: {
      min_age: 10,
      no_bank_account: true,
    },
    required_documents: [
      "Aadhaar card (preferred)",
      "Any officially valid document for identity and address",
      "Passport size photograph",
    ],
    application_process:
      "Visit any bank branch. Fill account opening form. Submit identity proof. No minimum balance required. Get RuPay debit card immediately.",
    official_website: "https://pmjdy.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pmjjby-1",
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    category: "Finance",
    description:
      "Life insurance scheme offering renewable one-year life cover to all savings bank account holders.",
    scheme_type: "Central",
    benefits:
      "₹2 lakh life cover on death due to any reason. Premium only ₹436 per year (less than ₹1.20/day). Auto-debit from account.",
    eligibility_criteria: {
      min_age: 18,
      max_age: 50,
      bank_account: true,
    },
    required_documents: [
      "Savings bank account",
      "Aadhaar card",
      "Consent for auto-debit",
    ],
    application_process:
      "Visit bank where you have savings account. Fill enrollment form. Provide consent for auto-debit of premium. Coverage starts from enrollment.",
    official_website: "https://www.jansuraksha.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pmsby-1",
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    category: "Finance",
    description:
      "Accident insurance scheme offering accidental death and disability cover.",
    scheme_type: "Central",
    benefits:
      "₹2 lakh on accidental death or permanent total disability. ₹1 lakh on permanent partial disability. Premium ₹20 per year.",
    eligibility_criteria: {
      min_age: 18,
      max_age: 70,
      bank_account: true,
    },
    required_documents: [
      "Savings bank account",
      "Aadhaar card",
      "Consent for auto-debit",
    ],
    application_process:
      "Enroll at bank with savings account. Fill consent form for ₹20 annual premium auto-debit. Renewable yearly. Claim through nominee.",
    official_website: "https://www.jansuraksha.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "nsap-1",
    name: "National Social Assistance Programme (NSAP)",
    category: "Finance",
    description:
      "Social pension scheme providing financial assistance to elderly, widows, and persons with disabilities.",
    scheme_type: "Central",
    benefits:
      "₹200-500 per month for elderly (IGNOAPS), widows (IGNWPS), and persons with disabilities (IGNDPS). State governments may add additional amount.",
    eligibility_criteria: {
      beneficiary_category: [
        "Elderly (60+)",
        "Widow",
        "Person with Disability",
      ],
      is_bpl: true,
    },
    required_documents: [
      "BPL card",
      "Age proof (for elderly)",
      "Widow certificate (for widows)",
      "Disability certificate (for PWD)",
      "Bank account details",
    ],
    application_process:
      "Apply through Gram Panchayat or Urban Local Body. Submit required certificates. Pension directly transferred to bank account monthly.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "dbt-1",
    name: "Direct Benefit Transfer (DBT)",
    category: "Finance",
    description:
      "Direct transfer of subsidies and benefits to beneficiaries' bank accounts, eliminating intermediaries.",
    scheme_type: "Central",
    benefits:
      "Direct, transparent, and timely transfer of government benefits. Reduced leakage, duplication, and fraud. Covers 300+ schemes.",
    eligibility_criteria: {
      bank_account: true,
      aadhaar_linked: true,
    },
    required_documents: [
      "Aadhaar card",
      "Bank account with Aadhaar linkage",
      "Mobile number",
    ],
    application_process:
      "Link Aadhaar with bank account. Register for specific scheme. Benefits automatically transferred. Track on DBT portal.",
    official_website: "https://dbtbharat.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "digital-india-1",
    name: "Digital India Programme",
    category: "Digital/Governance",
    description:
      "Transforming India into a digitally empowered society and knowledge economy.",
    scheme_type: "Central",
    benefits:
      "Digital infrastructure, online government services, digital literacy, BharatNet connectivity, DigiLocker, UPI, e-Governance services.",
    eligibility_criteria: {
      all_citizens: true,
    },
    required_documents: [
      "Aadhaar card (for digital identity)",
      "Mobile number",
    ],
    application_process:
      "Access digital services through various portals - UMANG app, DigiLocker, mygov.in. Attend digital literacy programs at CSCs.",
    official_website: "https://www.digitalindia.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "csc-1",
    name: "Common Service Centres (CSC)",
    category: "Digital/Governance",
    description:
      "Access points for delivery of various electronic services in rural and remote areas.",
    scheme_type: "Central",
    benefits:
      "Government-to-Citizen (G2C) and Business-to-Citizen (B2C) services - Aadhaar, PAN, certificates, banking, insurance, utility payments at doorstep.",
    eligibility_criteria: {
      all_citizens: true,
    },
    required_documents: ["Service-specific documents (varies)"],
    application_process:
      "Visit nearest CSC. Request desired service. Pay nominal service charge. Receive digital or printed output.",
    official_website: "https://www.csc.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "e-shram-1",
    name: "e-Shram Portal",
    category: "Digital/Governance",
    description:
      "National database of unorganized workers providing Universal Account Number for accessing social security schemes.",
    scheme_type: "Central",
    benefits:
      "UAN for all unorganized workers, ₹2 lakh accident insurance, one-stop access to social security schemes, portability of benefits.",
    eligibility_criteria: {
      min_age: 16,
      max_age: 59,
      unorganized_worker: true,
    },
    required_documents: [
      "Aadhaar card",
      "Bank account with IFSC",
      "Mobile number",
    ],
    application_process:
      "Register on eshram.gov.in. Fill details about occupation, skills, education. Get UAN. Access linked schemes and benefits.",
    official_website: "https://eshram.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pm-gati-shakti-1",
    name: "PM Gati Shakti",
    category: "Infrastructure",
    description:
      "National Master Plan for multi-modal connectivity infrastructure to enable holistic development.",
    scheme_type: "Central",
    benefits:
      "Integrated planning and execution of infrastructure projects - roads, railways, airports, ports, logistics. Reduced logistics cost.",
    eligibility_criteria: {
      infrastructure_stakeholders: true,
    },
    required_documents: ["Project proposals", "Stakeholder identification"],
    application_process:
      "Implemented at government level. Benefits citizens through improved connectivity, reduced travel time, and lower logistics costs.",
    official_website: "https://gatishakti.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "ujjwala-1",
    name: "Ujjwala Yojana",
    category: "Energy",
    description:
      "Provides LPG connections to women from BPL households for clean cooking fuel.",
    scheme_type: "Central",
    benefits:
      "Free LPG connection worth ₹1,600, deposit-free cylinder, EMI facility for stove, refill support under some conditions.",
    eligibility_criteria: {
      gender: "Female",
      is_bpl: true,
      min_age: 18,
    },
    required_documents: [
      "BPL card or SECC name",
      "Aadhaar card",
      "Bank account details",
      "Address proof",
      "Passport size photograph",
    ],
    application_process:
      "Apply at LPG distributor. Fill Ujjwala form (Pradhan Mantri Ujjwala Yojana form). Submit documents. Get connection installed at home.",
    official_website: "https://www.pmujjwalayojana.com",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "startup-india-1",
    name: "Startup India",
    category: "MSME/Industry",
    description:
      "Initiative to promote entrepreneurship and innovation through tax exemptions, easier compliance, and funding support.",
    scheme_type: "Central",
    benefits:
      "Tax exemption for 3 years, easier compliance, IPR fast-tracking, self-certification, funding support, networking opportunities.",
    eligibility_criteria: {
      startup_age: "Less than 10 years",
      innovative_business: true,
    },
    required_documents: [
      "Certificate of Incorporation/Registration",
      "Business details and description",
      "Pitch deck",
      "Letter of recommendation (if applicable)",
    ],
    application_process:
      "Register at startupindia.gov.in. Fill details about startup. Get recognition certificate. Access benefits and programs.",
    official_website: "https://www.startupindia.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "standup-india-1",
    name: "Stand-Up India",
    category: "MSME/Industry",
    description:
      "Facilitates bank loans between ₹10 lakh to ₹1 crore to SC/ST and women entrepreneurs.",
    scheme_type: "Central",
    benefits:
      "Loans ₹10 lakh to ₹1 crore for greenfield enterprises in manufacturing, services, or trading. 7 years repayment, credit guarantee coverage.",
    eligibility_criteria: {
      beneficiary_type: ["SC", "ST", "Women"],
      min_age: 18,
      first_time_entrepreneur: true,
    },
    required_documents: [
      "Business plan",
      "Identity proof",
      "Caste certificate (for SC/ST)",
      "Address proof",
      "Educational certificates",
    ],
    application_process:
      "Apply through Stand-Up India portal. Submit business plan. Apply to bank for loan. Get handholding support for registration and approvals.",
    official_website: "https://www.standupmitra.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "make-in-india-1",
    name: "Make in India",
    category: "MSME/Industry",
    description:
      "Encourages companies to manufacture in India and increase the manufacturing sector's contribution to GDP.",
    scheme_type: "Central",
    benefits:
      "Ease of doing business, FDI policy reforms, production incentives, skill development, infrastructure support across 27 sectors.",
    eligibility_criteria: {
      manufacturing_company: true,
    },
    required_documents: [
      "Company registration",
      "Business plan",
      "Sector-specific licenses",
    ],
    application_process:
      "Invest and set up manufacturing in India. Access sector-specific incentives. Utilize Invest India portal for facilitation.",
    official_website: "https://www.makeinindia.com",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "mudra-1",
    name: "PM Mudra Yojana",
    category: "MSME/Industry",
    description:
      "Provides loans to non-corporate, non-farm small/micro enterprises through three categories: Shishu, Kishor, and Tarun.",
    scheme_type: "Central",
    benefits:
      "Collateral-free loans: Shishu (up to ₹50,000), Kishor (₹50,001 to ₹5 lakh), Tarun (₹5 lakh to ₹10 lakh). Mudra card facility.",
    eligibility_criteria: {
      business_type: ["Manufacturing", "Trading", "Services"],
      non_corporate: true,
    },
    required_documents: [
      "Identity proof",
      "Address proof",
      "Business plan",
      "Income proof",
      "Bank statements",
      "Business registration (if any)",
    ],
    application_process:
      "Apply at any bank, NBFC, or MFI. Choose loan category. Submit documents and business plan. Get approval and loan disbursement.",
    official_website: "https://www.mudra.org.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pli-1",
    name: "Production Linked Incentive (PLI) Scheme",
    category: "MSME/Industry",
    description:
      "Incentives for manufacturing and exports to boost domestic manufacturing and attract investments.",
    scheme_type: "Central",
    benefits:
      "Financial incentives of 4-6% on incremental sales over base year for 5 years. Covers 14 key sectors including electronics, automobiles, pharma.",
    eligibility_criteria: {
      manufacturing_sector: [
        "Electronics",
        "Automobiles",
        "Pharma",
        "Textiles",
        "etc.",
      ],
      investment_commitment: true,
    },
    required_documents: [
      "Company registration",
      "Investment plan",
      "Manufacturing setup details",
      "Financial statements",
    ],
    application_process:
      "Apply through respective ministry portal for sector. Meet investment and production criteria. Get incentives based on incremental sales.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "rashtriya-gokul-mission-1",
    name: "Rashtriya Gokul Mission",
    category: "Agriculture",
    description:
      "Indigenous cattle breed development and conservation for enhancing milk production and productivity.",
    scheme_type: "Central",
    benefits:
      "Financial assistance for setting up Gokul Grams, breed improvement units, ₹40,000-50,000 per high genetic merit bull, semen stations support.",
    eligibility_criteria: {
      occupation: ["Farmer", "Dairy Farmer"],
      cattle_ownership: true,
    },
    required_documents: [
      "Cattle ownership proof",
      "Land documents",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Apply through State Animal Husbandry Department. Submit proposal for Gokul Gram or breeding unit. Get technical and financial support.",
    official_website: "https://dahd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "paramparagat-krishi-vikas-yojana-1",
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    category: "Agriculture",
    description:
      "Promotes organic farming through cluster approach and certification support.",
    scheme_type: "Central",
    benefits:
      "₹50,000 per hectare over 3 years for organic farming cluster. Support for certification, organic inputs, training, marketing.",
    eligibility_criteria: {
      occupation: ["Farmer"],
      land_ownership: true,
      cluster_formation: true,
    },
    required_documents: [
      "Land records",
      "Cluster formation certificate",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Form cluster of 50 farmers. Apply through Agriculture Department. Get training in organic farming. Receive financial support for 3 years.",
    official_website: "https://pgsindia-ncof.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-beekeeping-honey-mission-1",
    name: "National Beekeeping & Honey Mission",
    category: "Agriculture",
    description:
      "Promotes scientific beekeeping for increasing crop productivity and honey production.",
    scheme_type: "Central",
    benefits:
      "40-75% subsidy on bee boxes, bee colonies, equipment. Training, credit linkage, marketing support for honey and bee products.",
    eligibility_criteria: {
      occupation: ["Farmer", "Entrepreneur"],
      interested_in_beekeeping: true,
    },
    required_documents: [
      "Identity proof",
      "Land documents",
      "Bank account details",
      "Training certificate",
    ],
    application_process:
      "Attend beekeeping training. Apply through Horticulture/Agriculture Department. Get subsidy for equipment. Start beekeeping activity.",
    official_website: "https://nbhm.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "nabard-dairy-scheme-1",
    name: "NABARD Dairy Entrepreneurship Development Scheme",
    category: "Agriculture",
    description:
      "Financial support for setting up small dairy units of 2-10 milch animals.",
    scheme_type: "Central",
    benefits:
      "Bank loan up to ₹6-10 lakh with 33% back-ended capital subsidy. Covers animals, shed, equipment, insurance.",
    eligibility_criteria: {
      occupation: ["Farmer", "Entrepreneur"],
      dairy_interest: true,
    },
    required_documents: [
      "Project report",
      "Land documents",
      "Identity proof",
      "Bank account",
      "Veterinary clearance",
    ],
    application_process:
      "Prepare dairy unit project. Apply to bank for loan. Get NABARD subsidy after completion. Maintain dairy unit as per norms.",
    official_website: "https://www.nabard.org",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "abua-birsa-krishi-vikas-yojana-1",
    name: "Birsa Krishi Vikas Yojana",
    category: "Agriculture",
    description:
      "Jharkhand state scheme for sustainable agriculture and farmer income enhancement.",
    scheme_type: "State",
    benefits:
      "Seeds, fertilizers, agricultural implements subsidy. Training in modern farming techniques. Market linkage support.",
    eligibility_criteria: {
      occupation: ["Farmer"],
      state: ["Jharkhand"],
      land_ownership: true,
    },
    required_documents: [
      "Land records",
      "Aadhaar card",
      "Residence proof",
      "Bank account details",
    ],
    application_process:
      "Apply through Block Agriculture Office. Submit land records and identification. Receive inputs and training.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "rkvy-raftaar-1",
    name: "Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)",
    category: "Agriculture",
    description:
      "Remunerative Approaches for Agriculture and Allied sector Rejuvenation - Comprehensive agriculture development.",
    scheme_type: "Central",
    benefits:
      "Infrastructure development, value addition, marketing support, innovation fund. State plan schemes for agriculture growth.",
    eligibility_criteria: {
      occupation: ["Farmer", "FPO", "Cooperative"],
    },
    required_documents: [
      "Project proposal",
      "Registration certificate",
      "Land documents",
      "Bank details",
    ],
    application_process:
      "Submit project through State Agriculture Department. Get approval and funding. Implement agriculture/allied activity.",
    official_website: "https://rkvy.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "ayush-health-wellness-centre-1",
    name: "Ayushman Bharat Health & Wellness Centres",
    category: "Health",
    description:
      "Comprehensive primary healthcare closer to community through upgraded health sub-centres and PHCs.",
    scheme_type: "Central",
    benefits:
      "Free comprehensive primary healthcare, screening for NCDs, maternal and child health, free essential drugs, diagnostic services.",
    eligibility_criteria: {
      all_citizens: true,
    },
    required_documents: ["Aadhaar card (for registration)"],
    application_process:
      "Visit nearest Health & Wellness Centre. Register with health ID. Avail free primary healthcare services and diagnostics.",
    official_website: "https://ab-hwc.nhp.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "mission-indradhanush-1",
    name: "Mission Indradhanush",
    category: "Health",
    description:
      "Intensified immunization drive targeting all children and pregnant women for vaccination.",
    scheme_type: "Central",
    benefits:
      "Free vaccination against 12 vaccine-preventable diseases. Coverage of unvaccinated and partially vaccinated children under 2 years and pregnant women.",
    eligibility_criteria: {
      beneficiary_type: [
        "Children under 2",
        "Pregnant women",
        "Partial vaccination",
      ],
    },
    required_documents: [
      "Birth certificate",
      "Immunization card",
      "Aadhaar card",
    ],
    application_process:
      "Visit Anganwadi or health center during Mission Indradhanush drive. Get child/self vaccinated. Maintain immunization card.",
    official_website: "https://nhm.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "rashtriya-bal-swasthya-karyakram-1",
    name: "Rashtriya Bal Swasthya Karyakram (RBSK)",
    category: "Health",
    description:
      "Child health screening and early intervention services for children from birth to 18 years.",
    scheme_type: "Central",
    benefits:
      "Free screening for 4Ds - Defects at birth, Deficiencies, Diseases, Development delays. Free treatment and follow-up.",
    eligibility_criteria: {
      max_age: 18,
    },
    required_documents: [
      "Birth certificate",
      "School enrollment certificate",
      "Aadhaar card",
    ],
    application_process:
      "Screening conducted at schools and Anganwadi centres. Parents contacted if intervention needed. Free treatment at health facilities.",
    official_website: "https://nhm.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-viral-hepatitis-control-programme-1",
    name: "National Viral Hepatitis Control Programme",
    category: "Health",
    description:
      "Prevention and control of viral hepatitis through awareness, testing, and treatment.",
    scheme_type: "Central",
    benefits:
      "Free screening, diagnosis, and treatment for Hepatitis B and C. Free antiviral drugs at government facilities.",
    eligibility_criteria: {
      all_citizens: true,
    },
    required_documents: ["Aadhaar card", "Medical prescription"],
    application_process:
      "Visit nearest government hospital for screening. If diagnosed, get free treatment. Regular follow-up provided.",
    official_website: "https://nvhcp.mohfw.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-programme-control-blindness-1",
    name: "National Programme for Control of Blindness & Visual Impairment",
    category: "Health",
    description:
      "Reduces prevalence of blindness through preventive, promotive, and curative interventions.",
    scheme_type: "Central",
    benefits:
      "Free cataract surgery, free spectacles to children, screening camps, treatment for other eye diseases. Target to reduce blindness.",
    eligibility_criteria: {
      eye_disease: true,
    },
    required_documents: ["Aadhaar card", "Medical screening report"],
    application_process:
      "Attend eye screening camps or visit district hospital eye department. Get free treatment/surgery if required.",
    official_website: "https://npcbvi.mohfw.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "rashtriya-kishore-swasthya-karyakram-1",
    name: "Rashtriya Kishore Swasthya Karyakram (RKSK)",
    category: "Health",
    description:
      "Adolescent health programme addressing health needs of 10-19 age group.",
    scheme_type: "Central",
    benefits:
      "Free health check-ups, counseling, nutrition support, menstrual hygiene, peer education, Adolescent Friendly Health Clinics.",
    eligibility_criteria: {
      min_age: 10,
      max_age: 19,
    },
    required_documents: ["Age proof", "School ID or Aadhaar"],
    application_process:
      "Visit Adolescent Friendly Health Clinic at PHC/CHC. Weekly Iron Folic Acid supplementation at schools. Peer education sessions.",
    official_website: "https://nhm.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "integrated-child-development-services-1",
    name: "Integrated Child Development Services (ICDS)",
    category: "Women & Child",
    description:
      "World's largest programme for early childhood care providing nutrition, health, and education.",
    scheme_type: "Central",
    benefits:
      "Supplementary nutrition, immunization, health check-up, referral services, pre-school education for children under 6 and pregnant/lactating mothers.",
    eligibility_criteria: {
      beneficiary_type: [
        "Children under 6",
        "Pregnant women",
        "Lactating mothers",
      ],
    },
    required_documents: [
      "Birth certificate",
      "Aadhaar card",
      "Residence proof",
      "MCP card for pregnant women",
    ],
    application_process:
      "Register at nearest Anganwadi Centre. Attend regularly for nutrition, health services. Pre-school education for 3-6 years.",
    official_website: "https://icds-wcd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-creche-scheme-1",
    name: "National Creche Scheme",
    category: "Women & Child",
    description:
      "Provides day care facility for children (6 months to 6 years) of working mothers.",
    scheme_type: "Central",
    benefits:
      "Safe day care, early childhood care, supplementary nutrition, pre-school education, health check-ups, growth monitoring.",
    eligibility_criteria: {
      child_age: "6 months to 6 years",
      working_mother: true,
      max_family_income: 12000,
    },
    required_documents: [
      "Child's birth certificate",
      "Mother's employment proof",
      "Income certificate",
      "Aadhaar card",
    ],
    application_process:
      "Apply at Anganwadi-cum-Creche or community creche. Submit documents. Child admitted with day care and nutrition support.",
    official_website: "https://wcd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "scheme-adolescent-girls-1",
    name: "Scheme for Adolescent Girls (SAG)",
    category: "Women & Child",
    description:
      "Nutrition, health, and life skills education for out-of-school adolescent girls.",
    scheme_type: "Central",
    benefits:
      "Supplementary nutrition (600 calories, 18-20g protein), IFA supplementation, health check-ups, nutrition & health education, life skills.",
    eligibility_criteria: {
      gender: "Female",
      min_age: 11,
      max_age: 18,
      out_of_school: true,
    },
    required_documents: [
      "Age proof",
      "School leaving certificate or affidavit",
      "Aadhaar card",
    ],
    application_process:
      "Register at Anganwadi Centre. Attend fortnightly sessions. Receive nutrition and health services. Life skills training.",
    official_website: "https://wcd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "nari-shakti-puraskar-1",
    name: "Nari Shakti Puraskar",
    category: "Women & Child",
    description:
      "National awards to recognize exceptional work by individual women and institutions for women's empowerment.",
    scheme_type: "Central",
    benefits:
      "₹2 lakh cash prize and certificate for individual women. ₹3 lakh for institutions. Recognition on International Women's Day.",
    eligibility_criteria: {
      gender: "Female",
      exceptional_contribution: true,
    },
    required_documents: [
      "Nomination form",
      "Work portfolio/achievements",
      "Identity proof",
      "Recommendation letters",
    ],
    application_process:
      "Nominations invited annually. Submit detailed achievements in women empowerment. Selection by committee. Awards on March 8.",
    official_website: "https://wcd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "working-women-hostel-1",
    name: "Working Women Hostel",
    category: "Women & Child",
    description:
      "Safe and affordable accommodation for working women with day care facility for their children.",
    scheme_type: "Central",
    benefits:
      "Subsidized hostel accommodation, day care for children under 5, common facilities, preference to women earning below ₹50,000/month.",
    eligibility_criteria: {
      gender: "Female",
      working: true,
      max_monthly_income: 50000,
    },
    required_documents: [
      "Employment proof",
      "Income certificate",
      "Identity proof",
      "Address proof",
      "Passport photo",
    ],
    application_process:
      "Apply to State/UT Women & Child Development Department. Submit documents. Get allotment based on vacancy and eligibility.",
    official_website: "https://wcd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "nirbhaya-fund-1",
    name: "Nirbhaya Fund Schemes",
    category: "Women & Child",
    description:
      "Fund for implementing initiatives for women's safety and security including One Stop Centres, Women Helpline, etc.",
    scheme_type: "Central",
    benefits:
      "Emergency Response Support System, Women Helpline (181), One Stop Centres, Safe City projects, cyber crime prevention.",
    eligibility_criteria: {
      gender: "Female",
    },
    required_documents: ["Identity proof for accessing services"],
    application_process:
      "Call 181 for emergency assistance. Visit One Stop Centre. Use safety apps. Access services without complex procedures.",
    official_website: "https://wcd.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pradhan-mantri-suryodaya-yojana-1",
    name: "Pradhan Mantri Suryodaya Yojana",
    category: "Energy",
    description:
      "Rooftop solar scheme providing free electricity to eligible households through solar panels.",
    scheme_type: "Central",
    benefits:
      "Free solar panel installation for eligible families, 300 units free electricity per month, reduces electricity bills, environment friendly.",
    eligibility_criteria: {
      own_house: true,
      suitable_rooftop: true,
    },
    required_documents: [
      "Property ownership proof",
      "Electricity connection bill",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Apply through designated portal or electricity distribution company. Technical feasibility survey. Installation by empanelled vendors.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pm-kusum-1",
    name: "PM-KUSUM (Solar Pump Scheme)",
    category: "Energy",
    description:
      "Kisan Urja Suraksha evam Utthaan Mahabhiyan - Solar pumps and grid-connected solar power for farmers.",
    scheme_type: "Central",
    benefits:
      "60% subsidy on solar pumps, solarization of existing pumps, farmers can generate income by selling surplus power to grid.",
    eligibility_criteria: {
      occupation: ["Farmer"],
      agricultural_land: true,
    },
    required_documents: [
      "Land ownership documents",
      "Aadhaar card",
      "Bank account details",
      "Electricity connection details",
    ],
    application_process:
      "Apply through State Nodal Agency. Select solar pump capacity. Get subsidy. Installation by empanelled vendor. Net metering for grid connection.",
    official_website: "https://pmkusum.mnre.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-hydrogen-mission-1",
    name: "National Green Hydrogen Mission",
    category: "Energy",
    description:
      "Promotes production and utilization of green hydrogen to achieve energy independence and climate goals.",
    scheme_type: "Central",
    benefits:
      "Production incentives, R&D support, pilot projects, manufacturing support for electrolyzers. Target 5 MMT annual production by 2030.",
    eligibility_criteria: {
      industry_type: ["Manufacturing", "Energy", "Transport"],
      green_hydrogen_interest: true,
    },
    required_documents: [
      "Company registration",
      "Project proposal",
      "Technical feasibility report",
      "Environmental clearance",
    ],
    application_process:
      "Submit Expression of Interest to designated ministry. Detailed project proposal. Get grants/incentives. Implement green hydrogen project.",
    official_website: "https://mnre.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "faster-adoption-electric-vehicles-1",
    name: "FAME India - Electric Vehicle Scheme",
    category: "Energy",
    description:
      "Faster Adoption and Manufacturing of Electric Vehicles to promote electric mobility.",
    scheme_type: "Central",
    benefits:
      "Subsidy on electric 2-wheelers (₹15,000), 3-wheelers, buses. Charging infrastructure development. Demand incentives for EV adoption.",
    eligibility_criteria: {
      ev_buyer: true,
    },
    required_documents: [
      "Identity proof",
      "Address proof",
      "Income proof (if applicable)",
      "Vehicle purchase documents",
    ],
    application_process:
      "Buy electric vehicle from registered manufacturer. Subsidy provided upfront by dealer. Register vehicle. Charging infrastructure at public places.",
    official_website: "https://fame2.heavyindustries.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "saubhagya-1",
    name: "Pradhan Mantri Sahaj Bijli Har Ghar Yojana (Saubhagya)",
    category: "Energy",
    description:
      "Universal household electrification scheme providing last-mile connectivity and electricity connections.",
    scheme_type: "Central",
    benefits:
      "Free electricity connection to all households. BPL families get free connection, APL pay ₹500 in 10 installments. Pre-paid meters option.",
    eligibility_criteria: {
      no_electricity_connection: true,
    },
    required_documents: [
      "Aadhaar card",
      "Address proof",
      "BPL card (if applicable)",
    ],
    application_process:
      "Apply to electricity distribution company. For BPL - free connection. For APL - pay in installments. Connection within 7-15 days.",
    official_website: "https://saubhagya.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "ddugjy-1",
    name: "Deen Dayal Upadhyaya Gram Jyoti Yojana",
    category: "Energy",
    description:
      "Focused on feeder separation and strengthening sub-transmission and distribution infrastructure in rural areas.",
    scheme_type: "Central",
    benefits:
      "24x7 power supply to rural areas, agricultural feeder separation, distribution infrastructure strengthening, solar panels in off-grid areas.",
    eligibility_criteria: {
      rural_residence: true,
    },
    required_documents: ["Electricity connection proof", "Address proof"],
    application_process:
      "Implemented through DISCOMs at state level. Villages get improved power infrastructure. Consumers get better quality electricity supply.",
    official_website: "https://ddugjy.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "khelo-india-1",
    name: "Khelo India Scheme",
    category: "Sports",
    description:
      "Comprehensive sports development programme to promote grassroots sports and identify talent.",
    scheme_type: "Central",
    benefits:
      "₹5 lakh annual scholarship to 1000 selected athletes for 8 years. Sports infrastructure development, competitions, training, talent identification.",
    eligibility_criteria: {
      min_age: 10,
      max_age: 21,
      sports_talent: true,
    },
    required_documents: [
      "Age proof",
      "Sports performance records",
      "Aadhaar card",
      "Bank account details",
      "School/college certificate",
    ],
    application_process:
      "Participate in Khelo India competitions at school/district/state level. Get selected based on performance. Training at SAI centres.",
    official_website: "https://kheloindia.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "tops-1",
    name: "Target Olympic Podium Scheme (TOPS)",
    category: "Sports",
    description:
      "Identifies and supports medal prospects for Olympics and major international events.",
    scheme_type: "Central",
    benefits:
      "Financial assistance for training, equipment, competition, coaching. Foreign exposure. Sports science support. Out of pocket allowance.",
    eligibility_criteria: {
      elite_athlete: true,
      medal_potential: true,
    },
    required_documents: [
      "Athletic performance records",
      "International competition results",
      "Training plan",
      "Coach recommendation",
    ],
    application_process:
      "Apply through National Sports Federation. Mission Olympic Cell evaluates. Selected athletes get comprehensive support.",
    official_website: "https://sportsauthorityofindia.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "fit-india-1",
    name: "Fit India Movement",
    category: "Sports",
    description:
      "National movement to encourage fitness and sports participation among all age groups.",
    scheme_type: "Central",
    benefits:
      "Fitness programs, sports events, school fitness drives, Fit India app, fitness assessments, yoga sessions, community sports activities.",
    eligibility_criteria: {
      all_citizens: true,
    },
    required_documents: ["Registration on Fit India portal"],
    application_process:
      "Download Fit India app. Participate in fitness challenges. Join local Fit India clubs. Organize fitness events in communities/schools.",
    official_website: "https://fitindia.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "panchayat-empowerment-accountability-incentive-1",
    name: "Panchayat Empowerment & Accountability Incentive Scheme",
    category: "Rural Development",
    description:
      "Incentivizes Gram Panchayats to improve governance, service delivery, and local development.",
    scheme_type: "Central",
    benefits:
      "Performance-based grants to Gram Panchayats. Rewards for good governance, transparency, service delivery. Capacity building support.",
    eligibility_criteria: {
      gram_panchayat: true,
      performance_criteria: true,
    },
    required_documents: [
      "GP registration",
      "Performance reports",
      "Audit reports",
      "Development plans",
    ],
    application_process:
      "GPs assessed on governance parameters. Top performers get incentive grants. Used for local development projects.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "shyama-prasad-mukherji-rurban-mission-1",
    name: "Shyama Prasad Mukherji Rurban Mission",
    category: "Rural Development",
    description:
      "Stimulates local economic development and enhances basic services in rural clusters.",
    scheme_type: "Central",
    benefits:
      "Integrated development of 300 rurban clusters. Infrastructure - roads, water supply, sanitation, education, health, skill development.",
    eligibility_criteria: {
      rurban_cluster: true,
    },
    required_documents: ["Cluster identification documents"],
    application_process:
      "Implemented at cluster level by State governments. Integrated Cluster Action Plan (ICAP) prepared. Development in 16 critical gap areas.",
    official_website: "https://rurban.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pmgsy-1",
    name: "Pradhan Mantri Gram Sadak Yojana",
    category: "Rural Development",
    description:
      "Provides all-weather road connectivity to unconnected habitations in rural areas.",
    scheme_type: "Central",
    benefits:
      "All-weather roads to rural habitations. Connects villages to markets, schools, hospitals. Improved rural connectivity and economic growth.",
    eligibility_criteria: {
      unconnected_habitation: true,
      population: "250+ (150+ in hilly/tribal areas)",
    },
    required_documents: ["Village census data", "Habitation details"],
    application_process:
      "State governments prepare proposals. Roads constructed through PMGSY funding. Online monitoring of road construction and maintenance.",
    official_website: "https://pmgsy.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-rural-drinking-water-programme-1",
    name: "Jal Jeevan Mission (Rural)",
    category: "Rural Development",
    description:
      "Har Ghar Jal - Provides tap water connection to every rural household by 2024.",
    scheme_type: "Central",
    benefits:
      "Piped water supply to every rural household. 55 liters per capita per day. Functional tap connection with adequate quantity and quality.",
    eligibility_criteria: {
      rural_household: true,
      no_tap_water: true,
    },
    required_documents: ["Household details", "Aadhaar (for some states)"],
    application_process:
      "Implemented by state governments. Village water supply schemes. Community participation. Households get tap connections progressively.",
    official_website: "https://jjm.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-bamboo-mission-1",
    name: "National Bamboo Mission",
    category: "Rural Development",
    description:
      "Promotes bamboo cultivation and bamboo-based enterprises for income generation.",
    scheme_type: "Central",
    benefits:
      "Subsidy for bamboo plantation (50-75%), micro-irrigation, training, marketing support, bamboo processing units, product development.",
    eligibility_criteria: {
      occupation: ["Farmer", "Entrepreneur"],
      land_availability: true,
    },
    required_documents: [
      "Land records",
      "Identity proof",
      "Bank account details",
      "Project proposal",
    ],
    application_process:
      "Apply through State Bamboo Mission. Get subsidy for plantation or processing unit. Training and handholding support provided.",
    official_website: "https://nbm.nic.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "gharauni-awas-yojana-1",
    name: "Gharauni Awas Yojana",
    category: "Housing",
    description:
      "Affordable rental housing for urban migrants and industrial workers in proximity to work locations.",
    scheme_type: "Central",
    benefits:
      "Affordable rental housing through converted PMAY houses or new construction. Subsidized rent, basic amenities, security.",
    eligibility_criteria: {
      urban_migrant: true,
      low_income: true,
    },
    required_documents: [
      "Employment proof",
      "Income certificate",
      "Identity proof",
      "Address proof",
    ],
    application_process:
      "Apply to designated ARH complexes or through employer. Agreement for 11 months renewable. Pay subsidized rent.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "credit-linked-subsidy-scheme-1",
    name: "Credit Linked Subsidy Scheme (CLSS)",
    category: "Housing",
    description:
      "Interest subsidy on home loans for EWS, LIG, and MIG categories under PMAY-Urban.",
    scheme_type: "Central",
    benefits:
      "Interest subsidy 6.5% for EWS/LIG, 4-3% for MIG on home loans. NPV up to ₹2.67 lakh. Reduces EMI burden significantly.",
    eligibility_criteria: {
      max_annual_income: 1800000,
      category: ["EWS", "LIG", "MIG"],
      first_house: true,
    },
    required_documents: [
      "Income certificate",
      "Property documents",
      "Aadhaar card",
      "Bank account",
      "No-ownership certificate",
    ],
    application_process:
      "Apply for home loan at participating bank/HFC. Submit CLSS application. Subsidy credited upfront after verification. Reduces loan principal.",
    official_website: "https://pmaymis.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "mgnregps-1",
    name: "MGNREGA Pension Scheme",
    category: "Employment",
    description:
      "Pension scheme for workers who have completed 5 years of continuous work under MGNREGA.",
    scheme_type: "State",
    benefits:
      "Monthly pension of ₹1,000-3,000 (state-wise) after completing 5 consecutive years of MGNREGA work. Covers aged and disabled workers.",
    eligibility_criteria: {
      mgnrega_worker: true,
      continuous_work_years: 5,
      min_age: 60,
    },
    required_documents: [
      "MGNREGA job card",
      "Work completion certificate",
      "Age proof",
      "Bank account details",
    ],
    application_process:
      "Apply through Gram Panchayat. Submit job card with 5 years work proof. Age verification. Pension transferred monthly to bank.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "rozgar-mela-1",
    name: "Rozgar Mela",
    category: "Employment",
    description:
      "Mass recruitment drives by government to provide appointment letters to youth in Central Government jobs.",
    scheme_type: "Central",
    benefits:
      "Direct appointment in central government departments/ministries. Regularization of contractual employees. Job creation across sectors.",
    eligibility_criteria: {
      qualification_match: true,
      age_criteria: true,
    },
    required_documents: [
      "Educational certificates",
      "Age proof",
      "Caste certificate (if applicable)",
      "Aadhaar card",
      "Photographs",
    ],
    application_process:
      "Track Rozgar Mela announcements. Apply through designated portal. Document verification. Appointment letters distributed in drives.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-career-service-1",
    name: "National Career Service (NCS)",
    category: "Employment",
    description:
      "Job portal connecting job seekers and employers. Career counseling, skill development, and placement services.",
    scheme_type: "Central",
    benefits:
      "Free job search, career counseling, skill gap analysis, resume builder, job fairs, internship opportunities, employer database.",
    eligibility_criteria: {
      job_seeker: true,
    },
    required_documents: [
      "Educational certificates",
      "Identity proof",
      "Resume",
      "Aadhaar card",
    ],
    application_process:
      "Register on ncs.gov.in. Create profile with qualifications and preferences. Search jobs, apply online. Attend job fairs. Get career counseling.",
    official_website: "https://www.ncs.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "seekho-kamao-yojana-1",
    name: "Seekho Kamao Yojana",
    category: "Employment",
    description:
      "State scheme providing stipend-based skill training to unemployed youth with placement guarantee.",
    scheme_type: "State",
    benefits:
      "₹8,000-10,000 monthly stipend during training. Free skill training in industry-relevant courses. Guaranteed placement after completion.",
    eligibility_criteria: {
      min_age: 18,
      max_age: 29,
      unemployed: true,
      educational_qualification: ["12th pass or above"],
    },
    required_documents: [
      "Age proof",
      "Educational certificates",
      "Unemployment certificate",
      "Residence proof",
      "Bank account details",
    ],
    application_process:
      "Register on state portal. Choose training course. Attend training (6-12 months). Receive stipend monthly. Get job placement.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "atmanirbhar-bharat-rozgar-yojana-1",
    name: "Atmanirbhar Bharat Rozgar Yojana",
    category: "Employment",
    description:
      "Incentivizes employers to hire new employees and Government pays EPF contribution.",
    scheme_type: "Central",
    benefits:
      "Government pays both employer and employee EPF contribution (24%) for 2 years for new employees earning up to ₹15,000/month.",
    eligibility_criteria: {
      new_employee: true,
      max_monthly_salary: 15000,
      epf_registered: true,
    },
    required_documents: [
      "EPF enrollment",
      "Salary certificate",
      "Appointment letter",
      "Aadhaar card",
    ],
    application_process:
      "Implemented through employers. Employer registers on EPFO portal. Hire eligible candidates. Government pays EPF for 2 years.",
    official_website: "https://www.epfindia.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "swavalamban-1",
    name: "Swavalamban Scheme",
    category: "Finance",
    description:
      "Government co-contribution to NPS accounts of low-income unorganized sector workers.",
    scheme_type: "Central",
    benefits:
      "₹1,000 annual government contribution to NPS accounts. Encourages pension savings among unorganized workers. Tax benefits under Section 80C.",
    eligibility_criteria: {
      max_annual_income: 200000,
      unorganized_sector: true,
      nps_subscriber: true,
    },
    required_documents: [
      "Income certificate",
      "NPS enrollment",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Open NPS account. Contribute minimum ₹1,000 annually. Government adds ₹1,000. Benefits at retirement age 60.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "gold-monetization-scheme-1",
    name: "Gold Monetization Scheme",
    category: "Finance",
    description:
      "Allows gold owners to deposit gold and earn interest, mobilizes idle gold for productive purposes.",
    scheme_type: "Central",
    benefits:
      "Earn interest 2.25-2.50% per annum on gold deposits. Minimum 30g, maximum no limit. Tenor 1-15 years. Redemption in cash or gold.",
    eligibility_criteria: {
      gold_ownership: true,
      min_gold: "30 grams",
    },
    required_documents: [
      "Identity proof",
      "Address proof",
      "PAN card",
      "Gold purity certificate",
    ],
    application_process:
      "Get gold tested at Purity Testing Centre. Submit application at designated bank. Deposit gold. Earn interest. Redeem after maturity.",
    official_website: "https://gms.iibf.org.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "sovereign-gold-bond-1",
    name: "Sovereign Gold Bond Scheme",
    category: "Finance",
    description:
      "Government securities denominated in grams of gold, alternative to holding physical gold.",
    scheme_type: "Central",
    benefits:
      "2.5% annual interest. Capital appreciation based on gold price. Tax benefits. No storage issues. Tradable on stock exchange. 8 years maturity.",
    eligibility_criteria: {
      resident_indian: true,
    },
    required_documents: ["PAN card", "Identity proof", "Address proof"],
    application_process:
      "Apply during subscription period through banks/post offices/stock exchanges. Minimum 1 gram. Pay in cash/DD. Bonds issued in demat/certificate form.",
    official_website: "https://rbi.org.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "varishtha-pension-bima-yojana-1",
    name: "Varishtha Pension Bima Yojana",
    category: "Finance",
    description:
      "Pension scheme for senior citizens providing assured pension for 10 years.",
    scheme_type: "Central",
    benefits:
      "Assured pension at 7.40% per annum. Investment up to ₹15 lakh. Monthly/quarterly/half-yearly/yearly pension option. Loan facility available.",
    eligibility_criteria: {
      min_age: 60,
    },
    required_documents: [
      "Age proof",
      "Identity proof",
      "Address proof",
      "Bank account details",
      "Photographs",
    ],
    application_process:
      "Apply through LIC. Select pension mode. Deposit lump sum (minimum ₹1.5 lakh). Receive regular pension. Maturity after 10 years.",
    official_website: "https://licindia.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-pension-system-1",
    name: "National Pension System (NPS)",
    category: "Finance",
    description:
      "Voluntary retirement savings scheme for all citizens providing pension after retirement.",
    scheme_type: "Central",
    benefits:
      "Tax deduction up to ₹2 lakh (80CCD). Market-linked returns. Choice of investment options. Flexible withdrawals. Portable pension account.",
    eligibility_criteria: {
      min_age: 18,
      max_age: 70,
      indian_citizen: true,
    },
    required_documents: [
      "Aadhaar card",
      "PAN card",
      "Bank account proof",
      "Address proof",
      "Photograph",
    ],
    application_process:
      "Open NPS account online or through POP. Choose fund manager and investment option. Contribute regularly. Withdraw 60% lump sum at retirement.",
    official_website: "https://npscra.nsdl.co.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-e-governance-plan-1",
    name: "National e-Governance Plan (NeGP)",
    category: "Digital/Governance",
    description:
      "Comprehensive plan for e-Governance across 31 Mission Mode Projects covering various citizen services.",
    scheme_type: "Central",
    benefits:
      "Online delivery of government services. Reduced corruption, transparency, efficiency. Services like passport, PAN, property registration online.",
    eligibility_criteria: {
      all_citizens: true,
    },
    required_documents: ["Service-specific documents"],
    application_process:
      "Access services through respective portals - passportindia.gov.in, incometax.gov.in, etc. Apply online, track status, receive services.",
    official_website: "https://www.digitalindia.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "pm-wani-1",
    name: "PM-WANI (Wi-Fi Access Network Interface)",
    category: "Digital/Governance",
    description:
      "Framework to proliferate broadband internet through public Wi-Fi networks.",
    scheme_type: "Central",
    benefits:
      "Free/affordable public Wi-Fi access. No license fee for providers. Encourages small entrepreneurs to set up Wi-Fi hotspots. Digital inclusion.",
    eligibility_criteria: {
      public_wifi_user: true,
    },
    required_documents: ["Mobile number for registration"],
    application_process:
      "Find PM-WANI Wi-Fi hotspot. Register with mobile number. Get affordable internet access. Pay-as-you-use model.",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "national-scholarship-portal-minorities-1",
    name: "Pre-Matric Scholarship for Minorities",
    category: "Education",
    description:
      "Scholarship for minority community students in classes 1-10 to reduce dropout rates.",
    scheme_type: "Central",
    benefits:
      "₹1,000-3,000 per annum based on class. Covers tuition, books, stationery. Helps minority students continue education.",
    eligibility_criteria: {
      occupation: ["Student"],
      minority_community: [
        "Muslim",
        "Christian",
        "Sikh",
        "Buddhist",
        "Jain",
        "Parsi",
      ],
      max_parental_income: 100000,
    },
    required_documents: [
      "School enrollment certificate",
      "Community certificate",
      "Income certificate",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Apply through National Scholarship Portal. Fill minority scholarship form. Upload documents. Submit for verification.",
    official_website: "https://scholarships.gov.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "maulana-azad-fellowship-1",
    name: "Maulana Azad National Fellowship",
    category: "Education",
    description:
      "Fellowship for minority students pursuing M.Phil/PhD in various subjects.",
    scheme_type: "Central",
    benefits:
      "₹25,000/month for JRF, ₹28,000/month for SRF. Contingency grant ₹10,000/year. HRA as per rules. Up to 5 years duration.",
    eligibility_criteria: {
      occupation: ["Student"],
      minority_community: true,
      course: ["M.Phil", "PhD"],
      ugc_net_qualified: true,
    },
    required_documents: [
      "NET certificate",
      "Community certificate",
      "M.Phil/PhD admission letter",
      "Aadhaar card",
      "Bank account details",
    ],
    application_process:
      "Apply online during application period. Submit NET certificate and admission proof. Selection based on merit. Fellowship renewed annually.",
    official_website: "https://www.ugc.ac.in",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const schemesCollection = db.collection("schemes");

    await schemesCollection.deleteMany({});
    console.log("🗑️  Cleared existing schemes");

    const result = await schemesCollection.insertMany(sampleSchemes);
    console.log(`✅ Inserted ${result.insertedCount} sample schemes`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
    console.log("\n👋 Database connection closed");
  }
}

seedDatabase();
