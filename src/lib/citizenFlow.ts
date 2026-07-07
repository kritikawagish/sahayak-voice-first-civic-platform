export type Language = "en" | "hi" | "bho";

export interface CitizenState {
  mode: "idle" | "application" | "complaint" | "status" | "submitted";
  step: number;
  language: Language;
  schemeId?: number;
  fields: Record<string, string>;
  missingDocs: string[];
  complaintCategory?: string;
  complaintDescription?: string;
  complaintLocation?: string;
  referenceNumber?: string;
  confirmed: boolean;
}

export const initialState: CitizenState = {
  mode: "idle",
  step: 0,
  language: "hi",
  fields: {},
  missingDocs: [],
  confirmed: false,
};

const schemes = {
  widow_pension: {
    id: 1,
    slug: "widow-pension",
    name: {
      en: "Widow Pension Scheme",
      hi: "विधवा पेंशन योजना",
      bho: "विधवा पेंशन योजना",
    },
    requiredDocs: {
      en: ["Aadhaar card", "Husband's death certificate", "Bank passbook", "Residence proof"],
      hi: ["आधार कार्ड", "पति का मृत्यु प्रमाण पत्र", "बैंक पासबुक", "निवास प्रमाण"],
      bho: ["आधार कार्ड", "पति के मृत्यु प्रमाण पत्र", "बैंक पासबुक", "निवास प्रमाण"],
    },
  },
};

