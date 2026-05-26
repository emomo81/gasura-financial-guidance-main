'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QUESTION_CHIPS = [
  'Can I afford a new phone?',
  'Best protein source for my family?',
  'What do I do with my buffer?',
  'Am I on track this month?',
];

export default function AskGasuraPage() {
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const availableVoicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !("speechSynthesis" in window)) return;

    const speech = window.speechSynthesis;
    const syncVoices = () => {
      availableVoicesRef.current = speech.getVoices();
    };

    syncVoices();
    speech.addEventListener('voiceschanged', syncVoices);

    return () => {
      speech.removeEventListener('voiceschanged', syncVoices);
    };
  }, []);

  function handleSend() {
    const text = input.trim();
    if (!text || status === 'submitted' || status === 'streaming') return;
    sendMessage({ text });
    setInput('');
  }

  function handleChip(chip: string) {
    if (status === 'submitted' || status === 'streaming') return;
    sendMessage({ text: chip });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function getLatestAssistantText() {
    const latestAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');
    if (!latestAssistantMessage) return '';

    return latestAssistantMessage.parts
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join('\n')
      .trim();
  }

  function markdownToSpeechText(markdown: string) {
    const withoutMarkdown = markdown
      .replace(/```(?:\w+)?\n?/g, '')
      .replace(/```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s?/gm, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1');

    const cleanedLines = withoutMarkdown
      .split('\n')
      .map((line) => {
        const isTableDelimiter = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
        if (isTableDelimiter) return '';

        return line
          .replace(/^\s*\|\s*/, '')
          .replace(/\s*\|\s*$/g, '')
          .replace(/\s*\|\s*/g, ', ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      })
      .filter(Boolean)
      .join('. ')
      .replace(/\.\s*\./g, '.')
      .replace(/\s{2,}/g, ' ')
      .trim();

    return cleanedLines;
  }

  function getPreferredVoice(voices: SpeechSynthesisVoice[]) {
    if (voices.length === 0) return null;

    const preferredLanguages = ['en-RW', 'rw-RW', 'en-KE', 'en-UG', 'en-TZ', 'en-GB', 'en-US'];
    const preferredNames = [
      'aria online (natural)',
      'jenny online (natural)',
      'google uk english female',
      'google us english',
      'aria',
      'jenny',
      'zira',
      'libby',
      'sonia',
      'sara',
    ];
    const qualityHints = ['natural', 'neural', 'online', 'wavenet', 'studio', 'enhanced', 'premium'];
    const femaleHints = ['female', 'aria', 'jenny', 'zira', 'libby', 'sonia', 'sara'];

    const scoreVoice = (voice: SpeechSynthesisVoice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      let score = 0;

      const languageRank = preferredLanguages.findIndex((language) => lang.startsWith(language.toLowerCase()));
      if (languageRank >= 0) {
        score += 100 - languageRank * 10;
      }

      const preferredNameRank = preferredNames.findIndex((preferred) => name.includes(preferred));
      if (preferredNameRank >= 0) {
        score += 200 - preferredNameRank * 10;
      }

      if (qualityHints.some((hint) => name.includes(hint))) score += 45;
      if (femaleHints.some((hint) => name.includes(hint))) score += 20;
      if (voice.localService === false) score += 10;
      if (voice.default) score += 5;

      return score;
    };

    const sortedVoices = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return sortedVoices[0] ?? voices[0];
  }

  function handleReadAloud() {
    if (typeof window === 'undefined') {
      return;
    }

    if (!("speechSynthesis" in window)) {
      window.alert('Text-to-speech is not supported in this browser.');
      return;
    }

    const speech = window.speechSynthesis;

    if (speech.speaking) {
      speech.cancel();
      setIsSpeaking(false);
      return;
    }

    const latestAssistantText = getLatestAssistantText();
    if (!latestAssistantText || isStreaming) {
      window.alert('No assistant response available to read yet.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(markdownToSpeechText(latestAssistantText));
    const selectedVoice = getPreferredVoice(
      availableVoicesRef.current.length > 0 ? availableVoicesRef.current : speech.getVoices(),
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.93;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speech.cancel();
    setIsSpeaking(true);
    speech.speak(utterance);
  }

  const isStreaming = status === 'streaming' || status === 'submitted';
  const hasAssistantResponse = getLatestAssistantText().length > 0;

  function renderAssistantMarkdown(content: string) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="font-headline text-lg font-bold text-on-surface mb-2 leading-snug">{children}</h1>,
          h2: ({ children }) => <h2 className="font-headline text-base font-semibold text-on-surface mt-3 mb-2 leading-snug">{children}</h2>,
          h3: ({ children }) => <h3 className="font-headline text-sm font-semibold text-on-surface mt-2 mb-1.5 leading-snug">{children}</h3>,
          p: ({ children }) => <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-2">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-sm text-on-surface-variant">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-sm text-on-surface-variant">{children}</ol>,
          li: ({ children }) => <li className="font-body leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary underline decoration-primary/50 underline-offset-2 hover:decoration-primary"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-outline-variant pl-3 italic text-on-surface-variant mb-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-surface-container-low">{children}</thead>,
          th: ({ children }) => <th className="border border-outline-variant/50 px-2 py-1 text-left font-semibold text-on-surface">{children}</th>,
          td: ({ children }) => <td className="border border-outline-variant/50 px-2 py-1 text-on-surface-variant">{children}</td>,
          code: ({ inline, children }) =>
            inline ? (
              <code className="font-mono text-[0.85em] bg-surface-container-low px-1 py-0.5 rounded">{children}</code>
            ) : (
              <code className="block font-mono text-xs sm:text-sm bg-surface-container-low rounded-lg p-3 overflow-x-auto whitespace-pre">{children}</code>
            ),
          hr: () => <hr className="my-3 border-outline-variant/40" />,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-surface font-body text-on-surface">
      {/* Fixed header */}
      <header className="flex-shrink-0 bg-surface-container-lowest border-b border-outline-variant/30 z-40">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-headline text-base font-bold text-on-surface leading-tight">Ask Gasura</p>
            <p className="font-body text-xs text-on-surface-variant">Based on your March 2026 plan</p>
          </div>
          {/* Animated sound bars */}
          <div className={`flex items-end gap-0.5 h-5 ${isStreaming ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            <div className="sound-bar bg-secondary h-4" />
            <div className="sound-bar bg-secondary h-3" />
            <div className="sound-bar bg-secondary h-5" />
            <div className="sound-bar bg-secondary h-2" />
          </div>
          <button
            onClick={handleReadAloud}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            title={isSpeaking ? 'Stop reading' : 'Read latest response'}
            aria-label={isSpeaking ? 'Stop reading latest response' : 'Read latest response aloud'}
          >
            <span className="material-symbols-outlined">{isSpeaking ? 'stop' : 'volume_up'}</span>
          </button>
        </div>
      </header>

      {/* Question chips */}
      <div className="flex-shrink-0 bg-surface border-b border-outline-variant/20">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {QUESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChip(chip)}
                disabled={isStreaming}
                className="flex-shrink-0 font-label text-xs font-semibold px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-full border border-outline-variant/40 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <span className="font-headline text-2xl font-bold text-on-primary">G</span>
              </div>
              <h2 className="font-headline text-xl font-bold text-on-surface mb-2">Hello! I&apos;m Gasura</h2>
              <p className="font-body text-sm text-on-surface-variant max-w-xs">
                Your AI financial parent. Ask me anything about your budget, spending, or savings in Rwanda.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {messages.map((message) => {
              const isUser = message.role === 'user';

              if (isUser) {
                return (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-xs sm:max-w-sm bg-primary text-on-primary rounded-2xl rounded-tr-sm px-4 py-3">
                      {message.parts.map((part, i) => {
                        if (part.type === 'text') {
                          return (
                            <p key={i} className="font-body text-sm leading-relaxed">
                              {part.text}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              }

              // Assistant message
              return (
                <div key={message.id} className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-headline text-sm font-bold text-on-primary-container">G</span>
                  </div>
                  {/* Bubble */}
                  <div className="flex-1 min-w-0 bg-surface-container-lowest border-l-4 border-secondary rounded-2xl rounded-tl-sm px-5 py-4">
                    {message.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return <div key={i}>{renderAssistantMarkdown(part.text)}</div>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-headline text-sm font-bold text-on-primary-container">G</span>
                </div>
                <div className="bg-surface-container-lowest border-l-4 border-secondary rounded-2xl rounded-tl-sm px-5 py-4">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky input bar */}
      <div className="flex-shrink-0 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReadAloud}
              className="w-11 h-11 bg-secondary-container rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
              title={isSpeaking ? 'Stop reading' : 'Read latest response'}
              aria-label={isSpeaking ? 'Stop reading latest response' : 'Read latest response aloud'}
            >
              <span className="material-symbols-outlined text-on-secondary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isSpeaking ? 'mic_off' : 'mic'}
              </span>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or speak to Gasura..."
              disabled={isStreaming}
              className="flex-1 bg-surface-container-low text-on-surface font-body text-sm px-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/60 transition-all disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="w-11 h-11 bg-primary rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
