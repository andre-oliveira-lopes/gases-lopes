# Meu App Electron

Este projeto é uma aplicação desktop criada com Electron, utilizando tecnologias web (HTML, CSS, JavaScript).

## Funcionalidades

- Janela principal com tamanho mínimo definido
- Ícone personalizado
- Prevenção de múltiplas instâncias
- Exibição da janela apenas quando estiver pronta

## Estrutura

```
gases-lopes/
├── assets/
│   └── oxygen.ico
├── index.html
├── main.js
├── package.json
```

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
