export type Language = "en" | "kn" | "kanglish";
// Typing-indicator status words; `default` applies to avatar variants without their own copy.
const KN_TYPING = ["ಯೋಚಿಸುತ್ತಿದೆ…", "ಟೈಪ್ ಮಾಡುತ್ತಿದೆ…"] as const;
const KANGLISH_TYPING = ["Yochistide…", "Type madta ide…"] as const;
export const copy = {
  en: {
    greeting:
      "Hello! Ask us about gates, grills, railings or other steel fabrication in Mysuru.",
    placeholder: "Ask about your fabrication work…",
    send: "Send message",
    close: "Close chat",
    open: "Open chat assistant",
    title: "SMEW Assistant",
    status: "English · ಕನ್ನಡ · Kanglish",
    connecting: "Connecting… you can start typing.",
    typing: "Assistant is typing",
    typingSteps: {
      default: ["Typing…"],
      welder: ["Welding a reply…", "Typing…"],
      "welder-at-work": ["Welding your answer…", "Typing…"],
      torch: ["Heating up a reply…", "Typing…"],
      grinder: ["Grinding out a reply…", "Typing…"],
      "mask-expressive": ["Sparking an idea…", "Typing…"],
      "weld-bead": ["Joining the pieces…", "Typing…"],
      worker: ["Hammering out an answer…", "Typing…"],
      gate: ["Shaping a reply…", "Typing…"],
    },
    restart: "New chat",
    unavailable:
      "The assistant is temporarily unavailable. Call or WhatsApp Prashanth at 9986464819.",
    rateLimited:
      "You're sending messages a bit fast. Please try again in a minute.",
    dailyLimit:
      "Our chat is busy today. Please call or WhatsApp Prashanth at 9986464819.",
    retry: "Retry message",
    busy: "Please wait for the current reply.",
    consent:
      "I agree that SMEW may save my number and contact me about this enquiry.",
    phone: "Your mobile number",
    name: "Your name (optional)",
    submit: "Request callback",
    submitting: "Saving…",
    invalid: "Enter a valid Indian mobile number.",
    submitError: "Couldn't save your request. Try again or call 9986464819.",
    continueChat:
      "Please continue the chat a little more. The callback form opens once we have your details.",
    saved:
      "Your callback request is saved. Prashanth will confirm availability.",
    privacy:
      "Chats are saved for up to 30 days. The website keeps callback details for up to 180 days and shares them with SMEW via Telegram. Telegram copies are managed separately by the workshop. Call 9986464819 to request deletion.",
    chips: [
      "Our services",
      "I need a gate",
      "Materials used",
      "Contact and hours",
    ],
  },
  kn: {
    greeting:
      "ನಮಸ್ಕಾರ! ಮೈಸೂರಿನಲ್ಲಿ ಗೇಟ್, ಗ್ರಿಲ್, ರೇಲಿಂಗ್ ಅಥವಾ ಇತರ ಸ್ಟೀಲ್ ಕೆಲಸಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.",
    placeholder: "ನಿಮ್ಮ ಕೆಲಸದ ಬಗ್ಗೆ ಕೇಳಿ…",
    send: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    close: "ಚಾಟ್ ಮುಚ್ಚಿ",
    open: "ಚಾಟ್ ಸಹಾಯಕ ತೆರೆಯಿರಿ",
    title: "SMEW ಸಹಾಯಕ",
    status: "English · ಕನ್ನಡ · Kanglish",
    connecting: "ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ… ನೀವು ಟೈಪ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಬಹುದು.",
    typing: "ಸಹಾಯಕರು ಉತ್ತರ ಬರೆಯುತ್ತಿದ್ದಾರೆ",
    typingSteps: { default: KN_TYPING },
    restart: "ಹೊಸ ಚಾಟ್",
    unavailable:
      "ಈಗ ಸಹಾಯಕ ಲಭ್ಯವಿಲ್ಲ. ಪ್ರಶಾಂತ್ ಅವರಿಗೆ 9986464819 ಸಂಖ್ಯೆಯಲ್ಲಿ ಕರೆ ಅಥವಾ WhatsApp ಮಾಡಬಹುದು.",
    rateLimited:
      "ನೀವು ಸ್ವಲ್ಪ ವೇಗವಾಗಿ ಸಂದೇಶ ಕಳುಹಿಸುತ್ತಿದ್ದೀರಿ. ದಯವಿಟ್ಟು ಒಂದು ನಿಮಿಷದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    dailyLimit:
      "ಇಂದು ನಮ್ಮ ಚಾಟ್ ತುಂಬಾ ಬ್ಯುಸಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಪ್ರಶಾಂತ್ ಅವರಿಗೆ 9986464819 ಗೆ ಕರೆ ಅಥವಾ WhatsApp ಮಾಡಿ.",
    retry: "ಮತ್ತೆ ಕಳುಹಿಸಿ",
    busy: "ಪ್ರಸ್ತುತ ಉತ್ತರಕ್ಕಾಗಿ ಕಾಯಿರಿ.",
    consent:
      "ಈ ವಿಚಾರಣೆಯ ಬಗ್ಗೆ ಸಂಪರ್ಕಿಸಲು SMEW ನನ್ನ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಿಕೊಳ್ಳಲು ಒಪ್ಪುತ್ತೇನೆ.",
    phone: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    name: "ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)",
    submit: "ಕರೆ ವಿನಂತಿಸಿ",
    submitting: "ಉಳಿಸಲಾಗುತ್ತಿದೆ…",
    invalid: "ಸರಿಯಾದ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.",
    submitError:
      "ವಿನಂತಿ ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ 9986464819 ಗೆ ಕರೆ ಮಾಡಿ.",
    continueChat:
      "ದಯವಿಟ್ಟು ಇನ್ನೂ ಸ್ವಲ್ಪ ಚಾಟ್ ಮುಂದುವರಿಸಿ. ನಿಮ್ಮ ವಿವರಗಳು ಸಿಕ್ಕ ನಂತರ ಕರೆ ವಿನಂತಿ ಫಾರ್ಮ್ ತೆರೆಯುತ್ತದೆ.",
    saved:
      "ನಿಮ್ಮ ಕರೆ ವಿನಂತಿಯನ್ನು ಉಳಿಸಲಾಗಿದೆ. ಪ್ರಶಾಂತ್ ಅವರು ಲಭ್ಯತೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತಾರೆ.",
    privacy:
      "ಚಾಟ್‌ಗಳನ್ನು 30 ದಿನಗಳವರೆಗೆ ಉಳಿಸಲಾಗುತ್ತದೆ. ವೆಬ್‌ಸೈಟ್ ಕರೆ ವಿವರಗಳನ್ನು 180 ದಿನಗಳವರೆಗೆ ಉಳಿಸಿ Telegram ಮೂಲಕ SMEW ಜೊತೆ ಹಂಚಿಕೊಳ್ಳುತ್ತದೆ. Telegram ಪ್ರತಿಗಳನ್ನು ಕಾರ್ಯಾಗಾರ ಪ್ರತ್ಯೇಕವಾಗಿ ನಿರ್ವಹಿಸುತ್ತದೆ. ಅಳಿಸಲು 9986464819 ಗೆ ಕರೆ ಮಾಡಿ.",
    chips: [
      "ನಮ್ಮ ಸೇವೆಗಳು",
      "ನನಗೆ ಗೇಟ್ ಬೇಕು",
      "ಬಳಸುವ ಮೆಟೀರಿಯಲ್",
      "ಸಂಪರ್ಕ ಮತ್ತು ಸಮಯ",
    ],
  },
  kanglish: {
    greeting:
      "Namaskara! Mysurinali gate, grill, railing athava bere steel kelasa bagge kelabahudu.",
    placeholder: "Nimma kelasa bagge keli…",
    send: "Message kalisi",
    close: "Chat close madi",
    open: "Chat assistant open madi",
    title: "SMEW Assistant",
    status: "English · ಕನ್ನಡ · Kanglish",
    connecting: "Connect aagta ide… neevu type madoke shuru madabahudu.",
    typing: "Assistant type madta ide",
    typingSteps: { default: KANGLISH_TYPING },
    restart: "Hosa chat",
    unavailable:
      "Iga assistant available illa. Prashanth avarige 9986464819 ge call athava WhatsApp madi.",
    rateLimited:
      "Neevu swalpa fast aagi message kalistidira. Ondu nimisha bittu matte try madi.",
    dailyLimit:
      "Ivattu namma chat thumba busy ide. Prashanth avarige 9986464819 ge call athava WhatsApp madi.",
    retry: "Matte kalisi",
    busy: "Current reply barovaregu kayiri.",
    consent:
      "Ee enquiry bagge contact madoke SMEW nanna number save madikollalu opputtene.",
    phone: "Nimma mobile number",
    name: "Nimma hesaru (optional)",
    submit: "Callback request madi",
    submitting: "Save madta idivi…",
    invalid: "Valid Indian mobile number enter madi.",
    submitError:
      "Request save aagilla. Matte try madi athava 9986464819 ge call madi.",
    continueChat:
      "Swalpa innu chat continue madi. Nimma details sikkida mele callback form open aagutte.",
    saved:
      "Nimma callback request save aagide. Prashanth avaru availability confirm madtare.",
    privacy:
      "Chats 30 dina varegu save aagutte. Website callback details 180 dina varegu save maadi Telegram moolaka SMEW jothe share madutte. Telegram copies na workshop separate aagi manage madutte. Delete madoke 9986464819 ge call madi.",
    chips: [
      "Namma services",
      "Nanage gate beku",
      "Yaava material",
      "Contact mattu timings",
    ],
  },
} as const;
