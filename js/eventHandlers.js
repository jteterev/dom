import { comments, setComments } from "./commentsData.js";
import {
  renderComments,
  showError,
  showLoading,
  showSendingLoader,
  hideSendingLoader,
} from "./render.js";
import { addComment, transformComment, fetchComments } from "./api.js";
import {
  saveFormState,
  clearFormState,
  restoreFormState,
} from "./formState.js";

const nameInput = document.querySelector(".add-form-name");
const textInput = document.querySelector(".add-form-text");
const addButton = document.querySelector(".add-form-button");

let isSending = false;

export function initFormTracking() {
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      saveFormState();
    });
  }

  if (textInput) {
    textInput.addEventListener("input", () => {
      saveFormState();
    });
  }
}

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

  if (comment) {
    const quotedText = `> ${comment.text.replaceAll("\n", "\n> ")}`;

    if (!nameInput.value.trim()) {
      nameInput.value = comment.name;
    }

    if (textInput.value.trim()) {
      textInput.value = textInput.value + "\n\n" + quotedText;
    } else {
      textInput.value = quotedText;
    }

    saveFormState();
    textInput.focus();
  }
}

export function handleLikeClick(event) {
  event.stopPropagation();

  const button = event.currentTarget;
  const commentId = button.dataset.id;
  const comment = comments.find((c) => c.id == commentId);

  if (comment) {
    if (comment.isLiked) {
      comment.isLiked = false;
      comment.likes -= 1;
    } else {
      comment.isLiked = true;
      comment.likes += 1;
    }
    renderComments();
  }
}

export function loadCommentsFromApi() {
  showLoading();

  return fetchComments()
    .then((apiComments) => {
      const transformedComments = apiComments.map(transformComment);
      setComments(transformedComments);
      renderComments();
    })
    .catch((error) => {
      console.error("Ошибка загрузки:", error);
      let errorMessage = error.message || "Неизвестная ошибка";

      if (errorMessage.includes("интернет") || errorMessage.includes("связь")) {
        errorMessage =
          "Нет соединения с интернетом. Пожалуйста, проверьте связь и обновите страницу.";
      } else if (errorMessage.includes("500")) {
        errorMessage = "Сервер временно недоступен. Попробуйте позже.";
      }

      showError(errorMessage);
    });
}

export function initAddButtonHandler() {
  if (addButton) {
    addButton.addEventListener("click", () => {
      if (isSending) {
        return;
      }

      const rawName = nameInput.value.trim();
      const rawText = textInput.value.trim();

      if (!rawName || !rawText) {
        alert("Пожалуйста, заполните имя и комментарий");
        return;
      }

      if (rawName.length < 3) {
        alert("Имя должно содержать хотя бы 3 символа");
        return;
      }

      if (rawText.length < 3) {
        alert("Текст комментария должен содержать хотя бы 3 символа");
        return;
      }

      isSending = true;
      saveFormState();
      showSendingLoader();

      addComment(rawName, rawText)
        .then(() => {
          clearFormState();
          return loadCommentsFromApi();
        })
        .then(() => {
          hideSendingLoader();
          isSending = false;
        })
        .catch((error) => {
          console.error("Ошибка при добавлении комментария:", error);
          hideSendingLoader();
          restoreFormState();
          isSending = false;

          if (error.type === "validation") {
            alert(error.message);
          } else if (error.type === "server") {
            alert(
              `${error.message}\n\nВаш комментарий не был отправлен. Попробуйте позже.`,
            );
          } else if (error.type === "network") {
            alert(
              `${error.message}\n\nВаш комментарий сохранен в форме. Попробуйте отправить снова.`,
            );
          } else {
            alert(`Ошибка при отправке комментария. Попробуйте позже.`);
          }
        });
    });
  }
}

export function initEventHandlers() {
  initFormTracking();
  initAddButtonHandler();
}
