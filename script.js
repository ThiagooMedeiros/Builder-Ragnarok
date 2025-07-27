const form = document.getElementById("form");

const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");

const aiResponse = document.getElementById("aiResponse");

const markdownToHTML = (text) => {
  const converter = new showdown.Converter();

  return converter.makeHtml(text);
};

const askAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash";
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const pergunta = ` 
    ## Especialidade
    - Você é um especialista assistente de meta para o jogo ${game}.  

    ## Tarefa
    - Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds e dicas.

    ## Regras 
    - Se você não sabe a resposta, responda com "Não sei" e não tente inventar uma resposta.
    - Considere a data atual para a sua resposta ${new Date().toLocaleDateString()}.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza que existe no patch atual.
    - Se a pergunta não está relacionada ao jogo responda com "Essa pergunta não está relacionada ao jogo".

    ## Resposta 
    - Economize na resposta, seja direto.
    - Responda em markdown.
    - Não faça nenhuma saudação ou despedida na sua resposta, apenas responda a pergunta feita.

    ---
    Aqui está a pergunta do usuário: ${question}.
  `;

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: pergunta,
        },
      ],
    },
  ];

  const tools = [
    {
      google_search: {},
    },
  ];
  //chamada

  const response = await fetch(geminiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      tools,
    }),
  });

  const data = await response.json();

  return data.candidates[0].content.parts[0].text;
};

const submitForm = async (event) => {
  event.preventDefault();

  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apiKey == "" || game == "" || question == "") {
    alert("Preencha todos os campos");
    return;
  }

  askButton.disabled = true;
  askButton.textContent = "Perguntando...";
  askButton.classList.add("loading");

  try {
    // perguntar para ia
    const text = await askAI(question, game, apiKey);

    aiResponse.querySelector(".response-content").innerHTML =
      markdownToHTML(text);

    aiResponse.classList.remove("hidden");
  } catch (error) {
    console.log("Erro: ", error);
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Perguntar";
    askButton.classList.remove("loading");
  }
};

form.addEventListener("submit", submitForm);
