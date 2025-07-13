document.addEventListener('DOMContentLoaded', () => {
  const containerChat = document.getElementById('chatContainer');
  const formularioChat = document.getElementById('chatForm');
  const entradaMensagem = document.getElementById('messageInput');
  const entradaImagem = document.getElementById('imageInput');
  const botaoRemoverImagem = document.getElementById('removeImageBtn');
  const botaoEnviar = document.getElementById('sendButton');
  const botaoLimparChat = document.getElementById('clearChatBtn');

  let mensagens = [];
  let imagemAtual = null;

  // Atualiza a interface com base nas mensagens
  function atualizarInterface() {
    // Mostra/esconde o botão de limpar
    botaoLimparChat.classList.toggle('hidden', mensagens.length === 0);

    // Limpa o container de chat
    containerChat.innerHTML = '';

    if (mensagens.length === 0) {
      // Mostra estado vazio
      const estadoVazio = document.createElement('div');
      estadoVazio.className = 'flex flex-col items-center justify-center h-full text-gray-500';
      estadoVazio.innerHTML = `
        <i class="far fa-comment-alt text-4xl mb-4"></i>
        <p>Envie uma mensagem para começar a conversa</p>
      `;
      containerChat.appendChild(estadoVazio);
      return;
    }

    // Renderiza as mensagens
    mensagens.forEach((msg, index) => {
      const divMensagem = document.createElement('div');
      divMensagem.className = `flex ${msg.remetente === 'usuario' ? 'justify-end' : 'justify-start'}`;

      const divConteudo = document.createElement('div');
      divConteudo.className = `max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
        msg.remetente === 'usuario'
          ? 'bg-purple-700 text-white'
          : 'bg-white text-gray-800 shadow'
      }`;

      if (msg.imagem) {
        const containerImagem = document.createElement('div');
        containerImagem.className = 'mb-2 relative';
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(msg.imagem);
        img.alt = 'Enviada pelo usuário';
        img.className = 'max-w-full h-auto rounded';
        containerImagem.appendChild(img);
        divConteudo.appendChild(containerImagem);
      }

      const texto = document.createElement('p');
      texto.className = 'whitespace-pre-wrap';
      texto.textContent = msg.texto;
      divConteudo.appendChild(texto);

      divMensagem.appendChild(divConteudo);
      containerChat.appendChild(divMensagem);
    });

    // Rolagem para o final
    containerChat.scrollTop = containerChat.scrollHeight;
  }

  // Mostra indicador de carregamento
  function mostrarCarregando() {
    const divCarregando = document.createElement('div');
    divCarregando.className = 'flex justify-start';

    const divConteudo = document.createElement('div');
    divConteudo.className = 'bg-white text-gray-800 shadow rounded-lg p-3 max-w-xs';

    const divPontos = document.createElement('div');
    divPontos.className = 'message-loading';
    divPontos.innerHTML = `
      <div></div>
      <div></div>
      <div></div>
    `;

    divConteudo.appendChild(divPontos);
    divCarregando.appendChild(divConteudo);
    containerChat.appendChild(divCarregando);

    // Rolagem para o final
    containerChat.scrollTop = containerChat.scrollHeight;
  }

  // Converte arquivo para base64
  function arquivoParaBase64(arquivo) {
    return new Promise((resolve) => {
      const leitor = new FileReader();
      leitor.onloadend = () => {
        const stringBase64 = leitor.result.split(',')[1];
        resolve(stringBase64);
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  // Manipula seleção de imagem
  entradaImagem.addEventListener('change', (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      if (arquivo.size > 5 * 1024 * 1024) {
        alert('A imagem é muito grande. Por favor, selecione uma imagem menor que 5MB.');
        return;
      }
      imagemAtual = arquivo;
      botaoRemoverImagem.classList.remove('hidden');
    }
  });

  // Manipula remoção de imagem
  botaoRemoverImagem.addEventListener('click', () => {
    imagemAtual = null;
    entradaImagem.value = '';
    botaoRemoverImagem.classList.add('hidden');
  });

  // Manipula envio do formulário
  formularioChat.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const textoMensagem = entradaMensagem.value.trim();
    if (!textoMensagem && !imagemAtual) return;

    // Desabilita botão de enviar
    botaoEnviar.disabled = true;

    // Adiciona mensagem do usuário
    const mensagemUsuario = {
      texto: textoMensagem,
      remetente: 'usuario',
      imagem: imagemAtual
    };
    mensagens.push(mensagemUsuario);
    atualizarInterface();

    // Mostra carregamento
    mostrarCarregando();

    try {
      console.log("Usando chave:", API_KEY);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
      let dadosRequisicao = {};
      
      if (imagemAtual) {
        const imagemBase64 = await arquivoParaBase64(imagemAtual);
        
        dadosRequisicao = {
          contents: [{
            parts: [
              { text: textoMensagem || "Descreva esta imagem" },
              {
                inlineData: {
                  mimeType: imagemAtual.type,
                  data: imagemBase64
                }
              }
            ]
          }]
        };
      } else {
        dadosRequisicao = {
          contents: [{
            parts: [
              { text: textoMensagem }
            ]
          }]
        };
      }
      
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosRequisicao)
      });
      
      const dados = await resposta.json();
      
      const respostaBot = dados.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "Não foi possível obter uma resposta.";
      
      // Adiciona mensagem do bot
      mensagens.push({
        texto: respostaBot,
        remetente: 'bot'
      });
    } catch (erro) {
      console.error('Erro:', erro);
      mensagens.push({
        texto: "Ocorreu um erro ao processar sua mensagem.",
        remetente: 'bot'
      });
    } finally {
      // Limpa inputs
      entradaMensagem.value = '';
      imagemAtual = null;
      entradaImagem.value = '';
      botaoRemoverImagem.classList.add('hidden');
      
      // Atualiza interface
      atualizarInterface();
      
      // Reabilita botão de enviar
      botaoEnviar.disabled = false;
    }
  });

  // Manipula limpeza do chat
  botaoLimparChat.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar a conversa?')) {
      mensagens = [];
      atualizarInterface();
    }
  });

  // Habilita/desabilita botão de enviar baseado no input
  entradaMensagem.addEventListener('input', () => {
    botaoEnviar.disabled = !entradaMensagem.value.trim() && !imagemAtual;
  });
});