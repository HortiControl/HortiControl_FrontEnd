import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
 
  test: {
    // Simula um navegador (window, document, eventos) dentro do Node.
    // Necessário para renderizar componentes React e usar window.dispatchEvent.
    environment: 'jsdom',
 
    // Permite usar describe/it/expect sem importar (importamos mesmo assim
    // nos testes para ficar explícito, mas o RTL depende disso para o cleanup).
    globals: true,
 
    // Arquivo executado antes de cada arquivo de teste.
    setupFiles: './src/setupTests.js',
 
    // Não processa CSS nos testes (mais rápido, e não afeta o comportamento).
    css: false,
 
    // Variáveis de ambiente só para os testes.
    // O api.js lança erro se VITE_API_URL não existir, então definimos aqui.
    env: {
      VITE_API_URL: 'http://localhost:8080',
    },
 
    coverage: {
      // v8 = motor nativo do Node, sem necessidade de instrumentar o código.
      provider: 'v8',
 
      // text = tabela no terminal | html = relatório navegável em coverage/index.html
      reporter: ['text', 'html'],
 
      // Somente estes arquivos entram no cálculo da porcentagem.
      // (Padrões glob: ** = qualquer subpasta, *.js = qualquer arquivo .js)
      include: [
        'src/utils/**/*.js',
        'src/services/**/*.js',
        'src/provider/api.js',
        'src/context/AuthContext.jsx',
        'src/components/Login/LoginCard.jsx',
        'src/components/Login/CampoAuthComIcone.jsx',
      ],
 
      // Se a cobertura ficar abaixo destes valores (%), o comando
      // "npm run test:coverage" falha
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
  },
})