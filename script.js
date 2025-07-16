const form = document.getElementById("form");

const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");

const aiResponse = document.getElementById("aiResponse");

const submitForm = (event) => {
  envet.preventDefault();
};

form.addEventListener("submit", submitForm);
