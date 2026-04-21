import { renderComments } from "./render.js";
import { initEventHandlers, loadCommentsFromApi } from "./eventHandlers.js";
import { restoreFormState } from "./formState.js";

initEventHandlers();

loadCommentsFromApi().then(() => {
  restoreFormState();
});

console.log("It works!");
