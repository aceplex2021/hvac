# Unified Bot Folder Structure

This structure supports a single, unified bot (chatbot + voicebot) for your HVAC app. All text and voice features are handled together, making it easy to maintain and extend.

```
hvac-core/
└── src/
    ├── components/
    │   └── chatbot/
    │       ├── ChatWidget.tsx         # Main UI: handles both text and voice
    │       ├── MessageList.tsx
    │       ├── MessageInput.tsx
    │       ├── VoiceControls.tsx      # Mic button, TTS playback, etc.
    │       ├── BotAvatar.tsx
    │       └── ...                    # (Optional) TypingIndicator, etc.
    ├── lib/
    │   └── chatbot/
    │       ├── buildPrompt.ts
    │       ├── fetchSPData.ts
    │       ├── llmClient.ts
    │       ├── livekitClient.ts       # LiveKit integration for voice
    │       ├── speechToText.ts        # STT logic
    │       ├── textToSpeech.ts        # TTS logic
    │       └── ...                    # (Optional) utils, hooks, etc.
    ├── app/
    │   └── api/
    │       └── chatbot/
    │           ├── route.ts           # Handles both text and voice requests
    │           ├── stt.ts             # (Optional) Speech-to-text endpoint
    │           ├── tts.ts             # (Optional) Text-to-speech endpoint
    │           └── livekit-webhook.ts # (Optional) LiveKit event handling
    ├── types/
    │   └── chatbot.ts                 # Types for both text and voice messages
    └── ...
```

## Key Points

- **Single `chatbot/` folder** for all bot-related UI and logic.
- **Voice features (LiveKit, STT, TTS)** are just additional files/components inside `chatbot/`.
- **ChatWidget.tsx** is the main entry point and handles both text and voice interactions.
- **VoiceControls.tsx** handles mic input, TTS playback, and UI for voice.
- **Backend/API** can have endpoints for text, STT, TTS, and LiveKit events, all under `/api/chatbot/`.
- **Types** are unified for both text and voice messages.

## How It Works

- The user interacts with a single chat window.
- They can type or use voice (mic button).
- Voice input is transcribed (STT), sent to the LLM, and the response can be played back (TTS).
- All logic/UI is in one place, making it easy to maintain and extend. 