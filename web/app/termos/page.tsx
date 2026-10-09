import { VERSAO_TERMOS } from "@/lib/termos";

export const metadata = { title: "Termos de uso" };

export default function Termos() {
  return (
    <article className="max-w-2xl space-y-6 leading-relaxed">
      <p className="rounded-xl border border-destaque/50 bg-destaque/10 px-4 py-3 text-sm">
        Rascunho em linguagem simples, aguardando revisão jurídica. Versão {VERSAO_TERMOS}.
      </p>
      <h1 className="text-3xl font-semibold">Termos de uso</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">O que é o Bio no Bolso</h2>
        <p>Uma enciclopédia interativa da natureza para famílias e escolas, com fichas, bichos em 3D e, em breve, identificação por foto e mapa de observações.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contas</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Só adultos (18 anos ou mais) criam conta com e-mail.</li>
          <li>O adulto que cria a conta da família é responsável pelas contas de crianças e adolescentes que adicionar.</li>
          <li>Guarde a senha e os PINs. Não compartilhe a senha de adulto com crianças.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Conteúdo e segurança</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>As fichas são educativas e são revisadas por especialista antes da versão paga.</li>
          <li>A identificação por foto pode errar. Nunca toque em um animal por causa de uma resposta do app.</li>
          <li>Fotos e sons de terceiros aparecem com autor e licença.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Planos e pagamento</h2>
        <p>Hoje o uso é gratuito. Quando a cobrança começar, os preços e as regras de cancelamento serão publicados aqui antes, e ninguém será cobrado sem contratar um plano.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Encerramento</h2>
        <p>Você pode apagar a conta a qualquer momento na página da conta. Podemos suspender contas usadas para abuso, sempre com aviso ao responsável.</p>
      </section>
    </article>
  );
}
