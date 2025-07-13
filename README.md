# 🤖 PROJETO FINAL — INTELIGÊNCIA ARTIFICIAL

**📘 Disciplina:** Inteligência Artificial  
**👨‍🏫 Professor:** Otílio Paulo  
**🏫 Instituto:** IFPI — Instituto Federal do Piauí  
**🗂️ Status:** Concluído • 100%  
**🛠️ Tecnologias Utilizadas:** Python, HTML, Tailwind CSS, JavaScript, API Google Gemini

---

## 🔀 Estrutura do Projeto

O projeto foi dividido em duas etapas distintas, explorando diferentes aplicações de IA:

### 📌 Etapa 1 — Treinamento com Imagens de Arroz

- **Objetivo:** Desenvolver e treinar uma rede neural para classificar imagens de grãos de arroz inteiros e quebrados, utilizando técnicas de visão computacional e aprendizado supervisionado.  
- **Dados:** Imagens fornecidas pelo professor para treinamento.  
- **Resultado:** Modelo com acurácia superior a 90%, demonstrando eficácia na identificação dos padrões visuais.

### 💬 Etapa 2 — Desenvolvimento do Chatbot (API Gemini)

- Criação de um chatbot inteligente, usando a API Gemini do Google, integrado a uma interface web interativa para conversas em tempo real com IA generativa.  
- **Destaques:**  
  - Interface web desenvolvida com HTML e Tailwind CSS  
  - Comunicação assíncrona via JavaScript  
  - Integração com a API usando chave pessoal  

---

## 🚀 Como Executar o Projeto (Etapa 2)

### 🗝️ Passos para obter a chave API do Google Gemini

1. Acesse [AI Studio](https://aistudio.google.com/)  
2. Faça login com sua conta Google  
3. Crie um novo projeto  
4. No menu lateral, vá em **"Get API key"**  
5. Clique em **"Create API key"**  
6. Copie a chave gerada

### 📝 Configuração da chave no projeto

Edite o arquivo `docs/key-api.js` substituindo a linha:

```js
const API_KEY = "COLE_SUA_CHAVE_REAL_AQUI"; // Substitua pela sua chave da API do Google Gemini.
