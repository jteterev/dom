const PERSONAL_KEY = "evgenii-teterev";
const BASE_URL = `https://wedev-api.sky.pro/api/v2/${PERSONAL_KEY}`;

export let token = null;
export let user = null;

export function setAuthData(authToken, userData) {
  token = authToken;
  user = userData;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function loadAuthFromStorage() {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  if (savedToken && savedUser) {
    token = savedToken;
    user = JSON.parse(savedUser);
    return true;
  }
  return false;
}

export function clearAuthData() {
  token = null;
  user = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return token !== null;
}

function getHeaders() {
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export function fetchComments() {
  console.log("Загрузка комментариев...");

  return fetch(`${BASE_URL}/comments`, {
    headers: getHeaders(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.comments || [];
    })
    .catch((error) => {
      console.error("Ошибка при загрузке комментариев:", error);
      throw error;
    });
}

export function addComment(text) {
  if (!token) {
    return Promise.reject({ type: "auth", message: "Необходима авторизация" });
  }

  return fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ text }),
  }).then((response) => {
    if (response.status === 400) {
      return response.json().then((errorData) => {
        throw {
          type: "validation",
          message: errorData.error || "Ошибка валидации",
        };
      });
    }
    if (response.status === 401) {
      clearAuthData();
      throw { type: "auth", message: "Сессия истекла. Войдите заново." };
    }
    if (response.status === 500) {
      throw {
        type: "server",
        message: "Сервер временно недоступен. Попробуйте позже.",
      };
    }
    if (!response.ok) {
      throw { type: "unknown", message: `Ошибка отправки: ${response.status}` };
    }
    return response.json();
  });
}

export function toggleLike(commentId) {
  if (!token) {
    return Promise.reject({ type: "auth", message: "Необходима авторизация" });
  }

  return fetch(`${BASE_URL}/comments/${commentId}/toggle-like`, {
    method: "POST",
    headers: getHeaders(),
  })
    .then((response) => {
      if (response.status === 401) {
        clearAuthData();
        throw { type: "auth", message: "Сессия истекла. Войдите заново." };
      }
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => data.result);
}

export function loginUser(login, password) {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    headers: {},
    body: JSON.stringify({ login, password }),
  })
    .then((response) => {
      if (response.status === 400 || response.status === 401) {
        return response.json().then((errorData) => {
          throw {
            type: "auth",
            message: errorData.error || "Неверный логин или пароль",
          };
        });
      }
      if (!response.ok) {
        throw { type: "unknown", message: `Ошибка входа: ${response.status}` };
      }
      return response.json();
    })
    .then((data) => {
      setAuthData(data.user.token, data.user);
      return data.user;
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
