import { comments } from "./commentsData.js";
import { getCurrentDateTime } from "./utils.js";
import { renderComments } from "./render.js";

const nameInput = document.querySelector(".add-form-name");
const textInput = document.querySelector(".add-form-text");
const addButton = document.querySelector(".add-form-button");

export function handleCommentClick(event) {
  if (
    event.target.classList.contains("like-button") ||
    event.target.classList.contains("likes-counter") ||
    event.target.closest(".likes")
  ) {
    return;
  }

  const commentElement = event.currentTarget;
  const index = commentElement.dataset.index;
  const comment = comments[index];

  const quotedText = `> ${comment.text.replaceAll("\n", "\n> ")}`;

  if (!nameInput.value.trim()) {
    nameInput.value = comment.name;
  }

  if (textInput.value.trim()) {
    textInput.value = textInput.value + "\n\n" + quotedText;
  } else {
    textInput.value = quotedText;
  }

  textInput.focus();

  console.log("Цитируется комментарий:", comment);
}

export function handleLikeClick(event) {
  event.stopPropagation();

  const button = event.currentTarget;
  const index = button.dataset.index;

  if (comments[index].isLiked) {
    comments[index].isLiked = false;
    comments[index].likes -= 1;
  } else {
    comments[index].isLiked = true;
    comments[index].likes += 1;
  }

  renderComments();

  console.log("Лайк обновлен:", comments[index]);
}

export function initAddButtonHandler() {
  addButton.addEventListener("click", () => {
    const rawName = nameInput.value.trim();
    const rawText = textInput.value.trim();

    if (!rawName || !rawText) {
      alert("Пожалуйста, заполните имя и комментарий");
      return;
    }

    comments.push({
      name: rawName,
      date: getCurrentDateTime(),
      text: rawText,
      likes: 0,
      isLiked: false,
    });

    nameInput.value = "";
    textInput.value = "";

    renderComments();

    console.log("Новый комментарий добавлен");
  });
}

export function initInputHandlers() {
  nameInput.addEventListener("input", () => {
    console.log("Имя изменено:", nameInput.value);
  });

  textInput.addEventListener("input", () => {
    console.log("Текст комментария изменен:", textInput.value);
  });
}
