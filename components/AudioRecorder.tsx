'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Pause, Square, FileAudio, Clock, Users, Brain, ChevronRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Recording {
  id: string;
  blob: Blob;
  duration: number;
  timestamp: Date;
  status: 'recording' | 'processing' | 'completed' | 'error';
  summary?: {
    keyPoints: string[];
    actionItems: string[];
    decisions: string[];
    nextSteps: string[];
  };
}

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<number | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { t, language } = useLanguage();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const recording: Recording = {
          id: Date.now().toString(),
          blob: audioBlob,
          duration,
          timestamp: new Date(),
          status: 'processing'
        };

        setRecordings(prev => [recording, ...prev]);
        setIsProcessing(true);

        // Simulate AI processing
        setTimeout(() => {
          generateSummary(recording.id);
        }, 3000);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert(language === 'en' ? 'Please allow microphone access to record meetings.' : 'Veuillez autoriser l\'accès au microphone pour enregistrer des réunions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const generateSummary = (recordingId: string) => {
    // Simulate AI-generated summary
    const summary = {
      keyPoints: [
        language === 'en' ? 'Client expressed satisfaction with current progress' : 'Client a exprimé sa satisfaction avec les progrès actuels',
        language === 'en' ? 'Budget needs adjustment for Q4 deliverables' : 'Le budget doit être ajusté pour les livrables du T4',
        language === 'en' ? 'New project timeline approved by stakeholders' : 'Nouveau calendrier de projet approuvé par les parties prenantes'
      ],
      actionItems: [
        language === 'en' ? 'Send revised proposal by Friday' : 'Envoyer la proposition révisée d\'ici vendredi',
        language === 'en' ? 'Schedule follow-up meeting with technical team' : 'Planifier une réunion de suivi avec l\'équipe technique',
        language === 'en' ? 'Update project documentation with new timeline' : 'Mettre à jour la documentation du projet avec le nouveau calendrier'
      ],
      decisions: [
        language === 'en' ? 'Proceed with Phase 2 development' : 'Procéder au développement de la Phase 2',
        language === 'en' ? 'Increase budget by 15% for additional features' : 'Augmenter le budget de 15% pour les fonctionnalités supplémentaires'
      ],
      nextSteps: [
        language === 'en' ? 'Technical review scheduled for next Tuesday' : 'Examen technique prévu pour mardi prochain',
        language === 'en' ? 'Client to provide feedback by end of week' : 'Le client doit fournir un retour d\'ici la fin de la semaine'
      ]
    };

    setRecordings(prev => prev.map(rec =>
      rec.id === recordingId
        ? { ...rec, status: 'completed', summary }
        : rec
    ));
    setIsProcessing(false);
  };

  const playRecording = (recording: Recording) => {
    const audio = new Audio(URL.createObjectURL(recording.blob));
    audio.play();
  };

  const deleteRecording = (recordingId: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== recordingId));
  };

  const demoData: Recording[] = [
    {
      id: 'demo1',
      blob: new Blob(),
      duration: 1847,
      timestamp: new Date(Date.now() - 3600000),
      status: 'completed',
      summary: {
        keyPoints: [
          language === 'en' ? 'Client satisfaction with current project progress' : 'Satisfaction client avec les progrès du projet actuel',
          language === 'en' ? 'Discussion of new feature requirements' : 'Discussion des nouvelles exigences fonctionnelles',
          language === 'en' ? 'Timeline adjustments needed for Q4 delivery' : 'Ajustements de calendrier nécessaires pour la livraison T4'
        ],
        actionItems: [
          language === 'en' ? 'Update project plan with new timeline' : 'Mettre à jour le plan de projet avec le nouveau calendrier',
          language === 'en' ? 'Send revised quote for additional features' : 'Envoyer un devis révisé pour les fonctionnalités supplémentaires',
          language === 'en' ? 'Schedule technical review meeting' : 'Planifier une réunion d\'examen technique'
        ],
        decisions: [
          language === 'en' ? 'Approved budget increase of $5,000' : 'Augmentation de budget approuvée de 5 000$',
          language === 'en' ? 'Confirmed delivery date of December 15th' : 'Date de livraison confirmée du 15 décembre'
        ],
        nextSteps: [
          language === 'en' ? 'Technical team to review requirements tomorrow' : 'L\'équipe technique examinera les exigences demain',
          language === 'en' ? 'Client to provide final feedback by Thursday' : 'Le client doit fournir un retour final d\'ici jeudi'
        ]
      }
    },
    {
      id: 'demo2',
      blob: new Blob(),
      duration: 2634,
      timestamp: new Date(Date.now() - 7200000),
      status: 'completed',
      summary: {
        keyPoints: [
          language === 'en' ? 'Strategic planning for 2024 initiatives' : 'Planification stratégique pour les initiatives 2024',
          language === 'en' ? 'Team expansion requirements discussed' : 'Exigences d\'expansion d\'équipe discutées',
          language === 'en' ? 'Marketing campaign budget allocation' : 'Allocation budgétaire pour la campagne marketing'
        ],
        actionItems: [
          language === 'en' ? 'Prepare hiring plan for Q1 2024' : 'Préparer le plan d\'embauche pour T1 2024',
          language === 'en' ? 'Design marketing campaign materials' : 'Concevoir les matériaux de la campagne marketing',
          language === 'en' ? 'Research new technology stack options' : 'Rechercher de nouvelles options de pile technologique'
        ],
        decisions: [
          language === 'en' ? 'Approved hiring of 3 new developers' : 'Embauche approuvée de 3 nouveaux développeurs',
          language === 'en' ? 'Allocated $50,000 for marketing initiatives' : '50 000$ alloués pour les initiatives marketing'
        ],
        nextSteps: [
          language === 'en' ? 'Post job listings by end of week' : 'Publier les offres d\'emploi d\'ici la fin de la semaine',
          language === 'en' ? 'Marketing campaign launch scheduled for January' : 'Lancement de la campagne marketing prévu pour janvier'
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              AI Meeting Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {language === 'en'
              ? 'Record meetings and let AI transform hours of conversation into actionable insights, summaries, and follow-ups.'
              : 'Enregistrez des réunions et laissez l\'IA transformer des heures de conversation en informations exploitables, résumés et suivis.'
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">{language === 'en' ? 'Save Hours' : 'Économisez des Heures'}</h3>
              <p className="text-sm text-gray-300">{language === 'en' ? 'No more manual note-taking' : 'Plus de prise de notes manuelle'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <Brain className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <h3 className="font-semibold mb-2">{language === 'en' ? 'AI-Powered' : 'Alimenté par l\'IA'}</h3>
              <p className="text-sm text-gray-300">{language === 'en' ? 'Smart summaries & insights' : 'Résumés et informations intelligentes'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <h3 className="font-semibold mb-2">{language === 'en' ? 'Team Ready' : 'Prêt pour l\'Équipe'}</h3>
              <p className="text-sm text-gray-300">{language === 'en' ? 'Share insights instantly' : 'Partagez des informations instantanément'}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Recording Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8"
        >
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <motion.div
                animate={isRecording && !isPaused ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-12 h-12 text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </motion.div>
              {isRecording && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full animate-ping" />
                </div>
              )}
            </div>

            <div className="text-3xl font-mono font-bold mb-6">
              {formatTime(duration)}
            </div>

            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="inline-flex items-center px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-red-300 font-medium">
                    {isPaused
                      ? (language === 'en' ? 'Recording Paused' : 'Enregistrement en Pause')
                      : (language === 'en' ? 'Recording in Progress' : 'Enregistrement en Cours')
                    }
                  </span>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-center space-x-4">
              {!isRecording ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Start Recording' : 'Commencer l\'Enregistrement'}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={pauseRecording}
                    className="px-6 py-3 bg-yellow-500 rounded-2xl font-semibold hover:bg-yellow-600 transition-all flex items-center"
                  >
                    {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                    {isPaused
                      ? (language === 'en' ? 'Resume' : 'Reprendre')
                      : (language === 'en' ? 'Pause' : 'Pause')
                    }
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopRecording}
                    className="px-6 py-3 bg-red-500 rounded-2xl font-semibold hover:bg-red-600 transition-all flex items-center"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Stop' : 'Arrêter'}
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            {language === 'en' ? 'Recent Meeting Summaries' : 'Résumés de Réunions Récentes'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoData.map((recording, index) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <FileAudio className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{language === 'en' ? 'Client Meeting' : 'Réunion Client'}</h3>
                      <p className="text-sm text-gray-400">
                        {formatTime(Math.floor(recording.duration))} • {recording.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentDemo(currentDemo === index ? null : index)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${currentDemo === index ? 'rotate-90' : ''}`} />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {currentDemo === index && recording.summary && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 pt-4 mt-4 space-y-4"
                    >
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {language === 'en' ? 'Key Points' : 'Points Clés'}
                        </h4>
                        <ul className="space-y-1">
                          {recording.summary.keyPoints.map((point, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start">
                              <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {language === 'en' ? 'Action Items' : 'Éléments d\'Action'}
                        </h4>
                        <ul className="space-y-1">
                          {recording.summary.actionItems.map((item, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start">
                              <span className="w-1 h-1 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => playRecording(recording)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
                        >
                          <Play className="w-4 h-4" />
                          <span>{language === 'en' ? 'Play Recording' : 'Lire l\'Enregistrement'}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span>{language === 'en' ? 'Export Summary' : 'Exporter le Résumé'}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Processing Indicator */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold">{language === 'en' ? 'AI Processing Your Meeting...' : 'L\'IA traite votre réunion...'}</p>
                  <p className="text-sm text-gray-400">{language === 'en' ? 'Generating summary and action items' : 'Génération du résumé et des éléments d\'action'}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-1 mt-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}