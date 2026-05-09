import { comments, setComments } from "./commentsData.js";
import {
  renderComments,
  showError,
  showLoading,
  renderAddForm,
  setFormSending,
  clearAddForm,
} from "./render.js";
import {
  addComment,
  transformComment,
  fetchComments,
  isAuthenticated,
  toggleLike,
} from "./api.js";

let isSending = false;

export function handleLikeClick(event) {
  event.stopPropagation();

  const button = event.currentTarget;
  const commentId = button.dataset.id;

  toggleLike(commentId)
    .then((result) => {
      const comment = comments.find((c) => c.id === commentId);
      if (comment) {
        comment.likes = result.likes;
        comment.isLiked = result.isLiked;
        renderComments();
      }
    })
    .catch((error) => {
      console.error("Ошибка при лайке:", error);

      if (error.type === "auth") {
        alert("Необходимо авторизоваться, чтобы ставить лайки");
        const showLoginEvent = new CustomEvent("showLogin");
        document.dispatchEvent(showLoginEvent);
      } else {
        alert("Не удалось поставить лайк. Попробуйте позже.");
      }
    });
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
          "Нет соединения с интернетом. Пожалуйста, проверьте связь.";
      }

      showError(errorMessage);
    });
}

export function initAddCommentHandler() {
  document.addEventListener("addComment", (event) => {
    if (isSending) {
      return;
    }

    if (!isAuthenticated()) {
      alert("Необходима авторизация");
      return;
    }

    const text = event.detail.text;

    if (!text) {
      alert("Пожалуйста, введите комментарий");
      return;
    }

    if (text.length < 3) {
      alert("Текст комментария должен содержать хотя бы 3 символа");
      return;
    }

    isSending = true;
    setFormSending(true);

    addComment(text)
      .then(() => {
        clearAddForm();
        return loadCommentsFromApi();
      })
      .then(() => {
        renderAddForm();
      })
      .catch((error) => {
        console.error("Ошибка при добавлении комментария:", error);

        if (error.type === "auth") {
          alert("Сессия истекла. Пожалуйста, войдите заново.");
          const showLoginEvent = new CustomEvent("showLogin");
          document.dispatchEvent(showLoginEvent);
        } else if (error.type === "validation") {
          alert(error.message);
        } else if (error.type === "server") {
          alert(
            `${error.message}\n\nВаш комментарий не был отправлен. Попробуйте позже.`,
          );
        } else {
          alert(`Ошибка при отправке комментария. Попробуйте позже.`);
        }
      })
      .finally(() => {
        isSending = false;
        setFormSending(false);
      });
  });
}

export function initShowLoginHandler() {
  document.addEventListener("showLogin", () => {
    import("./auth.js").then((module) => {
      module.renderLoginPage();
    });
  });
}
