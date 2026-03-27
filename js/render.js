import { comments } from "./commentsData.js";
import { escapeHtml } from "./utils.js";
import { handleLikeClick, handleCommentClick } from "./eventHandlers.js";

export function renderComments() {
  const commentsList = document.querySelector(".comments");
  let commentsHtml = "";

  comments.forEach((comment, index) => {
    const escapedName = escapeHtml(comment.name);
    const escapedText = escapeHtml(comment.text);

    const likeButtonClass = comment.isLiked
      ? "like-button -active-like"
      : "like-button";

    commentsHtml += `
      <li class="comment" data-index="${index}">
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
            <button class="${likeButtonClass}" data-index="${index}"></button>
          </div>
        </div>
      </li>
    `;
  });

  commentsList.innerHTML = commentsHtml;

  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", handleLikeClick);
  });

  document.querySelectorAll(".comment").forEach((comment) => {
    comment.addEventListener("click", handleCommentClick);
  });
}