const t = {
  greeting: {
    en: "Namaste. I am Sahayak, your government helper. Tap the mic and tell me what you need.",
    hi: "नमस्ते। मैं सहायक हूँ, आपकी सरकारी मददगार। माइक दबाएँ और बताएँ आपको क्या चाहिए।",
    bho: "नमस्ते। हम सहायक बानी, तोहार सरकारी मददगार। माइक दबाईं और बताईं का चाहीं।",
  },
  askIntent: {
    en: "Do you want to apply for a scheme, file a complaint, or check status?",
    hi: "क्या आप योजना के लिए आवेदन करना चाहते हैं, शिकायत दर्ज करना चाहते हैं, या स्टेटस जाँचना चाहते हैं?",
    bho: "का रउरा योजना में आवेदन करे के चाहत बानी, शिकायत दर्ज करे के चाहत बानी, कि स्टेटस जाँचे के चाहत बानी?",
  },
  askScheme: {
    en: "Which scheme? You can say Widow Pension.",
    hi: "कौन सी योजना? आप विधवा पेंशन कह सकते हैं।",
    bho: "का योजना? रउरा विधवा पेंशन कह सकत बानी।",
  },
  askName: {
    en: "What is your name?",
    hi: "आपका नाम क्या है?",
    bho: "तोहार नाम का ह?",
  },
  askAge: {
    en: "What is your age?",
    hi: "आपकी उम्र क्या है?",
    bho: "तोहार उम्र का ह?",
  },
  askVillage: {
    en: "Which village or area do you live in?",
    hi: "आप किस गाँव या इलाके में रहते हैं?",
    bho: "रउरा का गाँव या इलाका में रहत बानी?",
  },
  askAadhaar: {
    en: "Do you have an Aadhaar card? Say yes or no.",
    hi: "क्या आपके पास आधार कार्ड है? हाँ या नाँह कहें।",
    bho: "का रउरा लगे आधार कार्ड बा? हाँ या ना कहीं।",
  },
  askBank: {
    en: "Do you have a bank account or passbook? Say yes or no.",
    hi: "क्या आपके पास बैंक खाता या पासबुक है? हाँ या नाँह कहें।",
    bho: "का रउरा लगे बैंक खाता या पासबुक बा? हाँ या ना कहीं।",
  },
  askDeathCert: {
    en: "Do you have your husband's death certificate? Say yes or no.",
    hi: "क्या आपके पास पति का मृत्यु प्रमाण पत्र है? हाँ या नाँह कहें।",
    bho: "का रउरा लगे पति के मृत्यु प्रमाण पत्र बा? हाँ या ना कहीं।",
  },
  docMissing: {
    en: "You still need these documents: {docs}. Get them from your nearest CSC and come back. I will wait.",
    hi: "आपको अभी ये दस्तावेज़ चाहिए: {docs}। ये नज़दीकी CSC से ले आइए और वापस आइए। मैं इंतज़ार करूँगा।",
    bho: "रउरा लगे अभी ई कागज़ चाहीं: {docs}। ई नजदीकी CSC से ले आव और वापस आव। हम इंतजार करी।",
  },
  summary: {
    en: "Please confirm. Name: {name}. Age: {age}. Village: {village}. Scheme: {scheme}. Missing documents: {docs}. Say yes to submit.",
    hi: "कृपया पुष्टि करें। नाम: {name}। उम्र: {age}। गाँव: {village}। योजना: {scheme}। अभी के लिए गायब दस्तावेज़: {docs}। सबमिट करने के लिए हाँ कहें।",
    bho: "कृपया पुष्टि करीं। नाम: {name}। उम्र: {age}। गाँव: {village}। योजना: {scheme}। अभी के कम कागज़: {docs}। सबमिट करे खातिर हाँ कहीं।",
  },
  submitted: {
    en: "Your application has been submitted. Reference number: {ref}. We will also send a voice message to your phone.",
    hi: "आपका आवेदन भेज दिया गया है। रेफरेंस नंबर: {ref}। हम आपके फोन पर एक वॉइस संदेश भी भेजेंगे।",
    bho: "तोहर आवेदन भेज दिहल गइल बा। रेफरेंस नंबर: {ref}। हम तोहर फोन पर एगो वॉइस संदेश भी भेजी।",
  },
  askRef: {
    en: "Tell me your reference number.",
    hi: "अपना रेफरेंस नंबर बताएँ।",
    bho: "अपना रेफरेंस नंबर बताईं।",
  },
  askComplaintCategory: {
    en: "What is the complaint about? Say road, water, ration, electricity, sanitation or other.",
    hi: "शिकायत किस बारे में है? सड़क, पानी, राशन, बिजली, सफाई या अन्य कहें।",
    bho: "शिकायत का बारे में बा? सड़क, पानी, राशन, बिजली, सफाई या अन्य कहीं।",
  },
  askComplaintLocation: {
    en: "Where is this problem?",
    hi: "यह समस्या कहाँ है?",
    bho: "ई समस्या कहाँ बा?",
  },
  askComplaintDescription: {
    en: "Please describe the problem in a few words.",
    hi: "कृपया समस्या को कुछ शब्दों में बताएँ।",
    bho: "कृपया समस्या के कुछ शब्द में बताईं।",
  },
  complaintSubmitted: {
    en: "Complaint registered. Reference: {ref}. If not resolved in {hours} hours, I will auto-escalate it.",
    hi: "शिकायत दर्ज कर ली गई। रेफरेंस: {ref}। अगर {hours} घंटे में हल नहीं हुई, तो मैं इसे ऑटो-एस्केलेट कर दूँगा।",
    bho: "शिकायत दर्ज हो गइल। रेफरेंस: {ref}। अगर {hours} घंटा में हल न भइल, तो हम ई के ऑटो-एस्केलेट कर दी।",
  },
  escalateNotice: {
    en: "Your complaint has been auto-escalated. An RTI draft and higher authority alert have been generated.",
    hi: "आपकी शिकायत ऑटो-एस्केलेट कर दी गई है। RTI ड्राफ्ट और उच्च अधिकारी अलर्ट बना दिया गया है।",
    bho: "तोहर शिकायत ऑटो-एस्केलेट कर दिहल गइल बा। RTI ड्राफ्ट और ऊँच अधिकारी अलर्ट बना दिहल गइल बा।",
  },
  statusResult: {
    en: "Your application status is: {status}.",
    hi: "आपके आवेदन की स्थिति है: {status}।",
    bho: "तोहर आवेदन के स्थिति बा: {status}।",
  },
  fallback: {
    en: "I didn't understand. Please repeat.",
    hi: "मुझे समझ नहीं आया। कृपया दोहराएँ।",
    bho: "हमरा समझ में न आइल। कृपया दोहराईं।",
  },
};

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

function detectYes(text: string): boolean | null {
  const lower = text.toLowerCase();
  const yesWords = ["yes", "yeah", "yep", "haan", "han", "hãn", "haji", "ha", "hoo", "जी", "हाँ", "हां", "हो", "बा"];
  const noWords = ["no", "nope", "na", "nahi", "nahin", "नहीं", "ना", "नइखे", "nai"];
  if (yesWords.some((w) => lower.includes(w))) return true;
  if (noWords.some((w) => lower.includes(w))) return false;
  return null;
}

function extractNumber(text: string): string | null {
  const match = text.match(/(\d+)/);
  return match ? match[1] : null;
}

function detectScheme(text: string): string | null {
  const lower = text.toLowerCase();
  if (
    lower.includes("pension") ||
    lower.includes("widow") ||
    lower.includes("विधवा") ||
    lower.includes("पेंशन") ||
    lower.includes("पति") ||
    lower.includes("मर") ||
    lower.includes("मृत")
  ) {
    return "widow_pension";
  }
  return null;
}

