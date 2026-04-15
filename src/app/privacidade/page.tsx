import { Container } from "@/components/ui/container";
import { Lock } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <Container size="sm" className="py-16 md:py-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
          <Lock size={18} />
        </div>
        <span className="kicker">legal</span>
      </div>

      <h1 className="text-4xl md:text-5xl leading-tight mb-6">
        Política de Privacidade
      </h1>
      <p className="text-text-muted text-sm mb-10">
        Última atualização: abril de 2026
      </p>

      <div className="prose-vanta space-y-8 text-text-secondary text-sm leading-relaxed">
        <section>
          <h2 className="text-lg text-text-primary mb-3">
            1. Dados que Coletamos
          </h2>
          <p>
            Coletamos os dados que você nos fornece diretamente: nome, e-mail,
            data de nascimento, cidade, Instagram, CPF (quando necessário para
            compra de ingresso) e foto de perfil. Também coletamos dados de uso
            como páginas visitadas, eventos visualizados e localização
            aproximada (quando autorizada).
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            2. Base Legal (LGPD — Lei nº 13.709/2018)
          </h2>
          <p>
            O tratamento dos seus dados pessoais é realizado com base no
            consentimento explícito do titular (Art. 7º, I) e na execução de
            contrato (Art. 7º, V) para processamento de compras e entregas de
            ingressos.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            3. Finalidade do Uso
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Criação e manutenção da sua conta</li>
            <li>Processamento de compras e emissão de ingressos</li>
            <li>Personalização de recomendações de eventos</li>
            <li>Comunicação sobre eventos, lembretes e notificações</li>
            <li>Gestão do programa Mais Vanta</li>
            <li>Análise agregada para melhoria da plataforma</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            4. Compartilhamento
          </h2>
          <p>
            Seus dados podem ser compartilhados com: casas e produtores de
            eventos (apenas o necessário para operação do evento — nome e
            ingresso), processadores de pagamento (Stripe), e prestadores de
            serviços técnicos (Supabase, Vercel, Firebase). Nunca vendemos seus
            dados.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            5. Armazenamento e Segurança
          </h2>
          <p>
            Seus dados são armazenados em servidores seguros (Supabase, região
            São Paulo). Utilizamos criptografia em trânsito (TLS), hash
            PBKDF2-SHA256 para PINs de wallet, Row Level Security (RLS) no
            banco de dados e autenticação em duas camadas.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            6. Seus Direitos (Art. 18, LGPD)
          </h2>
          <p>Você pode, a qualquer momento:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Solicitar anonimização, bloqueio ou eliminação</li>
            <li>Solicitar portabilidade dos dados</li>
            <li>Revogar o consentimento</li>
            <li>Solicitar exclusão da conta</li>
          </ul>
          <p className="mt-3">
            Para exercer qualquer direito, entre em contato pelo e-mail abaixo.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            7. Cookies e Rastreamento
          </h2>
          <p>
            Utilizamos cookies essenciais para autenticação e sessão. Não
            utilizamos cookies de rastreamento de terceiros para publicidade.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            8. Retenção de Dados
          </h2>
          <p>
            Seus dados são mantidos enquanto sua conta estiver ativa. Após
            exclusão da conta, dados são anonimizados em até 30 dias, exceto
            quando a retenção for necessária por obrigação legal (registros
            fiscais de compras).
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            9. Alterações
          </h2>
          <p>
            Esta política pode ser atualizada. Notificaremos mudanças
            relevantes por e-mail ou notificação no app.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">
            10. Contato e DPO
          </h2>
          <p>
            Para questões sobre privacidade e proteção de dados:{" "}
            <a
              href="mailto:privacidade@maisvanta.com"
              className="text-gold hover-real:underline"
            >
              privacidade@maisvanta.com
            </a>
          </p>
        </section>
      </div>
    </Container>
  );
}
