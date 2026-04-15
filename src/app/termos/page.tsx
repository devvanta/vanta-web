import { Container } from "@/components/ui/container";
import { Shield } from "lucide-react";

export default function TermosPage() {
  return (
    <Container size="sm" className="py-16 md:py-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
          <Shield size={18} />
        </div>
        <span className="kicker">legal</span>
      </div>

      <h1 className="text-4xl md:text-5xl leading-tight mb-6">
        Termos de Uso
      </h1>
      <p className="text-text-muted text-sm mb-10">
        Última atualização: abril de 2026
      </p>

      <div className="prose-vanta space-y-8 text-text-secondary text-sm leading-relaxed">
        <section>
          <h2 className="text-lg text-text-primary mb-3">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou utilizar a plataforma VANTA (&quot;Plataforma&quot;), operada por
            VANTA Tecnologia (&quot;VANTA&quot;, &quot;nós&quot;), você concorda com estes Termos de Uso.
            Se não concordar, não utilize a Plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">2. Descrição do Serviço</h2>
          <p>
            A VANTA é uma plataforma de descoberta, compra de ingressos e
            relacionamento para eventos e vida noturna. Oferecemos ferramentas
            para usuários finais (descoberta, checkout, wallet, social) e para
            operadores de casas e produtores de eventos (painel administrativo RBAC).
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">3. Cadastro e Conta</h2>
          <p>
            Para utilizar funcionalidades protegidas, você deve criar uma conta
            com informações verdadeiras. Você é responsável por manter a
            confidencialidade das suas credenciais. A idade mínima para uso é
            de 16 anos.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">4. Ingressos e Pagamentos</h2>
          <p>
            A compra de ingressos é processada via Stripe. O ingresso é pessoal
            e intransferível fora da funcionalidade de transferência do app.
            Em caso de cancelamento do evento pelo organizador, o reembolso
            integral será processado em até 7 dias úteis.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">5. Programa Mais Vanta</h2>
          <p>
            O Mais Vanta é um programa de benefícios por aplicação ou convite.
            A participação é um benefício concedido, não um direito. Benefícios
            variam por evento e casa parceira. O descumprimento de obrigações
            pode resultar em suspensão do programa.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">6. Conduta do Usuário</h2>
          <p>
            O usuário se compromete a não utilizar a Plataforma para fins
            ilícitos, não compartilhar credenciais, não fazer engenharia reversa,
            não capturar tela do QR de ingresso e não violar direitos de
            terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">7. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo da Plataforma (marca, design, código, textos) é
            propriedade da VANTA ou licenciado por terceiros. O uso não
            autorizado é proibido.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">8. Limitação de Responsabilidade</h2>
          <p>
            A VANTA não se responsabiliza por eventos cancelados, alterações de
            programação ou situações fora do nosso controle nos estabelecimentos
            parceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">9. Alterações</h2>
          <p>
            Estes termos podem ser atualizados a qualquer momento. O uso
            continuado da Plataforma após alterações constitui aceite dos novos
            termos. Notificaremos mudanças relevantes por e-mail ou notificação
            no app.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-text-primary mb-3">10. Contato</h2>
          <p>
            Dúvidas sobre estes termos podem ser enviadas para{" "}
            <a href="mailto:contato@maisvanta.com" className="text-gold hover-real:underline">
              contato@maisvanta.com
            </a>.
          </p>
        </section>
      </div>
    </Container>
  );
}
