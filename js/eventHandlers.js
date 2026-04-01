import { comments, setComments, addCommentToStore } from "./commentsData.js";
import { renderComments, showError, showLoading } from "./render.js";
import { addComment, transformComment, fetchComments } from "./api.js";

const nameInput = document.querySelector(".add-form-name");
const textInput = document.querySelector(".add-form-text");
const addButton = document.querySelector(".add-form-button");
const addForm = document.querySelector(".add-form");

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

    textInput.focus();
    console.log("Цитируется комментарий:", comment);
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
    console.log("Лайк обновлен локально:", comment);
  }
}

function setFormDisabled(disabled) {
  if (nameInput) nameInput.disabled = disabled;
  if (textInput) textInput.disabled = disabled;
  if (addButton) addButton.disabled = disabled;

  if (disabled) {
    addForm?.classList.add("form-disabled");
  } else {
    addForm?.classList.remove("form-disabled");
  }
}

export async function loadCommentsFromApi() {
  try {
    showLoading();
    const apiComments = await fetchComments();
    const transformedComments = apiComments.map(transformComment);
    setComments(transformedComments);
    renderComments();
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    showError(
      "Не удалось загрузить комментарии. Проверьте соединение с интернетом.",
    );
  }
}

export function initAddButtonHandler() {
  if (addButton) {
    addButton.addEventListener("click", async () => {
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

      try {
        setFormDisabled(true);

        await addComment(rawName, rawText);

        nameInput.value = "";
        textInput.value = "";

        await loadCommentsFromApi();
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);

        if (error.message.includes("3 символа")) {
          alert(error.message);
        } else if (error.message.includes("500")) {
          alert("Сервер временно недоступен. Попробуйте позже.");
        } else {
          alert("Ошибка при отправке комментария. Попробуйте позже.");
        }
      } finally {
        setFormDisabled(false);
      }
    });
  }
}

export function initInputHandlers() {
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      console.log("Имя изменено:", nameInput.value);
    });
  }

  if (textInput) {
    textInput.addEventListener("input", () => {
      console.log("Текст комментария изменен:", textInput.value);
    });
  }
}