function detectComplaintCategory(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("road") || lower.includes("sadak") || lower.includes("सड़क") || lower.includes("पोथोल") || lower.includes("pothole"))
    return "road";
  if (lower.includes("water") || lower.includes("pani") || lower.includes("पानी")) return "water";
  if (lower.includes("ration") || lower.includes("राशन")) return "ration";
  if (lower.includes("electricity") || lower.includes("bijli") || lower.includes("बिजली")) return "electricity";
  if (lower.includes("sanitation") || lower.includes("safai") || lower.includes("सफाई")) return "sanitation";
  if (lower.includes("other") || lower.includes("anya") || lower.includes("अन्य")) return "other";
  return null;
}

function detectIntent(text: string): "application" | "complaint" | "status" | null {
  const lower = text.toLowerCase();
  if (lower.includes("apply") || lower.includes("application") || lower.includes("आवेदन") || lower.includes("योजना") || lower.includes("scheme"))
    return "application";
  if (lower.includes("complaint") || lower.includes("shikayat") || lower.includes("शिकायत")) return "complaint";
  if (lower.includes("status") || lower.includes("track") || lower.includes("स्टेटस") || lower.includes("स्थिति")) return "status";
  return null;
}

export function langCode(lang: Language): string {
  const map: Record<Language, string> = { en: "en-IN", hi: "hi-IN", bho: "bho-IN" };
  return map[lang] || "hi-IN";
}

export function getMissingDocs(state: CitizenState): string[] {
  const scheme = schemes.widow_pension;
  const required = scheme.requiredDocs[state.language];
  const missing: string[] = [];
  if (state.fields.aadhaar !== "yes") missing.push(required[0]);
  if (state.fields.deathCertificate !== "yes") missing.push(required[1]);
  if (state.fields.bankAccount !== "yes") missing.push(required[2]);
  if (!state.fields.village) missing.push(required[3]);
  return missing;
}

export interface ProcessResult {
  state: CitizenState;
  reply: string;
  done?: boolean;
  submitData?: {
    type: "application" | "complaint";
    payload: Record<string, unknown>;
  };
}

