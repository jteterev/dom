import { comments } from "./commentsData.js";
import { escapeHtml } from "./utils.js";
import { handleLikeClick } from "./eventHandlers.js";
import { isAuthenticated, user } from "./api.js";

export function showLoading() {
  const commentsList = document.querySelector(".comments-list");
  if (commentsList) {
    commentsList.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">Загрузка комментариев...</div>
      </div>
    `;
  }
}

export function showError(message) {
  const commentsList = document.querySelector(".comments-list");
  if (commentsList) {
    commentsList.innerHTML = `<div class="error">❌ ${escapeHtml(message)}</div>`;
  }
}

export function renderComments() {
  const commentsList = document.querySelector(".comments-list");

  if (!commentsList) return;

  if (!comments || comments.length === 0) {
    commentsList.innerHTML =
      '<div class="empty">Нет комментариев. Будьте первым!</div>';
    return;
  }

  let commentsHtml = "";

  comments.forEach((comment) => {
    const escapedName = escapeHtml(comment.name);
    const escapedText = escapeHtml(comment.text);

    const likeButtonClass = comment.isLiked
      ? "like-button -active-like"
      : "like-button";

    commentsHtml += `
      <li class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div>${escapedName}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${escapedText}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="${likeButtonClass}" data-id="${comment.id}"></button>
          </div>
        </div>
      </li>
    `;
  });

  commentsList.innerHTML = commentsHtml;

  document.querySelectorAll(".like-button").forEach((button) => {
    button.removeEventListener("click", handleLikeClick);
    button.addEventListener("click", handleLikeClick);
  });
}

export function renderAddForm() {
  const addFormContainer = document.querySelector(".add-form-container");

  if (!addFormContainer) return;

  if (isAuthenticated() && user) {
    addFormContainer.innerHTML = `
      <div class="add-form">
        <input
          type="text"
          class="add-form-name"
          value="${escapeHtml(user.name)}"
          readonly
          disabled
        />
        <textarea
          class="add-form-text"
          placeholder="Введите ваш комментарий"
          rows="4"
        ></textarea>
        <div class="add-form-row">
          <button class="add-form-button">Написать</button>
        </div>
      </div>
    `;

    const addButton = document.querySelector(".add-form-button");
    const textInput = document.querySelector(".add-form-text");

    if (addButton && textInput) {
      const newButton = addButton.cloneNode(true);
      addButton.parentNode.replaceChild(newButton, addButton);

      newButton.addEventListener("click", () => {
        const event = new CustomEvent("addComment", {
          detail: { text: textInput.value.trim() },
        });
        document.dispatchEvent(event);
      });
    }
  } else {
    addFormContainer.innerHTML = `
      <div class="add-form auth-required">
        <p class="auth-message">
          🔒 <a href="#" id="login-link">Чтобы добавить комментарий, авторизуйтесь</a>
        </p>
      </div>
    `;

    const loginLink = document.getElementById("login-link");
    if (loginLink) {
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        const event = new CustomEvent("showLogin");
        document.dispatchEvent(event);
      });
    }
  }
}

export function setFormSending(isSending) {
  const addButton = document.querySelector(".add-form-button");
  const textInput = document.querySelector(".add-form-text");

  if (addButton) {
    if (isSending) {
      addButton.disabled = true;
      addButton.textContent = "Отправка...";
    } else {
      addButton.disabled = false;
      addButton.textContent = "Написать";
    }
  }

  if (textInput) {
    textInput.disabled = isSending;
  }
}

export function clearAddForm() {
  const textInput = document.querySelector(".add-form-text");
  if (textInput) {
    textInput.value = "";
  }
}
