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
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

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

export default function App() {
  const whatsappLink = "https://wa.me/5586981362434"; // Friedrich França WhatsApp

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-slate-100">
              <img 
                src="https://friedrichfranca.adv.br/wp-content/uploads/2025/08/a2ac3587-23a0-4de2-98d5-58355aed931e.jpg" 
                alt="Friedrich França Logo" 
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#0B1221] leading-none">FRIEDRICH FRANÇA</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-sky-600 font-semibold">Advocacia Especializada</span>
            </div>
          </div>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#0B1221] hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <WhatsAppIcon size={18} />
            Falar com Especialista
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden bg-[#0B1221]">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeIn} className="text-left">
              <span className="inline-block px-4 py-1.5 bg-sky-500/10 text-sky-400 rounded-full text-sm font-semibold tracking-wide mb-6 border border-sky-500/20">
                Direito Garantido por Lei
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-8">
                Descubra agora se você tem direito ao <span className="text-sky-400">Auxílio Maternidade</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
                Muitas mães perdem o benefício por falta de informação. Verifique seu direito em poucos minutos com nossa equipe especializada.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a 
                  href={whatsappLink}
                  className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-sky-500/20 hover:-translate-y-1"
                >
                  Verificar meu direito agora
                  <ArrowRight size={20} />
                </a>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-sky-400" />
                  Consulta 100% segura e sigilosa
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                <img 
                  src="https://lh3.googleusercontent.com/p/AF1QipORkNhkpOq2UWEmKp1ZFHu5dHSlv4PeZj4n8iSN=w223-h279-n-k-no-nu" 
                  alt="Dr. Friedrich França" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-sky-500 text-white p-8 rounded-2xl shadow-xl">
                <p className="text-3xl font-bold mb-1">10+ Anos</p>
                <p className="text-sm opacity-90">De experiência jurídica</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="https://picsum.photos/seed/mother-baby/800/1000" 
                  alt="Maternidade e Direitos" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1221] mb-8 leading-tight">
                Você pode ter direito ao benefício se:
              </h2>
              <ul className="space-y-5 mb-10">
                {[
                  "Está grávida ou teve bebê recentemente",
                  "Já contribuiu para o INSS em algum momento",
                  "Trabalhou como MEI ou de forma informal",
                  "Mora e trabalha na zona rural",
                  "Está desempregada há menos de 3 anos"
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
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
                href={whatsappLink}
                className="inline-flex items-center gap-2 text-sky-600 font-bold text-lg hover:underline decoration-2 underline-offset-8"
              >
                CLIQUE AQUI E VERIFIQUE SEU DIREITO
                <ArrowRight size={20} />
              </a>
            </div>
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
          <Clock className="mx-auto mb-6 text-sky-400" size={48} />
          <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-wider">
            Importante: Existe um prazo para solicitar o auxílio maternidade
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Muitas mães acabam perdendo o benefício porque não sabem que existe um prazo para fazer a solicitação. Se o pedido não for feito dentro do período correto, o benefício pode não ser concedido.
          </p>
          <a 
            href={whatsappLink}
            className="inline-block bg-sky-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-sky-600 transition-colors shadow-lg"
          >
            Quero saber agora se tenho direito
          </a>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1221] mb-4">Como funciona a análise</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Processo simples, rápido e totalmente digital para sua comodidade.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <WhatsAppIcon size={32} />,
                title: "Atendimento via WhatsApp",
                desc: "Você clica no botão e fala diretamente com nossos especialistas de forma rápida."
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "Análise Técnica",
                desc: "Verificamos se você tem direito e regularizamos sua situação no INSS para você receber."
              },
              {
                icon: <Users size={32} />,
                title: "Acompanhamento Total",
                desc: "Nossa equipe acompanha todo o processo até que o benefício caia na sua conta."
              }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-white text-sky-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0B1221] mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a 
              href={whatsappLink}
              className="inline-flex items-center gap-3 bg-[#0B1221] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              RECEBA SEU ATENDIMENTO AGORA
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-8 text-[#0B1221]">Sobre o Dr. Friedrich França</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Advogado há mais de 10 anos, inscrito na OAB/PI nº 16.220 e OAB/MA nº 22.356-A, atuo com dedicação e excelência na defesa dos direitos dos meus clientes.
              </p>
              <p className="text-lg text-slate-600 mb-12 leading-relaxed">
                Com sede em Teresina/PI, presto atendimento presencial e online para todo o território nacional, garantindo que mães de todo o Brasil tenham acesso ao Salário Maternidade de forma segura e estratégica.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 text-left">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-2">Atendimento</p>
                  <p className="text-slate-700">100% Online para todo o Brasil</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-2">Registro</p>
                  <p className="text-slate-700">Sociedade de Advogados Registrada na OAB</p>
                </div>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://lh3.googleusercontent.com/p/AF1QipPSr-G9hzsY_EsDMfzH_SxW56DXZ-PtnfC2jt7b=w223-h279-n-k-no-nu" 
                  alt="Dr. Friedrich França" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1221] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-slate-100">
                  <img 
                    src="https://friedrichfranca.adv.br/wp-content/uploads/2025/08/a2ac3587-23a0-4de2-98d5-58355aed931e.jpg" 
                    alt="Friedrich França Logo" 
                    className="w-full h-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-bold uppercase tracking-tight">Friedrich França</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-8">
                Especialista em Direito Previdenciário e Defesa do Consumidor. Mais de 10 anos de experiência garantindo seus direitos.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/friedrichfranca.adv" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors"
                  title="Instagram"
                >
                  <Heart size={18} />
                </a>
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors"
                  title="WhatsApp"
                >
                  <WhatsAppIcon size={18} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-sky-400">Contato</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-sky-400" />
                  <span>(86) 98136-2434</span>
                </li>
                <li className="flex items-center gap-3">
                  <WhatsAppIcon size={18} className="text-sky-400" />
                  <span className="text-sm">friedrichfrancaadvocacia@gmail.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-sky-400 shrink-0" />
                  <span className="text-sm">Av. Homero Castelo Branco, 1956, Sala 01, Horto, Teresina-PI</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-sky-400">Jurídico</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                OAB/PI nº 16.220 | OAB/MA nº 22.356-A<br />
                Av. Homero Castelo Branco, 1956, Sala 01<br />
                Horto, Teresina-PI | CEP: 64052-445
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>© 2026 Friedrich França Advocacia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center gap-2 group"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          Falar com Advogado
        </span>
        <WhatsAppIcon size={32} />
      </a>
    </div>
  );
}
