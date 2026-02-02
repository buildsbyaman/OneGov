import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello ${profile?.full_name || "there"}! I'm your AI assistant for government schemes. I can help you:

• Find schemes you're eligible for
• Answer questions about specific schemes
• Guide you through the application process
• Explain eligibility criteria
• Suggest schemes based on your profile

What would you like to know today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/ai-assistant`;
      console.log("Calling AI API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userId: user?.id,
          profile: profile,
        }),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(
          errorData.details || errorData.error || "Failed to get response",
        );
      }

      const data = await response.json();
      console.log("AI Response received:", data);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment, or feel free to browse the schemes directly from the dashboard.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateMockResponse = (query: string, userProfile: any) => {
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes("eligible") ||
      lowerQuery.includes("schemes for me")
    ) {
      return `Based on your profile (${userProfile?.occupation}, ${userProfile?.state}), here are some schemes you might be eligible for:

**1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**
- Direct income support of ₹6,000/year for farmers
- You're potentially eligible as a farmer in ${userProfile?.state}

**2. Atal Pension Yojana**
- Pension scheme for citizens
- Open to all Indian citizens

**3. National Education Policy Scholarships**
- If you have school-going children
- Available in ${userProfile?.state}

Would you like detailed information about any of these schemes?`;
    }

    if (lowerQuery.includes("pm kisan") || lowerQuery.includes("farmer")) {
      return `**PM-KISAN Scheme Details:**

**Benefits:**
- ₹6,000 per year in 3 installments
- Directly transferred to bank account

**Eligibility:**
- Small and marginal farmers
- Cultivable land ownership required
- Aadhaar linking mandatory

**How to Apply:**
1. Visit pmkisan.gov.in
2. Click on "Farmers Corner"
3. Select "New Farmer Registration"
4. Fill Aadhaar number and details
5. Submit required documents

**Required Documents:**
- Aadhaar Card
- Bank Account Details
- Land Ownership Papers

Would you like help with the application process?`;
    }

    if (lowerQuery.includes("student") || lowerQuery.includes("scholarship")) {
      return `**Student Scholarship Schemes:**

**1. National Scholarship Portal (NSP)**
- Pre-matric and post-matric scholarships
- For SC/ST/OBC students
- Apply at scholarships.gov.in

**2. Merit-cum-Means Scholarship**
- For students from low-income families
- Based on academic performance

**3. State-specific scholarships in ${userProfile?.state}**

Would you like details about any specific scholarship?`;
    }

    if (lowerQuery.includes("women") || lowerQuery.includes("mother")) {
      return `**Schemes for Women:**

**1. Pradhan Mantri Matru Vandana Yojana**
- ₹5,000 direct benefit transfer
- For pregnant and lactating mothers

**2. Sukanya Samriddhi Yojana**
- Savings scheme for girl child
- High interest rate and tax benefits

**3. MUDRA Loan for Women Entrepreneurs**
- Up to ₹10 lakh loan
- For starting small businesses

Would you like application guidance for any of these?`;
    }

    if (lowerQuery.includes("apply") || lowerQuery.includes("application")) {
      return `**General Application Process:**

1. **Verify Eligibility**
   - Check scheme requirements
   - Ensure you meet all criteria

2. **Gather Documents**
   - Aadhaar Card
   - Income Certificate
   - Caste Certificate (if applicable)
   - Bank Details

3. **Online Application**
   - Visit official portal
   - Fill application form
   - Upload documents
   - Submit

4. **Track Status**
   - Use application number
   - Check portal regularly

Which specific scheme would you like to apply for? I can provide step-by-step guidance.`;
    }

    return `I understand you're asking about "${query}".

I can help you with:
- Finding schemes you're eligible for
- Details about specific government schemes
- Application processes and requirements
- Eligibility criteria explanations

Could you please be more specific about what you'd like to know? For example:
- "What schemes am I eligible for?"
- "Tell me about PM Kisan scheme"
- "How to apply for scholarships?"
- "Schemes for farmers in ${userProfile?.state}"`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What schemes am I eligible for?",
    "Tell me about PM-KISAN",
    "How to apply for scholarships?",
    `Schemes for ${profile?.occupation}s`,
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in">
      <div className="bg-gradient-to-r from-orange-600 via-orange-600 to-orange-700 text-white px-6 py-5 flex items-center gap-4 shadow-lg">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-md">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight">
            AI Schemes Assistant
          </h2>
          <p className="text-sm text-orange-100 font-medium">
            Powered by advanced AI
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-gray-50 to-white scrollbar-thin">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 animate-slide-up ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-9 h-9 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-600/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-md ${
                message.role === "user"
                  ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              <p
                className={`text-xs mt-2.5 ${
                  message.role === "user" ? "text-orange-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.role === "user" && (
              <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start animate-slide-up">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-600/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl px-5 py-3.5 shadow-md border border-gray-200">
              <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-6 py-4 bg-gradient-to-br from-orange-50 to-white border-t border-gray-200">
          <p className="text-xs text-gray-700 mb-3 font-semibold uppercase tracking-wide">
            Suggested Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all font-medium shadow-sm hover:shadow"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 bg-white border-t-2 border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about government schemes..."
            className="flex-1 px-5 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-400 hover:border-gray-300"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white p-3.5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-600/30 hover:shadow-lg hover:shadow-orange-600/40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
