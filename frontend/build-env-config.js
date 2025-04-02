#!/usr/bin/env node

/**
 * Script para substituir os placeholders nas configurações com variáveis de ambiente durante o build
 * 
 * Este script deve ser executado antes do build para injetar variáveis de ambiente
 * nos arquivos de configuração do ambiente.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Valores padrão para ambiente de produção (caso não estejam definidos)
const defaults = {
  ANGULAR_APP_API_URL: 'https://kanban-deploy-fmfj.onrender.com',
  FIREBASE_API_KEY: '',
  FIREBASE_AUTH_DOMAIN: '',
  FIREBASE_PROJECT_ID: '',
  FIREBASE_STORAGE_BUCKET: '',
  FIREBASE_MESSAGING_SENDER_ID: '',
  FIREBASE_APP_ID: '',
  FIREBASE_MEASUREMENT_ID: ''
};

// Template do arquivo environment.prod.ts
const prodTemplate = `export const environment = {
  production: true,
  useEmulators: false,
  apiUrl: '\${ANGULAR_APP_API_URL}/api',
  graphqlUrl: '\${ANGULAR_APP_API_URL}/graphql',
  firebase: {
    // Estes valores serão substituídos durante o build através de variáveis de ambiente
    apiKey: "\${FIREBASE_API_KEY}",
    authDomain: "\${FIREBASE_AUTH_DOMAIN}",
    projectId: "\${FIREBASE_PROJECT_ID}",
    storageBucket: "\${FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "\${FIREBASE_MESSAGING_SENDER_ID}",
    appId: "\${FIREBASE_APP_ID}",
    measurementId: "\${FIREBASE_MEASUREMENT_ID}"
  }
};`;

// Função para substituir as variáveis de ambiente nos arquivos
function replaceEnvVars(filePath, destinationPath) {
  try {
    console.log(`Processando arquivo: ${filePath}`);
    
    // Verificar se o arquivo existe
    let content;
    if (!fs.existsSync(filePath)) {
      console.log(`Arquivo não encontrado: ${filePath}`);
      console.log('Criando arquivo a partir do template...');
      
      // Se for o arquivo de produção e não existir, use o template
      if (filePath.includes('environment.prod.ts')) {
        content = prodTemplate;
      } else {
        // Para outros arquivos, use o environment.ts como base
        const baseEnvPath = path.join(path.dirname(filePath), 'environment.ts');
        if (fs.existsSync(baseEnvPath)) {
          content = fs.readFileSync(baseEnvPath, 'utf8');
        } else {
          throw new Error(`Não foi possível encontrar um arquivo base para criar ${filePath}`);
        }
      }
    } else {
      // Ler o arquivo existente
      content = fs.readFileSync(filePath, 'utf8');
    }
    
    // Substituir todas as variáveis de ambiente
    content = content.replace(/\${([^}]+)}/g, (match, envVarName) => {
      const envValue = process.env[envVarName] || defaults[envVarName];
      if (!envValue && envValue !== '') {
        console.warn(`Aviso: Variável de ambiente '${envVarName}' não encontrada!`);
        return '""'; // Valor vazio se a variável não existir
      }
      return `"${envValue}"`;
    });
    
    // Criar diretório de destino se não existir
    const destDir = path.dirname(destinationPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Escrever o arquivo com as variáveis substituídas
    fs.writeFileSync(destinationPath, content, 'utf8');
    console.log(`Arquivo gerado com sucesso: ${destinationPath}`);
  } catch (error) {
    console.error(`Erro ao processar arquivo ${filePath}:`, error);
    process.exit(1);
  }
}

// Configurar caminhos
const environmentDir = path.join(__dirname, 'src', 'environments');
const isProd = process.env.NODE_ENV === 'production';

// Criar o diretório de ambientes se não existir
if (!fs.existsSync(environmentDir)) {
  fs.mkdirSync(environmentDir, { recursive: true });
}

// Determinar qual arquivo de ambiente usar
const sourceFile = isProd 
  ? path.join(environmentDir, 'environment.prod.ts')
  : path.join(environmentDir, 'environment.ts');

// Nome do arquivo de saída
const outputFile = path.join(environmentDir, isProd ? 'environment.prod.ts' : 'environment.local.ts');

// Processar o arquivo
replaceEnvVars(sourceFile, outputFile);

console.log('Configuração de ambiente concluída!'); 