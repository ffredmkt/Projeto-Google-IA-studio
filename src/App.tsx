/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  CheckCircle2, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Phone, 
  Baby,
  Heart,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Bell,
  Quote,
  Star,
  Plus,
  Minus,
  HelpCircle,
  Check,
  AlertCircle,
  Menu,
  X,
  Globe,
  ArrowUp,
  Instagram,
  ExternalLink,
  Search,
  Handshake,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { useEffect, useState, ChangeEvent, useCallback, useRef } from 'react';
import { useMultiStepForm, Step } from './hooks/useMultiStepForm';

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.605 6.06L0 24l6.117-1.605a11.845 11.845 0 005.933 1.598h.005c6.637 0 12.032-5.395 12.035-12.03a11.76 11.76 0 00-3.489-8.502" />
  </svg>
);

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

function FormularioAltaConversao({ whatsappLink }: { whatsappLink: string }) {
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const steps: Step[] = [
    {
      question: "Você está:",
      options: ["Grávida", "Já teve bebê recentemente", "Adotei uma criança", "Perdi o bebê (natimorto)"],
      key: "perfil",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Você já trabalhou com carteira assinada?",
      options: ["Sim", "Não", "Não sei"],
      key: "carteira",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Hoje você está:",
      options: ["Trabalhando registrada", "Desempregada", "Sem carteira", "MEI", "Trabalhadora rural"],
      key: "situacao",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Você tem filhos menores de 5 anos?",
      options: ["Sim", "Não"],
      key: "filhos",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Você teve o salário maternidade negado nos últimos 5 anos?",
      options: ["Sim", "Não", "Não sei"],
      key: "negado",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Você paga ou já pagou o INSS?",
      options: ["Sim, pago atualmente", "Já paguei no passado", "Nunca paguei", "Não sei"],
      key: "inss",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Qual seu nome?",
      type: "input",
      key: "nome",
      placeholder: "Digite seu nome completo",
      validate: (v) => {
        const trimmed = v.trim();
        if (trimmed.length === 0) return "Por favor, digite seu nome.";
        if (trimmed.length < 3) return "O nome deve ter pelo menos 3 letras.";
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) return "O nome deve conter apenas letras.";
        return null;
      }
    },
    {
      question: "Qual seu WhatsApp?",
      type: "input",
      key: "whatsapp",
      placeholder: "(00) 00000-0000",
      mask: maskPhone,
      validate: (v) => {
        const digits = v.replace(/\D/g, "");
        if (digits.length === 0) return "Por favor, digite seu WhatsApp.";
        if (digits.length < 10) return "O número deve ter o DDD (ex: 86) + o número.";
        if (digits.length > 11) return "Número de WhatsApp inválido.";
        const ddd = parseInt(digits.substring(0, 2));
        if (ddd < 11 || ddd > 99) return "Por favor, insira um DDD válido.";
        return null;
      }
    }
  ];

  const {
    step,
    currentStep,
    data,
    inputValue,
    isAnalyzing,
    error,
    isValidating,
    isValid,
    handleInputChange,
    handleNext,
    handleBack,
    isCompleted,
    totalSteps
  } = useMultiStepForm(steps);

  useEffect(() => {
    if (isCompleted && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Consulta Salário Maternidade',
        status: 'Formulário Principal Concluído'
      });
    }
  }, [isCompleted]);

  const handleSubmit = () => {
    const summary = Object.entries(data)
      .map(([key, val]) => {
        const stepInfo = steps.find(s => s.key === key);
        return `*${stepInfo?.question}* ${val}`;
      })
      .join("\n");

    const msg = `Olá Dr. Friedrich, acabei de fazer a consulta no site.\n\n*Resumo da Consulta:*\n${summary}\n\nQuero saber se tenho direito ao salário maternidade.`;
    
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Contact', {
        method: 'WhatsApp',
        content_name: 'Formulário Principal'
      });
    }

    const lawyerNumber = "5586981362434";
    const url = `https://wa.me/${lawyerNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (isAnalyzing) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 bg-white p-12 rounded-3xl border border-slate-200 shadow-2xl text-center flex flex-col items-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 size={48} className="text-sky-500 animate-spin mb-6" aria-hidden="true" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Estamos vendo se você pode receber...</h3>
        <p className="text-slate-600">Conferindo as regras do INSS para o seu caso.</p>
      </motion.div>
    );
  }

  if (isCompleted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl text-center"
        role="alert"
        aria-live="assertive"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20" aria-hidden="true">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Tudo pronto!</h3>
        <p className="text-slate-600 mb-8">Pelas suas respostas, você tem grandes chances de receber o dinheiro! Clique abaixo para falar com o Dr. Friedrich agora.</p>
        <button
          onClick={handleSubmit}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-900/10 active:scale-95 focus:ring-4 focus:ring-green-500/50 focus:outline-none"
        >
          <WhatsAppIcon size={24} />
          Falar no WhatsApp agora
        </button>
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={12} className="text-sky-500" aria-hidden="true" />
          Seus dados estão protegidos pela LGPD
        </div>
      </motion.div>
    );
  }

  return (
    <div id="form-consulta" className="w-full max-w-md mx-auto" role="region" aria-labelledby="form-title">
      <div className="text-center mb-6">
        <h3 id="form-title" className="text-sky-400 font-bold text-lg mb-1">Veja se você pode receber o benefício</h3>
        <p className="text-slate-400 text-sm">Responda 8 perguntinhas rápidas e descubra se tem direito ao dinheiro.</p>
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-2xl text-left relative"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-none"
                aria-label="Voltar para a pergunta anterior"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <span className="text-sky-600 text-xs font-bold uppercase tracking-widest" aria-live="polite">
              Passo {step + 1} de {totalSteps}
            </span>
          </div>
          <div className="flex gap-1" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 w-3 rounded-full transition-colors ${i <= step ? 'bg-sky-500' : 'bg-slate-100'}`} 
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <h2 id={`question-${step}`} className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-tight">
          {currentStep.question}
        </h2>

        {currentStep.type === "input" ? (
          <form 
            className="space-y-4" 
            onSubmit={(e) => {
              e.preventDefault();
              handleNext(inputValue);
            }}
          >
            <label htmlFor={`input-${currentStep.key}`} className="sr-only">
              {currentStep.question}
            </label>
            <div className="relative">
              <input
                id={`input-${currentStep.key}`}
                type={currentStep.key === "whatsapp" ? "tel" : "text"}
                placeholder={currentStep.placeholder}
                value={inputValue}
                onChange={handleInputChange}
                className={`w-full bg-slate-50 border rounded-2xl p-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all text-lg ${
                  error 
                    ? "border-red-500 focus:ring-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]" 
                    : isValid 
                      ? "border-green-500 focus:ring-green-500 shadow-[0_0_0_1px_rgba(34,197,94,0.1)]"
                      : "border-slate-200 focus:ring-sky-500"
                }`}
                autoFocus
                aria-describedby={error ? `error-${currentStep.key}` : `question-${step}`}
                aria-invalid={!!error}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6">
                <AnimatePresence mode="wait">
                  {isValidating ? (
                    <motion.div
                      key="validating"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Loader2 size={18} className="text-sky-500 animate-spin" />
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <AlertCircle size={18} className="text-red-500" />
                    </motion.div>
                  ) : isValid ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.5, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Check size={18} className="text-green-500" />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  id={`error-${currentStep.key}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-sm font-medium px-2 overflow-hidden"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 focus:ring-2 focus:ring-sky-500 focus:outline-offset-2"
            >
              Próximo
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <div className="grid gap-3" role="group" aria-labelledby={`question-${step}`}>
            {currentStep.options?.map((opt: string) => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className="w-full text-left p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-sky-500 hover:shadow-md text-slate-700 font-medium transition-all flex items-center justify-between group focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {opt}
                <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-sky-500 transition-colors" aria-hidden="true">
                  <div className="w-2 h-2 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-[0.2em]">
          <ShieldCheck size={12} className="text-sky-500" aria-hidden="true" />
          Dados protegidos pela LGPD
        </div>
      </motion.div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string, key?: number | string }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `faq-content-${question.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: '#7dd3fc' }}
      viewport={{ once: true }}
      className="border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all shadow-sm hover:shadow-xl"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-inset"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="font-bold text-slate-800 pr-8 text-lg">{question}</span>
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-sky-500 text-white rotate-180 shadow-lg shadow-sky-500/20' : 'bg-slate-100 text-slate-400'}`}>
          {isOpen ? <Minus size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            role="region"
            aria-labelledby={`faq-question-${contentId}`}
          >
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50 text-base">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ChatBot({ isOpen, onClose, whatsappLink }: { isOpen: boolean, onClose: () => void, whatsappLink: string }) {
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const steps: Step[] = [
    {
      question: "Você está:",
      options: ["Grávida", "Já teve bebê recentemente", "Adotei uma criança", "Perdi o bebê (natimorto)"],
      key: "perfil",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Você já trabalhou com carteira assinada?",
      options: ["Sim", "Não", "Não sei"],
      key: "carteira",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Hoje você está:",
      options: ["Trabalhando registrada", "Desempregada", "Sem carteira", "MEI", "Trabalhadora rural"],
      key: "situacao",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Você tem filhos menores de 5 anos?",
      options: ["Sim", "Não"],
      key: "filhos",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Você teve o salário maternidade negado nos últimos 5 anos?",
      options: ["Sim", "Não", "Não sei"],
      key: "negado",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Você paga ou já pagou o INSS?",
      options: ["Sim, pago atualmente", "Já paguei no passado", "Nunca paguei", "Não sei"],
      key: "inss",
      validate: (v) => v.trim().length === 0 ? "Por favor, selecione uma opção." : null
    },
    {
      question: "Qual seu nome?",
      type: "input",
      key: "nome",
      placeholder: "Digite seu nome completo",
      validate: (v) => {
        const trimmed = v.trim();
        if (trimmed.length === 0) return "Por favor, digite seu nome.";
        if (trimmed.length < 3) return "O nome deve ter pelo menos 3 letras.";
        return null;
      }
    },
    {
      question: "Qual seu WhatsApp?",
      type: "input",
      key: "whatsapp",
      placeholder: "(00) 00000-0000",
      mask: maskPhone,
      validate: (v) => {
        const digits = v.replace(/\D/g, "");
        if (digits.length === 0) return "Por favor, digite seu WhatsApp.";
        if (digits.length < 10) return "O número deve ter o DDD + o número.";
        return null;
      }
    }
  ];

  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: "Olá! Sou o assistente do Dr. Friedrich. Vou te ajudar a descobrir se você tem direito ao Salário Maternidade." },
    { type: 'bot', text: "Para começar, você está:" }
  ]);

  const {
    step,
    currentStep,
    data,
    inputValue,
    isAnalyzing,
    error,
    isValidating,
    isValid,
    handleInputChange,
    handleNext,
    isCompleted
  } = useMultiStepForm(steps);

  useEffect(() => {
    if (isCompleted && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Consulta Salário Maternidade',
        status: 'ChatBot Concluído'
      });
    }
  }, [isCompleted]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastAddedStepRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAnalyzing, isCompleted]);

  // Sync messages with step changes
  useEffect(() => {
    if (step > 0 && step < steps.length && step !== lastAddedStepRef.current) {
      const botQuestion = steps[step].question;
      setMessages(prev => [...prev, { type: 'bot', text: botQuestion }]);
      lastAddedStepRef.current = step;
    }
  }, [step, steps]);

  const onNext = (val: string) => {
    const currentError = currentStep.validate?.(val);
    if (currentError) return; // Hook handleNext will set the error state

    setMessages(prev => [...prev, { type: 'user', text: val }]);
    handleNext(val);
  };

  const handleSubmit = () => {
    const summary = Object.entries(data)
      .map(([key, val]) => {
        const stepInfo = steps.find(s => s.key === key);
        return `*${stepInfo?.question}* ${val}`;
      })
      .join("\n");

    const msg = `Olá Dr. Friedrich, acabei de fazer a consulta pelo chat do site.\n\n*Resumo da Consulta:*\n${summary}\n\nQuero saber se tenho direito ao salário maternidade.`;
    
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Contact', {
        method: 'WhatsApp',
        content_name: 'ChatBot'
      });
    }

    const url = `https://wa.me/5586981362434?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-20 right-4 left-4 md:left-auto md:right-6 md:bottom-24 w-auto md:w-[400px] h-[500px] max-h-[calc(100vh-120px)] bg-white rounded-3xl shadow-2xl z-[60] flex flex-col overflow-hidden border border-slate-100"
          role="dialog"
          aria-modal="true"
          aria-label="Assistente virtual Dr. Friedrich França"
        >
          {/* Header */}
          <div className="bg-[#0B1221] p-4 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
                <Users size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-sm">Suporte Dr. Friedrich</p>
                <p className="text-[10px] text-sky-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                  Online agora
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Fechar assistente"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50" role="log" aria-live="polite">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.type === 'bot' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.type === 'bot' 
                    ? 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none' 
                    : 'bg-sky-500 text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start" role="status">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" aria-hidden="true" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" aria-hidden="true" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" aria-hidden="true" />
                  <span className="sr-only">Analisando suas respostas...</span>
                </div>
              </div>
            )}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
                role="status"
              >
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none text-sm text-slate-700">
                  Boas notícias! Pelas suas respostas, você tem grandes chances de receber o benefício. Clique no botão abaixo para falar diretamente com o Dr. Friedrich.
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input/Options */}
          <div className="p-4 bg-white border-t border-slate-100">
            {!isCompleted ? (
              currentStep.type === "input" ? (
                <div className="space-y-2">
                  <div className="flex gap-2 relative">
                    <input
                      type={currentStep.key === "whatsapp" ? "tel" : "text"}
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder={currentStep.placeholder}
                      className={`flex-grow bg-slate-50 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 transition-all ${
                        error ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-sky-500"
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && onNext(inputValue)}
                      aria-label={currentStep.question}
                      aria-invalid={!!error}
                      aria-describedby={error ? "chat-error" : undefined}
                    />
                    <button 
                      onClick={() => onNext(inputValue)}
                      className="bg-sky-500 text-white p-2 rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      disabled={isValidating}
                      aria-label="Enviar resposta"
                    >
                      {isValidating ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        id="chat-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-[10px] font-medium px-1"
                        role="alert"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1" role="group" aria-label={currentStep.question}>
                  {currentStep.options?.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => onNext(opt)}
                      className="text-left px-4 py-2 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-sm text-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )
            ) : (
              <button
                onClick={handleSubmit}
                className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-all focus:outline-none focus:ring-4 focus:ring-green-500/50"
              >
                <WhatsAppIcon size={20} aria-hidden="true" />
                Falar no WhatsApp
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const whatsappLink = "https://wa.me/5586981362434"; // Friedrich França WhatsApp
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Lock body scroll when menu or chat is open
  useEffect(() => {
    if (isMenuOpen || isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isChatOpen]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const testimonials = [
    {
      name: "Maria Silva",
      content: "O Dr. Friedrich foi essencial para que eu conseguisse meu auxílio. Atendimento humanizado e rápido! Me senti segura em todo o processo.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Ana Santos",
      content: "Eu achava que não tinha direito por ser MEI, mas a consultoria me ajudou a entender tudo e recebi o benefício sem complicações.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Juliana Oliveira",
      content: "Excelente profissional. Me passou muita segurança desde o primeiro contato. Recomendo para todas as mães que precisam de ajuda.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Fernanda Lima",
      content: "O atendimento superou todas as minhas expectativas. O Dr. Friedrich e sua equipe foram extremamente profissionais e rápidos. Consegui o auxílio para os meus dois bebês!",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Carla Mendes",
      content: "Fui muito bem atendida. O processo foi todo online e muito prático. Recebi meu salário maternidade em menos de 30 dias!",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  const faqData = [
    {
      q: "Quem tem direito ao Salário Maternidade com as novas regras?",
      a: "Mães que contribuem para o INSS (empregadas, MEI, facultativas ou individuais). Com a nova decisão do STF, autônomas e MEIs NÃO precisam mais de 10 meses de carência, basta ter qualidade de segurada."
    },
    {
      q: "Tive o benefício negado por falta de carência, o que fazer?",
      a: "Se o seu pedido foi negado nos últimos 5 anos por não ter as 10 contribuições, você pode solicitar uma REVISÃO com base na nova decisão do STF e receber os valores retroativos."
    },
    {
      q: "Estou desempregada, ainda posso receber?",
      a: "Sim! Se você parou de contribuir há menos de 12 meses (podendo chegar a 36 meses em casos específicos), você ainda pode estar segurada pelo INSS e ter direito ao benefício."
    },
    {
      q: "Qual o prazo para pedir o benefício?",
      a: "Você tem até 5 anos após o nascimento ou adoção para solicitar. No entanto, recomendamos pedir o quanto antes para garantir o suporte financeiro."
    },
    {
      q: "Quanto tempo demora para o dinheiro cair?",
      a: "O prazo do INSS varia, mas com nossa assessoria estratégica, evitamos erros comuns que travam o processo, buscando a aprovação no menor tempo possível."
    },
    {
      q: "MEI tem direito ao benefício?",
      a: "Sim! E agora ficou mais fácil: não é mais obrigatório ter 10 meses de contribuição pagos antes do parto, seguindo a nova decisão do STF de 2026."
    },
    {
      q: "Quem adota uma criança também tem direito ao auxílio?",
      a: "Sim! O direito ao salário-maternidade é garantido para quem adota ou obtém guarda judicial para fins de adoção. O benefício tem a mesma duração de 120 dias, independentemente da idade da criança."
    },
    {
      q: "Tive um natimorto ou aborto espontâneo, tenho algum direito?",
      a: "Sim. Em casos de natimorto (parto a partir da 23ª semana), a mãe tem direito aos 120 dias de auxílio. Em casos de aborto não criminoso comprovado por atestado médico, o INSS garante 2 semanas de salário-maternidade."
    },
    {
      q: "Trabalho de forma informal, consigo receber o benefício?",
      a: "Mães que trabalham sem carteira assinada (autônomas ou rurais) podem ter direito se comprovarem a atividade ou se ainda estiverem no período de manutenção da qualidade de segurada. Analisamos cada caso para garantir o seu direito."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Elegibilidade', href: '#elegibilidade' },
    { name: 'Como funciona', href: '#como-funciona' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'Dúvidas', href: '#duvidas' },
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      {/* Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-sky-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:font-bold focus:shadow-2xl transition-all"
      >
        Pular para o conteúdo principal
      </a>

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* Navbar */}
      <header>
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm" aria-label="Navegação principal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              {/* Logo */}
              <a href="#inicio" className="flex items-center gap-2 md:gap-3 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg p-1 shrink-0" aria-label="Início - Friedrich França Advocacia">
                <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center overflow-hidden rounded-xl md:rounded-2xl">
                  <img 
                    src="https://iili.io/qgliKP9.jpg" 
                    alt="" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm md:text-xl font-bold tracking-tight text-[#0B1221] leading-none">SALÁRIO MATERNIDADE</span>
                  <span className="text-[7px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-sky-600 font-semibold">Advocacia Especializada</span>
                </div>
              </a>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-8" role="menubar">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    className="group relative text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md px-2 py-1"
                    role="menuitem"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" aria-hidden="true" />
                  </a>
                ))}
              </div>

              {/* CTA & Mobile Toggle */}
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).fbq) {
                      (window as any).fbq('track', 'Contact', { method: 'WhatsApp', content_name: 'Navbar' });
                    }
                    setIsChatOpen(true);
                  }}
                  className="flex items-center gap-2 bg-[#0B1221] hover:bg-slate-800 text-white p-2.5 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
                  aria-label="Abrir chat de atendimento no WhatsApp"
                >
                  <WhatsAppIcon size={16} aria-hidden="true" />
                  <span className="hidden md:inline">Falar no WhatsApp</span>
                </button>
                
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                  aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMenuOpen ? <X size={20} md:size={24} aria-hidden="true" /> : <Menu size={20} md:size={24} aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]"
                  aria-hidden="true"
                />

                {/* Menu Content */}
                <motion.div
                  id="mobile-menu"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 300 }}
                  dragElastic={0.05}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 80 || info.velocity.x > 500) {
                      setIsMenuOpen(false);
                    }
                  }}
                  className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[120] shadow-2xl flex flex-col touch-pan-y overflow-hidden"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu de navegação móvel"
                >
                  {/* Drag Handle Indicator */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-slate-200 rounded-full md:hidden" aria-hidden="true" />
                  
                  <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://iili.io/qgliKP9.jpg" 
                          alt="" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="font-bold text-sm text-[#0B1221]">MENU</span>
                    </div>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                      aria-label="Fechar menu"
                    >
                      <X size={24} aria-hidden="true" />
                    </button>
                  </div>

                  <nav className="flex-1 overflow-y-auto p-6 space-y-2" aria-label="Menu móvel">
                    {navLinks.map((link, idx) => (
                      <motion.a 
                        key={link.name} 
                        href={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between text-lg font-bold text-slate-700 hover:text-sky-600 transition-colors p-4 rounded-2xl hover:bg-sky-50 border border-transparent hover:border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        {link.name}
                        <ChevronRight size={18} className="text-slate-300" aria-hidden="true" />
                      </motion.a>
                    ))}
                  </nav>

                  <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <div className="mb-6 space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contato Direto</p>
                      <a href="tel:86981362434" className="flex items-center gap-3 text-slate-600 font-medium hover:text-sky-600 transition-colors">
                        <Phone size={18} className="text-sky-500" />
                        (86) 98136-2434
                      </a>
                      <a href="mailto:friedrichfrancaadvocacia@gmail.com" className="flex items-center gap-3 text-slate-600 font-medium hover:text-sky-600 transition-colors">
                        <Mail size={18} className="text-sky-500" />
                        <span className="text-sm truncate">E-mail Profissional</span>
                      </a>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).fbq) {
                          (window as any).fbq('track', 'Contact', { method: 'WhatsApp', content_name: 'Mobile Menu' });
                        }
                        setIsMenuOpen(false);
                        setIsChatOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-[#0B1221] text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-sky-500/50"
                      aria-label="Falar no WhatsApp"
                    >
                      <WhatsAppIcon size={20} aria-hidden="true" />
                      Falar no WhatsApp
                    </button>
                    <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-semibold">
                      Atendimento Especializado
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <main id="main-content">

      {/* Hero Section */}
      <section id="inicio" className="relative pt-32 pb-24 overflow-hidden bg-[#0B1221]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://iili.io/qskdKoF.jpg" 
            alt="Mãe segurando um bebê" 
            className="w-full h-full object-cover opacity-60 object-[75%_center] md:object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#0B1221]/40 md:bg-gradient-to-r md:from-[#0B1221]/80 md:via-[#0B1221]/60 md:to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div {...fadeIn} className="max-w-3xl">
              <div className="w-32 h-32 flex items-center justify-center overflow-hidden mb-8 mx-auto rounded-3xl">
                <img 
                  src="https://iili.io/qgliKP9.jpg" 
                  alt="Friedrich França Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-8">
                Descubra se você tem direito a no mínimo R$ 6.484,00 de <span className="text-sky-400">Salário Maternidade.</span>
              </h1>
              
              <FormularioAltaConversao whatsappLink={whatsappLink} />

              <div className="flex flex-col items-center justify-center gap-4 mt-8">
                <p className="text-sm text-slate-300 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-sky-400" />
                  Consulta 100% segura e sigilosa
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section id="elegibilidade" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="https://iili.io/qgWFxcP.jpg" 
                  alt="Maternidade e Direitos" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1221] mb-8 leading-tight">
                Você pode ter direito ao benefício se:
              </h2>
              <ul className="space-y-5 mb-10">
                {[
                  "Está grávida ou teve bebê recentemente",
                  "Teve o benefício negado nos últimos 5 anos (Cabe Revisão!)",
                  "Trabalhou como MEI ou Autônoma (Sem carência de 10 meses!)",
                  "Mora e trabalha na zona rural ou urbana",
                  "Está desempregada há menos de 3 anos"
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-lg text-slate-700 font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <a 
                href="#form-consulta"
                className="inline-flex items-center gap-2 text-sky-600 font-bold text-lg hover:underline decoration-2 underline-offset-8"
              >
                CLIQUE AQUI E VERIFIQUE SEU DIREITO
                <ArrowRight size={20} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-20 bg-[#0B1221] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Clock className="mx-auto mb-6 text-sky-400" size={48} />
            <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-wider">
              Importante: Existe um prazo para solicitar o salário maternidade
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              Muitas mães acabam perdendo o benefício porque não sabem que existe um prazo para fazer a solicitação. Se o pedido não for feito dentro do período correto, o benefício pode não ser concedido.
            </p>
            <a 
              href="#form-consulta"
              className="inline-block bg-sky-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-sky-600 transition-colors shadow-lg"
            >
              Quero saber agora se tenho direito
            </a>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1221] leading-tight">Como funciona a análise</h2>
              
              <div className="space-y-10">
                {[
                  {
                    title: "Você clica no botão abaixo e fala com nossos especialistas no Whatsapp",
                    icon: <Handshake size={32} />
                  },
                  {
                    title: "Verificamos se você tem direito ao benefício e regularizamos sua situação no INSS para você receber o Salário Maternidade.",
                    icon: <Search size={32} />
                  },
                  {
                    title: "Acompanhamos até que você receba o benefício.",
                    icon: <Calendar size={32} />
                  }
                ].map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    viewport={{ once: true }}
                    className="flex gap-6 group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      {step.icon}
                    </div>
                    <div className="space-y-2 flex-grow">
                      <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
                        {step.title}
                      </p>
                      {idx < 2 && <div className="pt-8 border-b border-slate-100 w-full" />}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4">
                <a 
                  href="#form-consulta"
                  className="inline-block bg-[#0B1221] text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  RECEBA SEU ATENDIMENTO AGORA
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-slate-50">
                <img 
                  src="https://iili.io/qrK3LGt.jpg" 
                  alt="Processo de Análise" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 text-center flex flex-col items-center"
            >
              <h2 className="text-3xl font-bold mb-8 text-[#0B1221]">Sobre o Dr. Friedrich França</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Advogado há mais de 10 anos, inscrito na OAB/PI Nº 16.220 e OAB/MA Nº 22356-A, atuo com dedicação e excelência na defesa dos direitos dos meus clientes.
              </p>
              <p className="text-lg text-slate-600 mb-12 leading-relaxed">
                Com sede em Teresina/PI, presto atendimento presencial e online para todo o território nacional, garantindo que mães de todo o Brasil tenham acesso ao Salário Maternidade de forma segura e estratégica.
              </p>
              <div className="w-full flex justify-center">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm text-center">
                  <p className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-2">Atendimento</p>
                  <p className="text-slate-700">100% Online para todo o Brasil</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://iili.io/qglUhKJ.jpg" 
                  alt="Dr. Friedrich França" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-full mb-6 border border-sky-100">
                <MapPin size={14} className="text-sky-600" />
                <span className="text-sm font-bold text-sky-700 uppercase tracking-wider">Onde Estamos</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1221] mb-4">
                Sede em Teresina e Atendimento Nacional
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Nosso escritório físico está localizado na Av Homero Castelo Branco, 1956, Sala 01, Horto, Teresina-PI, mas atendemos mães de todos os estados do Brasil de forma 100% digital.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-8"
            >
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="text-xl font-bold text-[#0B1221] mb-6 flex items-center gap-2">
                  <Briefcase size={20} className="text-sky-600" />
                  Escritório Físico
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin size={20} className="text-sky-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">Av Homero Castelo Branco, 1956, Sala 01, Horto, Teresina-PI</p>
                      <p className="text-slate-600 text-sm mb-2">Atendimento presencial com agendamento prévio.</p>
                      <a 
                        href="https://maps.app.goo.gl/FdQsbPs2XejgXBKaA" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-600 font-bold text-sm hover:underline"
                      >
                        Ver no Google Maps
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users size={20} className="text-sky-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">Atendimento Digital</p>
                      <p className="text-slate-600 text-sm">Consultoria completa via WhatsApp e Videoconferência para todo o Brasil.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <a 
                    href="#form-consulta"
                    className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 text-white py-4 rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
                  >
                    Agendar Consulta
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>

              <div className="bg-[#0B1221] p-8 rounded-3xl text-white text-center">
                <h3 className="text-xl font-bold mb-4">Áreas de Atendimento</h3>
                <div className="flex items-center justify-center gap-3">
                  <Globe size={24} className="text-sky-400" />
                  <span className="text-lg font-semibold">Atendimento em Todo o Brasil</span>
                </div>
                <p className="text-slate-400 text-sm mt-4">
                  Consultoria 100% digital e segura para mães de todos os estados brasileiros.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-2 h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.523456789!2d-42.7859844!3d-5.0682859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x78e3690029b359f%3A0x854407887309228d!2sFriedrich%20Fran%C3%A7a%20Advocacia!5e0!3m2!1spt-BR!2sbr!4v1711234567890!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do Escritório Friedrich França Advocacia"
              ></iframe>
              <a 
                href="https://maps.app.goo.gl/FdQsbPs2XejgXBKaA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6 bg-white text-[#0B1221] px-6 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
              >
                <MapPin size={18} className="text-sky-500" />
                Abrir no Google Maps
                <ExternalLink size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-full mb-6 border border-sky-100">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-sky-500 text-sky-500" />
                  ))}
                </div>
                <span className="text-sm font-bold text-sky-700">100% de Satisfação</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1221] mb-4">
                O que dizem as nossas clientes
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Milhares de mães já garantiram seus direitos com a nossa consultoria especializada.
              </p>
            </motion.div>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => paginate(-1)}
                className="hidden md:flex p-4 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-sky-500 hover:text-white transition-all shadow-lg active:scale-95 z-10"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex-1 overflow-hidden" aria-live="polite">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={{
                      enter: (direction: number) => ({
                        x: direction > 0 ? 100 : -100,
                        opacity: 0
                      }),
                      center: {
                        zIndex: 1,
                        x: 0,
                        opacity: 1
                      },
                      exit: (direction: number) => ({
                        zIndex: 0,
                        x: direction < 0 ? 100 : -100,
                        opacity: 0
                      })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);

                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1);
                      }
                    }}
                    className="bg-slate-50 p-8 md:p-12 rounded-[40px] border border-slate-100 relative group cursor-grab active:cursor-grabbing"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Depoimento ${currentIndex + 1} de ${testimonials.length}`}
                  >
                    <div className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 md:w-16 md:h-16 bg-sky-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-lg" aria-hidden="true">
                      <Quote size={32} className="hidden md:block" />
                      <Quote size={24} className="md:hidden" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                        <img 
                          src={testimonials[currentIndex].image} 
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          aria-hidden="true"
                        />
                      </div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex gap-1 mb-4 justify-center md:justify-start" aria-label="Avaliação 5 estrelas">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className="fill-sky-500 text-sky-500" aria-hidden="true" />
                          ))}
                        </div>
                        <p className="text-lg md:text-2xl text-slate-700 italic leading-relaxed mb-8">
                          "{testimonials[currentIndex].content}"
                        </p>
                        <div>
                          <h4 className="text-xl font-bold text-[#0B1221]">{testimonials[currentIndex].name}</h4>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button 
                onClick={() => paginate(1)}
                className="hidden md:flex p-4 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-sky-500 hover:text-white transition-all shadow-lg active:scale-95 z-10"
                aria-label="Próximo depoimento"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden justify-center gap-4 mt-8">
              <button 
                onClick={() => paginate(-1)}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 active:bg-sky-500 active:text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button 
                onClick={() => paginate(1)}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 active:bg-sky-500 active:text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="Próximo depoimento"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Navegação de depoimentos">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={currentIndex === idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    currentIndex === idx ? 'w-8 bg-sky-500' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Ir para depoimento ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="duvidas" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1221] mb-4">
                Dúvidas Frequentes
              </h2>
              <p className="text-lg text-slate-600">
                Tudo o que você precisa saber sobre o Salário Maternidade.
              </p>
            </motion.div>
          </div>

          <div className="space-y-4">
            {faqData.map((item, idx) => (
              <FAQItem key={idx} question={item.q} answer={item.a} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-6">Ainda tem alguma dúvida específica sobre o seu caso?</p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#128C7E] transition-all hover:scale-105"
            >
              <WhatsAppIcon size={20} />
              Tirar dúvidas no WhatsApp
            </button>
          </div>
        </div>
      </section>

      </main>
      {/* Footer */}
      <footer className="bg-[#0B1221] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-2xl">
                  <img 
                    src="https://iili.io/qgliKP9.jpg" 
                    alt="" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-xl font-bold uppercase tracking-tight">SALÁRIO MATERNIDADE</span>
              </div>
              <p className="text-slate-300 max-w-sm mb-8">
                Dr. Friedrich França | OAB/PI Nº 16.220 e OAB/MA Nº 22356-A. Advogado Especialista em Direito Previdenciário com mais de 10 anos de experiência na obtenção de Salário Maternidade para mães de todo o Brasil.
              </p>
              <nav className="flex gap-4" aria-label="Redes sociais e contato">
                <a 
                  href="https://instagram.com/friedrichfranca.adv" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                  aria-label="Siga-nos no Instagram"
                >
                  <Instagram size={18} aria-hidden="true" />
                </a>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                  aria-label="Fale conosco no WhatsApp"
                >
                  <WhatsAppIcon size={18} aria-hidden="true" />
                </button>
              </nav>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-sky-400">Contato</h4>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-sky-400" aria-hidden="true" />
                  <span>(86) 98136-2434</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-sky-400" aria-hidden="true" />
                  <span className="text-sm">friedrichfrancaadvocacia@gmail.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Instagram size={18} className="text-sky-400" aria-hidden="true" />
                  <a 
                    href="https://www.instagram.com/friedrichfranca.adv/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-sky-400 transition-colors"
                  >
                    @friedrichfranca.adv
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-sky-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-slate-300">Av Homero Castelo Branco, 1956, Sala 01, Horto, Teresina-PI, CEP: 64052-445</span>
                </li>
              </ul>
            </div>


          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            <p>© 2026 Dr. Friedrich França | OAB/PI Nº 16.220 e OAB/MA Nº 22356-A. Especialista em Salário Maternidade. Todos os direitos reservados. <br /><span className="text-[10px] opacity-50 uppercase tracking-widest">Última atualização: Março de 2026</span></p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button 
        onClick={() => {
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Contact', { method: 'WhatsApp', content_name: 'Floating Button' });
          }
          setIsChatOpen(true);
        }}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center gap-2 group focus:outline-none focus:ring-4 focus:ring-green-500/50"
        aria-label="Abrir chat do WhatsApp"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          Online agora
        </span>
        <WhatsAppIcon size={32} aria-hidden="true" />
      </button>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-50 bg-white/80 backdrop-blur-sm text-slate-600 p-4 rounded-full shadow-lg hover:bg-sky-500 hover:text-white transition-all active:scale-95 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
        aria-label="Voltar ao topo da página"
      >
        <ArrowUp size={24} aria-hidden="true" />
      </motion.button>

      {/* Custom ChatBot */}
      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        whatsappLink={whatsappLink} 
      />
    </div>
  );
}
