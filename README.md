# Kanban Board - Deploy

Este repositório contém as configurações necessárias para fazer o deploy do frontend do Kanban Board na Netlify.

## Configuração do Deploy

1. Clone o repositório principal: https://github.com/RonaldoChiavegatti/kanban-graphql
2. Copie a pasta `frontend` para este repositório
3. Configure as variáveis de ambiente no Netlify:
   - `ANGULAR_APP_API_URL`: URL do backend (https://kanban-deploy-fmfj.onrender.com)

## Build e Deploy

O Netlify irá automaticamente:
1. Instalar as dependências (`npm install`)
2. Fazer o build do Angular (`ng build --configuration production`)
3. Publicar os arquivos da pasta `dist/kanban-board`

## Redirecionamentos

Todas as rotas são redirecionadas para o `index.html` para suportar o roteamento do Angular. 