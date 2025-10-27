'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const predefinedResponses = {
  en: {
    greetings: [
      "Hello! I'm StructureClerk's AI assistant. How can I help you today?",
      "Hi there! I can help you understand how StructureClerk can automate your business tasks. What would you like to know?"
    ],
    features: [
      "StructureClerk offers three core features: AI document extraction, meeting intelligence, and smart automations. Each one is designed to save you hours of administrative work.",
      "Our platform can automatically extract data from documents, transcribe and summarize meetings, and set up custom workflows to handle repetitive tasks."
    ],
    pricing: [
      "We offer a Pro plan at $99/month and an Enterprise plan at $299/month. Both come with a 30-day free trial, so you can try before you buy!",
      "Our Pro plan includes unlimited documents, AI extraction, financial forecasts, and project management. The Enterprise plan adds multi-level approvals, custom workflows, and priority support."
    ],
    trial: [
      "You can start your 30-day free trial right now - no credit card required! Just click the 'Start Free Trial' button and you'll be up and running in 2 minutes.",
      "Getting started is easy! Click on any 'Start Free Trial' button, create your account, and immediately access all features. No setup required!"
    ],
    security: [
      "We take security seriously. StructureClerk is GDPR and PIPEDA compliant, uses bank-level encryption, and all data is stored securely in Canada.",
      "Your data is protected with enterprise-grade security. We use end-to-end encryption and never share your information with third parties."
    ],
    default: [
      "That's a great question! Our platform can help with that. Would you like to know more about our features, pricing, or start a free trial?",
      "I'd be happy to help! StructureClerk is designed to automate administrative tasks for consultants, freelancers, and small businesses. What specific aspect interests you?"
    ]
  },
  fr: {
    greetings: [
      "Bonjour! Je suis l'assistant IA de StructureClerk. Comment puis-je vous aider aujourd'hui?",
      "Salut! Je peux vous aider à comprendre comment StructureClerk peut automatiser vos tâches professionnelles. Que souhaitez-vous savoir?"
    ],
    features: [
      "StructureClerk offre trois fonctionnalités principales : l'extraction IA de documents, l'intelligence des réunions, et les automatisations intelligentes. Chacune est conçue pour vous faire économiser des heures de travail administratif.",
      "Notre plateforme peut automatiquement extraire des données de documents, transcrire et résumer des réunions, et configurer des workflows personnalisés pour gérer les tâches répétitives."
    ],
    pricing: [
      "Nous offrons un plan Pro à 99$/mois et un plan Enterprise à 299$/mois. Les deux incluent un essai gratuit de 30 jours, essayez avant d'acheter!",
      "Notre plan Pro inclut documents illimités, extraction IA, prévisions financières et gestion de projet. Le plan Enterprise ajoute approbations multi-niveaux, workflows personnalisés et support prioritaire."
    ],
    trial: [
      "Vous pouvez commencer votre essai gratuit de 30 jours maintenant - aucune carte de crédit requise! Cliquez sur 'Commencer l'Essai Gratuit' et vous serez opérationnel en 2 minutes.",
      "Commencer est facile! Cliquez sur n'importe quel bouton 'Commencer l'Essai Gratuit', créez votre compte, et accédez immédiatement à toutes les fonctionnalités. Aucune configuration requise!"
    ],
    security: [
      "Nous prenons la sécurité au sérieux. StructureClerk est conforme GDPR et PIPEDA, utilise un chiffrement de niveau bancaire, et toutes les données sont stockées sécuritairement au Canada.",
      "Vos données sont protégées par une sécurité de niveau entreprise. Nous utilisons le chiffrement de bout en bout et ne partageons jamais vos informations avec des tiers."
    ],
    default: [
      "C'est une excellente question! Notre plateforme peut aider avec cela. Aimeriez-vous en savoir plus sur nos fonctionnalités, tarifs, ou commencer un essai gratuit?",
      "Je serais ravi d'aider! StructureClerk est conçu pour automatiser les tâches administratives pour consultants, freelancers et PME. Quel aspect spécifique vous intéresse?"
    ]
  }
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    const responses = predefinedResponses[language];

    // Check for keywords and return appropriate response
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('bonjour') || lowerInput.includes('salut')) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    } else if (lowerInput.includes('feature') || lowerInput.includes('function') || lowerInput.includes('fonctionnalité') || lowerInput.includes('caractéristique')) {
      return responses.features[Math.floor(Math.random() * responses.features.length)];
    } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('prix') || lowerInput.includes('tarif')) {
      return responses.pricing[Math.floor(Math.random() * responses.pricing.length)];
    } else if (lowerInput.includes('trial') || lowerInput.includes('free') || lowerInput.includes('essai') || lowerInput.includes('gratuit')) {
      return responses.trial[Math.floor(Math.random() * responses.trial.length)];
    } else if (lowerInput.includes('security') || lowerInput.includes('safe') || lowerInput.includes('sécurité') || lowerInput.includes('sûr')) {
      return responses.security[Math.floor(Math.random() * responses.security.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-40 group"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse">
          <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" />
        </div>
        <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {language === 'en' ? 'Need help?' : 'Besoin d\'aide?'}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-white/80 text-sm flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1" />
                    {language === 'en' ? 'Online' : 'En ligne'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">
                    {language === 'en' ? 'Hello! How can I help you today?' : 'Bonjour! Comment puis-je vous aider aujourd\'hui?'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {language === 'en' ? 'Ask me about features, pricing, or get started!' : 'Demandez-moi des fonctionnalités, tarifs, ou commencez!'}
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'en' ? 'Type your message...' : 'Tapez votre message...'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={inputValue.trim() === '' || isTyping}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}