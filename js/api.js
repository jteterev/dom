const PERSONAL_KEY = "evgenii-teterev"; // Замените на свои имя и фамилию
const BASE_URL = `https://wedev-api.sky.pro/api/v1/${PERSONAL_KEY}/comments`;

export async function fetchComments() {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const data = await response.json();
    return data.comments;
  } catch (error) {
    console.error("Ошибка при загрузке комментариев:", error);
    throw error;
  }
}

export async function addComment(name, text) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        text: text,
      }),
    });

    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ошибка валидации");
    }

    if (!response.ok) {
      throw new Error(`Ошибка отправки: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
    throw error;
  }
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