export function processMessage(prev: CitizenState, message: string): ProcessResult {
  const state: CitizenState = { ...prev, fields: { ...prev.fields } };
  const lang = state.language;

  if (state.mode === "idle") {
    state.mode = "idle";
    state.step = 1;
    const intent = detectIntent(message) || detectScheme(message) ? "application" : null;
    if (intent) {
      state.mode = intent;
      state.step = 2;
      if (intent === "application") {
        const scheme = detectScheme(message);
        if (scheme) {
          state.schemeId = schemes[scheme as keyof typeof schemes]?.id;
          state.step = 3;
          return { state, reply: t.askName[lang] };
        }
        return { state, reply: t.askScheme[lang] };
      }
      if (intent === "complaint") {
        state.step = 20;
        return { state, reply: t.askComplaintCategory[lang] };
      }
    }
    return { state, reply: t.askIntent[lang] };
  }

  if (state.mode === "application") {
    switch (state.step) {
      case 1: {
        const intent = detectIntent(message);
        if (intent === "application") {
          state.step = 2;
          return { state, reply: t.askScheme[lang] };
        }
        if (intent === "complaint") {
          state.mode = "complaint";
          state.step = 20;
          return { state, reply: t.askComplaintCategory[lang] };
        }
        if (intent === "status") {
          state.mode = "status";
          state.step = 30;
          return { state, reply: t.askRef[lang] };
        }
        const scheme = detectScheme(message);
        if (scheme) {
          state.mode = "application";
          state.step = 3;
          state.schemeId = schemes[scheme as keyof typeof schemes]?.id;
          return { state, reply: t.askName[lang] };
        }
        return { state, reply: t.askIntent[lang] };
      }
      case 2: {
        const scheme = detectScheme(message);
        if (scheme) {
          state.schemeId = schemes[scheme as keyof typeof schemes]?.id;
          state.step = 3;
          return { state, reply: t.askName[lang] };
        }
        return { state, reply: t.askScheme[lang] };
      }
      case 3: {
        state.fields.name = message.trim();
        state.step = 4;
        return { state, reply: t.askAge[lang] };
      }
      case 4: {
        const age = extractNumber(message);
        if (age) state.fields.age = age;
        state.step = 5;
        return { state, reply: t.askVillage[lang] };
      }
      case 5: {
        state.fields.village = message.trim();
        state.step = 6;
        return { state, reply: t.askAadhaar[lang] };
      }
      case 6: {
        const yes = detectYes(message);
        state.fields.aadhaar = yes === true ? "yes" : "no";
        state.step = 7;
        return { state, reply: t.askBank[lang] };
      }
      case 7: {
        const yes = detectYes(message);
        state.fields.bankAccount = yes === true ? "yes" : "no";
        state.step = 8;
        return { state, reply: t.askDeathCert[lang] };
      }
      case 8: {
        const yes = detectYes(message);
        state.fields.deathCertificate = yes === true ? "yes" : "no";
        state.missingDocs = getMissingDocs(state);
        state.step = 9;
        if (state.missingDocs.length > 0) {
          return {
            state,
            reply: interpolate(t.docMissing[lang], { docs: state.missingDocs.join(", ") }),
          };
        }
        state.step = 10;
        return {
          state,
          reply: interpolate(t.summary[lang], {
            name: state.fields.name || "—",
            age: state.fields.age || "—",
            village: state.fields.village || "—",
            scheme: schemes.widow_pension.name[lang],
            docs: "None",
          }),
        };
      }
      case 9: {
        state.missingDocs = getMissingDocs(state);
        if (detectYes(message)) {
          state.fields.aadhaar = "yes";
          state.fields.bankAccount = "yes";
          state.fields.deathCertificate = "yes";
          state.missingDocs = [];
          state.step = 10;
          return {
            state,
            reply: interpolate(t.summary[lang], {
              name: state.fields.name || "—",
              age: state.fields.age || "—",
              village: state.fields.village || "—",
              scheme: schemes.widow_pension.name[lang],
              docs: "None",
            }),
          };
        }
        if (state.missingDocs.length > 0) {
          return {
            state,
            reply: interpolate(t.docMissing[lang], { docs: state.missingDocs.join(", ") }),
          };
        }
        state.step = 10;
        return {
          state,
          reply: interpolate(t.summary[lang], {
            name: state.fields.name || "—",
            age: state.fields.age || "—",
            village: state.fields.village || "—",
            scheme: schemes.widow_pension.name[lang],
            docs: "None",
          }),
        };
      }
      case 10: {
        const yes = detectYes(message);
        if (yes) {
          state.confirmed = true;
          state.mode = "submitted";
          state.step = 11;
          return {
            state,
            reply: interpolate(t.submitted[lang], { ref: "{ref}" }),
            done: true,
            submitData: {
              type: "application",
              payload: {
                schemeId: state.schemeId,
                citizenName: state.fields.name,
                phone: state.fields.phone,
                language: lang,
                extractedData: state.fields,
                missingDocs: state.missingDocs,
              },
            },
          };
        }
        return { state, reply: t.fallback[lang] };
      }
    }
  }

  if (state.mode === "complaint") {
    switch (state.step) {
      case 20: {
        const cat = detectComplaintCategory(message);
        if (cat) {
          state.complaintCategory = cat;
          state.step = 21;
          return { state, reply: t.askComplaintLocation[lang] };
        }
        return { state, reply: t.askComplaintCategory[lang] };
      }
      case 21: {
        state.complaintLocation = message.trim();
        state.step = 22;
        return { state, reply: t.askComplaintDescription[lang] };
      }
      case 22: {
        state.complaintDescription = message.trim();
        state.step = 23;
        const hours = 1; // demo SLA: 1 hour
        return {
          state,
          reply: interpolate(t.complaintSubmitted[lang], { ref: "{ref}", hours: String(hours) }),
          done: true,
          submitData: {
            type: "complaint",
            payload: {
              category: state.complaintCategory,
              description: state.complaintDescription,
              location: state.complaintLocation,
              citizenPhone: state.fields.phone,
              slaHours: hours,
            },
          },
        };
      }
    }
  }

  if (state.mode === "status") {
    if (state.step === 30) {
      const ref = message.trim();
      state.referenceNumber = ref;
      state.step = 31;
      return {
        state,
        reply: interpolate(t.statusResult[lang], { status: "{status}" }),
        done: true,
      };
    }
  }

  return { state, reply: t.fallback[lang] };
}

export function welcomeReply(lang: Language): string {
  return `${t.greeting[lang]} ${t.askIntent[lang]}`;
}

export function finalizeReply(lang: Language, reply: string, ref: string): string {
  return reply.replace("{ref}", ref);
}

export function finalizeStatusReply(lang: Language, reply: string, status: string): string {
  return reply.replace("{status}", status);
}

export function escalateReply(lang: Language): string {
  return t.escalateNotice[lang];
}
