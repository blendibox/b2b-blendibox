import Link from "next/link";

import Menu from "./Menu";
import Footer from "./Footer";

export default function NotFound() {
  return (
    <>
      <Menu />

      <main className="not-found-page">
        <div className="not-found-content">
          <span className="not-found-label">
            erro 404
          </span>

          <h1 className="not-found-title">
            Página não encontrada
          </h1>

          <p className="not-found-description">
            A página que você tentou acessar
            não existe ou foi movida.
          </p>

          <Link
            href="/"
            className="not-found-button"
          >
            Voltar para o início
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}