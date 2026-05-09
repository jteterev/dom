const PERSONAL_KEY = "evgenii-teterev";
const BASE_URL = `https://wedev-api.sky.pro/api/v1/${PERSONAL_KEY}/comments`;

export function fetchComments() {
  return fetch(BASE_URL)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("Сервер временно недоступен. Попробуйте позже.");
        }
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => data.comments)
    .catch((error) => {
      if (
        error.message.includes("fetch") ||
        error.message.includes("network")
      ) {
        throw new Error("Проблема с интернет-соединением. Проверьте связь.");
      }
      throw error;
    });
}

export function addComment(name, text, forceError = true) {
  const body = {
    name: name,
    text: text,
  };

  if (forceError) {
    body.forceError = true;
  }

  return fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status === 400) {
        return response.json().then((errorData) => {
          throw {
            type: "validation",
            message: errorData.error || "Ошибка валидации",
          };
        });
      }
      if (response.status === 500) {
        throw {
          type: "server",
          message: "Сервер временно недоступен. Попробуйте позже.",
        };
      }
      if (!response.ok) {
        throw {
          type: "unknown",
          message: `Ошибка отправки: ${response.status}`,
        };
      }
      return response.json();
    })
    .catch((error) => {
      if (
        error.message &&
        (error.message.includes("fetch") || error.message.includes("network"))
      ) {
        throw {
          type: "network",
          message: "Проблема с интернет-соединением. Проверьте связь.",
        };
      }
      throw error;
    });
}

export function transformComment(apiComment) {
  const date = new Date(apiComment.date);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getFullYear()).slice(2)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return {
    id: apiComment.id,
    name: apiComment.author.name,
    date: formattedDate,
    text: apiComment.text,
    likes: apiComment.likes,
    isLiked: apiComment.isLiked || false,
  };
}
