import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Shield, Minimize2, Maximize2 } from 'lucide-react';
import { useThreatIntelligence } from '../context/ThreatContext';
import { askGeminiThreatAssistant } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
    const { globalSummary, ioCs, threatActors } = useThreatIntelligence();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
        { sender: 'ai', text: 'Hello, Commander. Sentinel AI online. How can I assist with the current threat landscape?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen, isMinimized]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        // Prepare context
        const contextSummary = JSON.stringify({
            globalSummary,
            recentHighSeverityIoCs: ioCs.filter(i => i.severity === 'critical' || i.severity === 'high').slice(0, 5),
            activeThreatActors: threatActors.filter(t => t.severity === 'critical').map(t => t.name)
        });

        const response = await askGeminiThreatAssistant(userMsg, contextSummary);

        setMessages(prev => [...prev, { sender: 'ai', text: response }]);
        setIsLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center transition-all duration-300"
            >
                <Shield className="h-8 w-8" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 transition-all duration-300 flex flex-col ${isMinimized ? 'w-72 h-16' : 'w-96 h-[500px]'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-t-lg border-b border-gray-700">
                <div className="flex items-center text-purple-400 font-bold">
                    <Shield className="h-5 w-5 mr-2" />
                    <span>Sentinel AI</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-400 hover:text-white">
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-gray-800 space-y-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700 text-gray-200 p-3 rounded-lg rounded-bl-none text-sm border border-gray-600">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-gray-900 border-t border-gray-700 rounded-b-lg">
                        <div className="flex items-center bg-gray-800 rounded-md border border-gray-700 px-3 py-2">
                            <input
                                type="text"
                                className="flex-grow bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                                placeholder="Ask about threats..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="text-purple-500 hover:text-purple-400 disabled:opacity-50 ml-2"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default GeminiAssistant;