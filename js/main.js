import { renderComments } from './render.js';
import { initAddButtonHandler, initInputHandlers, loadCommentsFromApi } from './eventHandlers.js';

initAddButtonHandler();
initInputHandlers();

loadCommentsFromApi();

console.log("It works!");