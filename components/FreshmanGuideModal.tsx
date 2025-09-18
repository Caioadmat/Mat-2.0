import React, { useState } from 'react';
import { XIcon, AcademicCapIcon, ChatBubbleIcon, StarIcon, BriefcaseIcon } from './Icon';

interface AccordionItemProps {
  title: string;
  // FIX: Explicitly type the icon prop to accept a className.
  // This helps TypeScript understand that React.cloneElement can add a className.
  icon: React.ReactElement<{ className?: string }>;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="flex items-center space-x-3">
            {React.cloneElement(icon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400"})}
            <span>{title}</span>
          </span>
          <svg
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </h2>
      <div className={`p-5 border-t-0 border-gray-200 dark:border-gray-700 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="prose prose-blue dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export const FreshmanGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-2 sm:p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AcademicCapIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Guia do Calouro
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-gray-900/50">
            <p className="mb-6 text-gray-600 dark:text-gray-400">
                Seja bem-vindo(a) ao curso de Engenharia de Materiais na UFPB! 🎉 Este guia foi preparado pelo CAEMAT para te ajudar nos primeiros passos.
            </p>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <AccordionItem title="Primeiros Passos" icon={<StarIcon />}>
                    <p>Aqui estão algumas tarefas importantes para começar com o pé direito:</p>
                    <ul>
                        <li><strong>Ative seu e-mail institucional:</strong> Você o usará para tudo na UFPB. Geralmente o acesso é liberado junto com o SIGAA.</li>
                        <li><strong>Explore o SIGAA:</strong> Este é o sistema acadêmico onde você fará sua matrícula, verá suas notas e pegará declarações. É essencial dominá-lo! <a href="https://sigaa.ufpb.br/sigaa/public/home.jsf" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-medium">Acesse o SIGAA aqui</a>.</li>
                        <li><strong>Auxílios e Bolsas (PRAPE):</strong> A Pró-Reitoria de Assistência e Promoção ao Estudante (PRAPE) é o órgão que cuida dos auxílios para os estudantes (moradia, alimentação/RU, transporte, etc.). Fique sempre de olho nos editais publicados no site deles para não perder os prazos! <a href="https://www.prape.ufpb.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-medium">Acesse o site da PRAPE</a>.</li>
                    </ul>
                </AccordionItem>
                <AccordionItem title="Conhecendo o Curso" icon={<AcademicCapIcon />}>
                    <p>A Engenharia de Materiais é um curso fascinante que estuda metais, polímeros, cerâmicas e compósitos. Para entender a ordem das disciplinas, pré-requisitos e o caminho para se formar, a melhor ferramenta é o <strong>fluxograma interativo</strong> (botão no topo da tela).</p>
                    <p>Links importantes sobre o curso:</p>
                    <ul>
                        <li><strong>Portal do Curso no SIGAA:</strong> Consulte o PPC, ementas das disciplinas e corpo docente. <a href="https://sigaa.ufpb.br/sigaa/public/curso/portal.jsf?lc=pt_BR&id=1626809" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-medium">Ver Portal do Curso</a>.</li>
                        <li><strong>Site do DEMAT:</strong> Informações sobre estágio, TCC, laboratórios e contatos do departamento. <a href="http://www.ct.ufpb.br/demat" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-medium">Acessar site do DEMAT</a>.</li>
                    </ul>
                </AccordionItem>
                 <AccordionItem title="Contatos Essenciais" icon={<ChatBubbleIcon />}>
                    <p>Manter-se conectado é fundamental! Aqui estão os canais mais importantes:</p>
                    <ul>
                        <li><strong>Grupo Geral do WhatsApp:</strong> O melhor lugar para tirar dúvidas rápidas com veteranos e colegas. <a href="https://chat.whatsapp.com/IoEhJ15LwCEK8UTWtRNViG" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-medium">Clique aqui para entrar!</a></li>
                        <li><strong>CAEMAT (Centro Acadêmico):</strong> Nós representamos os estudantes! Siga-nos no Instagram <a href="https://www.instagram.com/caemat.ufpb" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-medium">@caemat.ufpb</a> ou mande um e-mail para <a href="mailto:caematufpb1@gmail.com" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-medium">caematufpb1@gmail.com</a>.</li>
                        <li><strong>Coordenação do Curso:</strong> Para assuntos oficiais como quebra de pré-requisito, matrículas especiais, etc., use o <a href="https://atendimento.ct.ufpb.br/index.php?a=add&catid=24" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-medium">Portal de Atendimento do CT</a>. É o canal mais rápido e formal.</li>
                    </ul>
                </AccordionItem>
                <AccordionItem title="Dicas do Mat" icon={<BriefcaseIcon />}>
                    <p>Alguns conselhos para você aproveitar ao máximo a universidade:</p>
                    <ul>
                        <li><strong>Participe de projetos:</strong> Fique de olho em oportunidades de Iniciação Científica (IC), extensão e empresas juniores. Elas enriquecem muito o currículo e a experiência.</li>
                        <li><strong>Não tenha medo de perguntar:</strong> Seja aos professores, veteranos ou aqui para mim, tirar dúvidas é o melhor jeito de aprender.</li>
                        <li><strong>Organize seu tempo:</strong> O curso é exigente. Use uma agenda ou aplicativo para organizar seus estudos e não deixar a matéria acumular.</li>
                        <li><strong>Cuide da sua saúde mental:</strong> A universidade pode ser desafiadora. A UFPB oferece apoio psicológico através da PRAPE. Não hesite em procurar ajuda se precisar.</li>
                    </ul>
                </AccordionItem>
            </div>
        </main>
      </div>
    </div>
  );
};