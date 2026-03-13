import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function Docs() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'sw-tw-override';
    style.textContent = `
      .swagger-ui .topbar { display: none !important; }
      .swagger-ui { font-family: 'Inter', sans-serif !important; }
      .swagger-ui .info .title { font-weight: 800 !important; font-size: 1.3rem !important; }
      .swagger-ui .scheme-container { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
      .swagger-ui section.models { display: none !important; }
    `;
    document.head.appendChild(style);
    return () => document.getElementById('sw-tw-override')?.remove();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">API Docs</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Documentação interativa de todas as rotas.{' '}
          <a
            href="http://localhost:3001/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 dark:text-zinc-300 underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Abrir Swagger nativo ↗
          </a>
        </p>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 p-6 overflow-hidden">
        <SwaggerUI url="http://localhost:3001/api/openapi.json" docExpansion="list" />
      </div>
    </div>
  );
}
