let formState = {
  name: "",
  text: "",
};

export function saveFormState() {
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");

  if (nameInput) {
    formState.name = nameInput.value;
  }
  if (textInput) {
    formState.text = textInput.value;
  }
}

export function restoreFormState() {
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");

  if (nameInput) {
    nameInput.value = formState.name;
  }
  if (textInput) {
    textInput.value = formState.text;
  }
}

export function clearFormState() {
  formState.name = "";
  formState.text = "";

  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");

  if (nameInput) {
    nameInput.value = "";
  }
  if (textInput) {
    textInput.value = "";
  }
}

export function getFormState() {
  return { ...formState };
}
