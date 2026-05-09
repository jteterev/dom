import { loginUser } from "./api.js";
import { renderApp } from "./main.js";

export function renderLoginPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <h2>Вход</h2>
        <form id="login-form">
          <input type="text" id="login" placeholder="Логин" required>
          <input type="password" id="password" placeholder="Пароль" required>
          <button type="submit">Войти</button>
        </form>
        <div id="login-error" class="hidden error-message"></div>
      </div>
    </div>
  `;

  const form = document.getElementById("login-form");
  const errorDiv = document.getElementById("login-error");

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorDiv.classList.add("hidden");
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      await loginUser(login, password);
      renderApp(); // перенаправление на страницу с комментариями
    } catch (err) {
      errorDiv.textContent = err.message || "Ошибка входа";
      errorDiv.classList.remove("hidden");
    }
  };
}
