'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  MapPin,
  Globe2,
  Zap,
  Camera,
  Mic,
  Sparkles,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface AIDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIDemoModal({ isOpen, onClose }: AIDemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const demoSteps = [
    {
      title: "1. Upload Your Document",
      description: "Take a photo, upload a file, or record audio. Our AI handles any format.",
      icon: Upload,
      color: "from-blue-600 to-indigo-600"
    },
    {
      title: "2. AI Processing",
      description: "Our Canadian-trained AI analyzes documents with 99.2% accuracy.",
      icon: Brain,
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "3. Instant Insights",
      description: "Get tax calculations, categorization, and actionable insights instantly.",
      icon: BarChart3,
      color: "from-green-600 to-emerald-600"
    }
  ];

  const sampleDocuments = [
    {
      name: "Invoice_2024_Q1.pdf",
      type: "Invoice",
      amount: "$2,450.00",
      tax: "GST/HST: $318.50",
      category: "Business Services",
      confidence: 99.2
    },
    {
      name: "Receipt_Store.jpg",
      type: "Receipt",
      amount: "$127.43",
      tax: "GST: $6.37",
      category: "Office Supplies",
      confidence: 98.7
    },
    {
      name: "Contract_Client.pdf",
      type: "Contract",
      amount: "$15,000.00",
      tax: "Exempt",
      category: "Client Work",
      confidence: 99.8
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setUploadedFile(null);
      setAnalysisResults(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      simulateProcessing();
    }
  };

  const simulateProcessing = () => {
    setCurrentStep(1);
    setIsProcessing(true);

    // Simulate AI processing with realistic timing
    setTimeout(() => {
      const randomDoc = sampleDocuments[Math.floor(Math.random() * sampleDocuments.length)];
      setAnalysisResults({
        ...randomDoc,
        processingTime: "2.3 seconds",
        extractedFields: [
          { field: "Document Type", value: randomDoc.type, confidence: 99 },
          { field: "Amount", value: randomDoc.amount, confidence: 99 },
          { field: "Tax Information", value: randomDoc.tax, confidence: 98 },
          { field: "Category", value: randomDoc.category, confidence: 95 },
          { field: "Date", value: "2024-01-15", confidence: 97 },
          { field: "Vendor", value: "Canadian Business Corp.", confidence: 94 }
        ],
        canadianCompliance: {
          province: "Ontario",
          taxRate: "13% HST",
          taxAmount: randomDoc.type === "Contract" ? "Exempt" : "$" + (parseFloat(randomDoc.amount.replace(/[^0-9.]/g, '')) * 0.13).toFixed(2),
          deductible: randomDoc.type !== "Contract"
        },
        aiInsights: [
          "This expense is 100% tax-deductible for your business",
          "Consider categorizing under 'Professional Services' for better tracking",
          "GST/HST amount can be claimed as input tax credit",
          "Document meets all Canadian business record requirements"
        ]
      });
      setCurrentStep(2);
      setIsProcessing(false);
    }, 3000);
  };

  const handleSampleDocument = () => {
    setUploadedFile("Sample_Invoice.pdf");
    simulateProcessing();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl bg-black border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  AI-Powered Document Processing Demo
                </h2>
                <p className="text-gray-400 mt-1">Experience the magic of Canadian AI automation</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {demoSteps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep >= index
                          ? `bg-gradient-to-r ${step.color}`
                          : 'bg-white/10'
                      }`}>
                        <step.icon className={`w-6 h-6 ${
                          currentStep >= index ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      {index < demoSteps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                          currentStep > index ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-white/10'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-[400px]"
              >
                {/* Step 1: Upload */}
                {currentStep === 0 && (
                  <div className="text-center">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${demoSteps[0].color} flex items-center justify-center`}>
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Upload Your Document</h3>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                      Try our AI with any Canadian business document - invoices, receipts, contracts, or statements.
                    </p>

                    {/* Upload Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-2xl p-8 mb-6 cursor-pointer hover:border-white/40 transition-colors bg-white/5"
                    >
                      <div className="flex flex-col items-center">
                        <FileText className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-white font-semibold mb-2">
                          {uploadedFile || "Click to upload or drag and drop"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          PDF, JPG, PNG up to 10MB
                        </p>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />

                    {/* Sample Document Button */}
                    <div className="space-y-4">
                      <button
                        onClick={handleSampleDocument}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      >
                        Try Sample Document
                      </button>
                      <div className="flex justify-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Camera className="w-4 h-4 mr-1" />
                          Photo
                        </div>
                        <div className="flex items-center">
                          <Mic className="w-4 h-4 mr-1" />
                          Audio
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Document
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Processing */}
                {currentStep === 1 && (
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${demoSteps[1].color} animate-pulse`} />
                      <div className="relative w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                        <Brain className="w-12 h-12 text-white animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">AI Processing in Progress</h3>
                    <p className="text-gray-400 mb-8">
                      Our Canadian-trained AI is analyzing your document with industry-leading accuracy
                    </p>

                    {/* Processing Animation */}
                    <div className="space-y-4 max-w-md mx-auto">
                      {[
                        "Extracting text and data",
                        "Identifying Canadian tax codes",
                        "Calculating GST/HST/QST",
                        "Categorizing for Canadian business",
                        "Generating insights"
                      ].map((task, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            isProcessing ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                          }`} />
                          <span className={`text-sm ${
                            isProcessing ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Powered by Canadian AI technology</span>
                    </div>
                  </div>
                )}

                {/* Step 3: Results */}
                {currentStep === 2 && analysisResults && (
                  <div>
                    <div className="text-center mb-8">
                      <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${demoSteps[2].color} flex items-center justify-center`}>
                        <BarChart3 className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Analysis Complete!</h3>
                      <p className="text-gray-400">
                        Document processed in {analysisResults.processingTime} with {analysisResults.confidence}% accuracy
                      </p>
                    </div>

                    {/* Results Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {/* Document Summary */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h4 className="font-bold mb-4 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-blue-400" />
                          Document Summary
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Type:</span>
                            <span className="font-semibold">{analysisResults.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Amount:</span>
                            <span className="font-semibold text-green-400">{analysisResults.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tax:</span>
                            <span className="font-semibold">{analysisResults.tax}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Category:</span>
                            <span className="font-semibold">{analysisResults.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Canadian Compliance */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h4 className="font-bold mb-4 flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-red-400" />
                          Canadian Compliance
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Province:</span>
                            <span className="font-semibold">{analysisResults.canadianCompliance.province}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tax Rate:</span>
                            <span className="font-semibold">{analysisResults.canadianCompliance.taxRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tax Amount:</span>
                            <span className="font-semibold">{analysisResults.canadianCompliance.taxAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Deductible:</span>
                            <span className={`font-semibold ${analysisResults.canadianCompliance.deductible ? 'text-green-400' : 'text-gray-400'}`}>
                              {analysisResults.canadianCompliance.deductible ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Extracted Fields */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                      <h4 className="font-bold mb-4 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-purple-400" />
                        Extracted Fields
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {analysisResults.extractedFields.map((field: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div>
                              <div className="text-sm text-gray-400">{field.field}</div>
                              <div className="font-semibold">{field.value}</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                field.confidence >= 95 ? 'bg-green-400' :
                                field.confidence >= 90 ? 'bg-yellow-400' : 'bg-red-400'
                              }`} />
                              <span className="text-xs text-gray-400">{field.confidence}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-xl p-6 mb-8">
                      <h4 className="font-bold mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                        AI Business Insights
                      </h4>
                      <div className="space-y-3">
                        {analysisResults.aiInsights.map((insight: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => {
                          setCurrentStep(0);
                          setUploadedFile(null);
                          setAnalysisResults(null);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      >
                        Try Another Document
                      </button>
                      <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
                      >
                        Close Demo
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}