import { VERSAO_PRIVACIDADE } from "@/lib/termos";

export const metadata = { title: "Privacidade" };

export default function Privacidade() {
  return (
    <article className="max-w-2xl space-y-6 leading-relaxed">
      <p className="rounded-xl border border-destaque/50 bg-destaque/10 px-4 py-3 text-sm">
        Rascunho em linguagem simples, aguardando revisão de um advogado especializado em LGPD. Versão {VERSAO_PRIVACIDADE}.
      </p>
      <h1 className="text-3xl font-semibold">Política de privacidade</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">O que guardamos</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Adulto:</strong> nome, e-mail, senha (só a versão embaralhada, nunca a senha) e o aceite destes termos.</li>
          <li><strong>Criança e adolescente:</strong> só apelido, avatar, faixa de idade e progresso no app. Não pedimos e-mail, data de nascimento nem foto do rosto.</li>
          <li><strong>Aceites:</strong> qual texto foi aceito, a versão, a data e uma versão embaralhada do endereço de internet.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Crianças e adolescentes</h2>
        <p>
          A conta de quem tem menos de 18 anos só existe se um adulto responsável a criar e autorizar o uso dos dados, como
          pede o artigo 14 da LGPD. O responsável vê, baixa e apaga tudo pela página da conta.
        </p>
        <p>
          Quando o mapa chegar, os pontos marcados por menores serão guardados só por região de cerca de 10 km, nunca o local
          exato. Fotos enviadas ao “Que bicho é esse?” serão analisadas e apagadas logo depois da resposta.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">O que não fazemos</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Não mostramos anúncios.</li>
          <li>Não usamos rastreadores de terceiros nem vendemos dados.</li>
          <li>Não criamos perfil público.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Seus direitos</h2>
        <p>
          Na página da conta, o responsável baixa todos os dados da família e apaga a conta de todos. Apagar remove contas,
          perfis, aceites e sessões na hora.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Onde os dados ficam</h2>
        <p>Num servidor no Brasil contratado pelo Bio no Bolso, com cópia de segurança diária.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Quem responde</h2>
        <p>Controlador e encarregado de dados: a definir antes do lançamento.</p>
      </section>
    </article>
  );
}
