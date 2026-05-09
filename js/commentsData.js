export let comments = [];

export function setComments(newComments) {
  comments.length = 0;
  comments.push(...newComments);
}
