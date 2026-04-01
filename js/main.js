import { renderComments } from "./render.js";
import { initAddButtonHandler, initInputHandlers } from "./eventHandlers.js";

initAddButtonHandler();
initInputHandlers();

renderComments();

console.log("It works!");
