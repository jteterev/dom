import { comments, setComments } from "./commentsData.js";
import { renderComments, renderAddForm, showError } from "./render.js";
import {
  initAddCommentHandler,
  initShowLoginHandler,
} from "./eventHandlers.js";
import { fetchComments, transformComment, loadAuthFromStorage } from "./api.js";

export async function renderApp() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="container">
      <ul class="comments comments-list"></ul>
      <div class="add-form-container"></div>
    </div>
  `;

  initAddCommentHandler();
  initShowLoginHandler();
  await loadComments();
  renderAddForm();
}

async function loadComments() {
  const container = document.querySelector(".comments-list");
  if (container) {
    container.innerHTML = `<div class="loading"><div class="loading-spinner"></div><div>Загрузка...</div></div>`;
  }

  try {
    const apiComments = await fetchComments();
    const transformed = apiComments.map(transformComment);
    setComments(transformed);
    renderComments();
  } catch (err) {
    console.error(err);
    showError(
      "Не удалось загрузить комментарии. Проверьте соединение или personal-key.",
    );
  }
}

function init() {
  loadAuthFromStorage();
  renderApp();
}

init();
