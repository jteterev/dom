import { comments } from "./commentsData.js";
import { escapeHtml } from "./utils.js";
import { handleLikeClick, handleCommentClick } from "./eventHandlers.js";

export function showLoading() {
  const commentsList = document.querySelector(".comments");
  if (commentsList) {
    commentsList.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">Загрузка комментариев...</div>
      </div>
    `;
  }
}

export function showSendingLoader() {
  const addButton = document.querySelector(".add-form-button");
  if (addButton) {
    addButton.textContent = "Отправка...";
    addButton.disabled = true;
  }
}

export function hideSendingLoader() {
  const addButton = document.querySelector(".add-form-button");
  if (addButton) {
    addButton.textContent = "Написать";
    addButton.disabled = false;
  }
}

export function showError(message) {
  const commentsList = document.querySelector(".comments");
  if (commentsList) {
    commentsList.innerHTML = `<div class="error">❌ ${escapeHtml(message)}</div>`;
  }
}

export function renderComments() {
  const commentsList = document.querySelector(".comments");

  if (!commentsList) return;

  if (!comments || comments.length === 0) {
    commentsList.innerHTML =
      '<div class="empty">Нет комментариев. Будьте первым!</div>';
    return;
  }

  let commentsHtml = "";

  comments.forEach((comment, index) => {
    const escapedName = escapeHtml(comment.name);
    const escapedText = escapeHtml(comment.text);

    const likeButtonClass = comment.isLiked
      ? "like-button -active-like"
      : "like-button";

    commentsHtml += `
      <li class="comment" data-id="${comment.id}" data-index="${index}">
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

  document.querySelectorAll(".comment").forEach((comment) => {
    comment.removeEventListener("click", handleCommentClick);
    comment.addEventListener("click", handleCommentClick);
  });
}
