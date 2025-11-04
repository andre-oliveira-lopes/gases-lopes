# Meu App Electron

Este projeto é uma aplicação desktop criada com Electron, utilizando tecnologias web (HTML, CSS, JavaScript).

## Funcionalidades

- Janela principal com tamanho mínimo definido
- Ícone personalizado
- Prevenção de múltiplas instâncias
- Exibição da janela apenas quando estiver pronta

## Estrutura

GASES-LOPES/
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── main.css.map
│   ├── icons/
│   │   ├── buscar-icone.svg
│   │   ├── dashboard-icone.svg
│   │   ├── fornecedor-icones.svg
│   │   ├── google-icone.svg
│   │   ├── info-icones.svg
│   │   ├── inicio.svg
│   │   ├── nota-de-emprestimo.svg
│   │   ├── nota-de-entrega-icone.svg
│   │   ├── pedidos-especiais-icone.svg
│   │   └── tabela-de-preco-icone.svg
│   ├── images/
│   │   ├── feminina-com-oculos.png
│   │   └── my-face.png
│   ├── js/
│   │   ├── api/
│   │   │   └── pedidos.js
│   │   └── utils/
│   │   |   ├── formatters.js
│   │   |   ├── validators.js
│   │   ├── navigation.js
│   │   └── topbar.js
│   └── scss/
│   |   ├── abstracts/
│   |   │   ├── _mixins.scss
│   |   │   └── _variables.scss
│   |   ├── base/
│   |   │   ├── _reset.scss
│   |   │   └── _typography.scss
│   |   ├── components/
│   |   │   ├── _buttons.scss
│   |   │   └── _cards.scss
│   |   ├── layout/
│   |   │   ├── _base.scss
│   |   │   ├── _footer.scss
│   |   │   ├── _header.scss
│   |   │   ├── _sidebar.scss
│   |   │   └── _topbar.scss
│   |   ├── pages/
│   |   │   ├── _home.scss
│   |   │   ├── _pedidos-especiais.scss
│   |   │   ├── _tabela-precos.scss
│   |   │   ├── _fornecedor.scss
│   |   │   ├── _dados-cilindros.scss
│   |   │   ├── _dashboard.scss
│   |   │   ├── _nota-emprestimo.scss
│   |   │   ├── _nota-entrega.scss
│   |   │   └── _buscar.scss
│   |   └── main.scss
│	└── oxygen.ico
|
├── data/
│   └── gases-uniao.db
│
├── database/
│   ├── migrations/
│   |    └── init.js
│   ├── models/
│   │   ├── fornecedores.js
│   │   └── pedidos.js
│   ├── query-SQL/
│   │   └── Select_teste.sql
│   └── db.js
│
├── dist/
│   ├── gases-uniao-1.0-win32-x64/
│   └── gases-uniao-1.1-win32-x64/
│
├── node_modules/
│
├── pages/
│   ├── _template-page.html
│   ├── buscar.html
│   ├── dados-cilindros.html
│   ├── dashboard.html
│   ├── fornecedor.html
│   ├── nota-emprestimo.html
│   ├── nota-entrega.html
│   ├── pedidos-especiais.html
│   └── tabela-precos.html
│
├── pages_config/
│   ├── aparencia-content.html
│   ├── conta-content.html
│   ├── notificacoes-content.html
│   └── sobre-content.html  
│
├── .gitignore
├── index.html
├── main.js
├── Notas.txt
├── package.json
├── package-lock.json
└── README.md

## Instalação

1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie o app:
   ```
   npm start
   ```

## Empacotamento para distribuição

Para gerar o executável do app:

1. Instale o Electron Packager:
   ```
   npm install --save-dev electron-packager
   ```
2. Execute o comando:
   ```
   npx electron-packager . gases-lopes --platform=win32 --arch=x64 --icon=assets/oxygen.ico --out=dist --overwrite
   ```

## Contribuição

Sinta-se à vontade para sugerir melhorias ou abrir issues!

## Licença

Este projeto está sob a licença ISC.
