import "/style.css";

const loginArea = document.getElementById("loginArea");
const loginText = document.getElementById("loginText");
const inputLoginPassword = document.getElementById("inputLoginPassword");
const loginButton = document.getElementById("loginButton");

const appContainer = document.getElementById("appContainer");
const btnAdd = document.getElementById("btnAdd");
const sectionStores = document.getElementById("sectionStores");
const sectionCategories = document.getElementById("sectionCategories");
const sectionSignatures = document.getElementById("sectionSignatures");
const selectOptions = document.getElementById("selectOptions");
const inputAddText = document.getElementById("inputAddText");

const modalRemoveConfirmation = document.getElementById(
  "modalRemoveConfirmation"
);
const removeMessage = document.getElementById("removeMessage");
const btnCancelRemoving = document.getElementById("btnCancelRemoving");
const btnConfirmRemoving = document.getElementById("btnConfirmRemoving");
const modalOverlay = document.getElementById("modalOverlay");

const modalEdit = document.getElementById("modalEdit");
const inputModalEditText = document.getElementById("inputModalEditText");
const btnCancelEditing = document.getElementById("btnCancelEditing");
const btnConfirmEditing = document.getElementById("btnConfirmEditing");
const inputModalEditDate = document.getElementById("inputModalEditDate");

loginButton.addEventListener("click", submitApiKey);
inputLoginPassword.addEventListener("keyup", submitApiKey);
btnCancelRemoving.addEventListener("click", hideRemoveModal);
btnConfirmRemoving.addEventListener("click", removeItem);
btnAdd.addEventListener("click", addItem);
btnCancelEditing.addEventListener("click", hideEditModal);
btnConfirmEditing.addEventListener("click", editSignature);

selectOptions.addEventListener("change", changeOption);
inputAddText.addEventListener("keyup", changeAddText);
inputAddText.addEventListener("focusin", changeAddText);
inputAddText.addEventListener("focusout", changeAddTextSize);

const urlDomain = "http://localhost:3000";

let apiKeyConfig,
  selectedItem = {},
  currentSignatures;

function startUp() {
  if (window.screen.height < 800) {
    inputModalEditText.rows = 10;
  }
  hideRemoveModal();
  hideEditModal();
  listStores();
}

function submitApiKey(e) {
  if (
    (e &&
      e.key &&
      (e.key == "Enter" || e.keyCode == 13) &&
      inputLoginPassword.value) ||
    e.target.id == "loginButton"
  ) {
    apiKeyConfig = inputLoginPassword.value;
    listStores();
  }
}

function showLogin(show) {
  if (show) {
    loginArea.classList.remove("hidden");
    appContainer.classList.add("hidden");
    inputLoginPassword.focus();
  } else {
    loginArea.classList.add("hidden");
    appContainer.classList.remove("hidden");
  }
}

function changeOption(e) {
  switch (e.target.selectedIndex) {
    case 0:
      sectionStores.classList.remove("hidden");
      sectionCategories.classList.add("hidden");
      sectionSignatures.classList.add("hidden");
      inputAddText.maxLength = 50;
      inputAddText.rows = 1;
      currentSignatures = null;
      listStores();
      break;
    case 1:
      sectionStores.classList.add("hidden");
      sectionCategories.classList.remove("hidden");
      sectionSignatures.classList.add("hidden");
      inputAddText.maxLength = 50;
      inputAddText.rows = 1;
      currentSignatures = null;
      listCategories();
      break;
    case 2:
      sectionStores.classList.add("hidden");
      sectionCategories.classList.add("hidden");
      sectionSignatures.classList.remove("hidden");
      inputAddText.maxLength = 500;
      inputAddText.rows = 1;
      listSignatures();
      break;
  }
}

function changeAddText(e) {
  if (e.target.value) {
    btnAdd.disabled = false;
  } else {
    btnAdd.disabled = true;
    inputAddText.rows = 1;
  }
  if (inputAddText.focus && selectOptions.selectedIndex == 2) {
    inputAddText.rows = 10;
  }
}

function changeAddTextSize() {
  if (!inputAddText.value) {
    inputAddText.rows = 1;
  }
}

function listStores() {
  if (!apiKeyConfig) {
    showLogin(true);
    return;
  }

  fetch(`${urlDomain}/stores?apiKeyConfig=${apiKeyConfig}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        if (data.length > 0) {
          createList(JSON.parse(data), sectionStores);
        } else {
          // createListEmpty();
        }
      }
    })
    .catch(function (err) {
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
    });
}

function listCategories() {
  if (!apiKeyConfig) {
    showLogin(true);
    return;
  }

  fetch(`${urlDomain}/categories?apiKeyConfig=${apiKeyConfig}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        if (data.length > 0) {
          createList(JSON.parse(data), sectionCategories);
        } else {
          // createListEmpty();
        }
      }
    })
    .catch(function (err) {
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
    });
}

function listSignatures() {
  if (!apiKeyConfig) {
    showLogin(true);
    return;
  }
  inputAddText.rows = 1;
  inputAddText.value = null;
  fetch(`${urlDomain}/signatures?apiKeyConfig=${apiKeyConfig}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        if (data.length > 0) {
          const dataObj = JSON.parse(data);
          createList(dataObj, sectionSignatures);
          currentSignatures = JSON.parse(data).map((signature) => {
            return { id: signature.id, date: signature.date };
          });
        } else {
          // createListEmpty();
        }
      }
    })
    .catch(function (err) {
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
    });
}

function convertDateFormat(date, country) {
  if (country == "br") {
    return `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(
      0,
      4
    )}`;
  } else if (country == "us") {
    return `${date.substring(6, 10)}-${date.substring(3, 5)}-${date.substring(
      0,
      2
    )}`;
  } else {
    return `${date.substring(0, 10)}`;
  }
}

function createList(data, selectedSection) {
  const list = selectedSection.querySelector("ul");
  list.innerHTML = null;
  if (data) {
    let active = 0;
    if (data[0] && data[0].date) {
      const today = new Date();
      for (let i = data.length - 1; i >= 0; i--) {
        if (new Date(data[i].date) <= today) {
          active = data[i].id;
          break;
        }
      }
    }
    for (const item of data) {
      const newLi = document.createElement("li");
      newLi.className = "flex flex-col w-full p-2 items-center justify-between";
      newLi.innerHTML = "";
      newLi.innerHTML =
        newLi.innerHTML +
        `<div class="w-full flex items-center">
      <p id="itemDescription" class="w-full whitespace-pre-wrap mr-3 ${
        item.id == active ? " text-lg" : " text-sm"
      }">${item.description}</p>
      <p id="itemId" class="hidden">${item.id}</p>
    </div >
      <div class="flex space-x-5">
        <svg id="removeButton" class="cursor-pointer h-5 fill-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z" />
        </svg>
      </div>`;
      if (item.date) {
        const brDate = convertDateFormat(item.date, "br");
        newLi.innerHTML =
          `<div class="flex w-full justify-start">
        <p id="itemDate" class="flex w-full text-blue-700 ${
          item.id == active ? " text-lg font-bold" : ""
        }">${brDate}</p>
      </div>` +
          `<div class="flex w-full"> <svg id="editButton" class="cursor-pointer h-5 fill-orange-400 pr-4" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
        d="M144 272L128 384l112-16L436.7 171.3l-96-96L144 272zM512 96L416 0 363.3 52.7l96 96L512 96zM32 64H0V96 480v32H32 416h32V480 320 288H384v32V448H64V128H192h32V64H192 32z" />
        </svg>` +
          newLi.innerHTML +
          "</div>";
        newLi
          .querySelector("#editButton")
          .addEventListener("click", showEditItemModal);
        newLi
          .querySelector("#editButton")
          .querySelector("path")
          .addEventListener("click", showEditItemModal);
      } else {
        newLi.innerHTML =
          `<div class="flex w-full">` + newLi.innerHTML + `</div>`;
      }

      list.appendChild(newLi);
      list.appendChild(document.createElement("hr"));
      newLi
        .querySelector("#removeButton")
        .addEventListener("click", showRemoveItemModal);
      newLi
        .querySelector("#removeButton")
        .querySelector("path")
        .addEventListener("click", showRemoveItemModal);
    }
  } else {
    const newLi = document.createElement("li");
    newLi.className = "flex w-full p-2 items-center justify-between";
    newLi.innerHTML = `<li class="flex w-full p-2 items-center justify-between">
      <p>Nenhum resultado</p>
      <p title="categoryId" class="hidden">0</p>
    </li>`;
    list.appendChild(newLi);
  }
}

function showRemoveItemModal(e) {
  e.stopPropagation();
  if (e.target.tagName == "svg") {
    selectedItem.id =
      e.target.parentElement.parentElement.querySelector("#itemId").textContent;
    selectedItem.description =
      e.target.parentElement.parentElement.querySelector(
        "#itemDescription"
      ).textContent;
  }
  if (e.target.tagName == "path") {
    selectedItem.id =
      e.target.parentElement.parentElement.parentElement.querySelector(
        "#itemId"
      ).textContent;
    selectedItem.description =
      e.target.parentElement.parentElement.parentElement.querySelector(
        "#itemDescription"
      ).textContent;
  }
  showRemoveModal();
}

function showEditItemModal(e) {
  e.stopPropagation();
  if (e.target.tagName == "svg") {
    selectedItem.id =
      e.target.parentElement.parentElement.querySelector("#itemId").textContent;
    selectedItem.description =
      e.target.parentElement.parentElement.querySelector(
        "#itemDescription"
      ).textContent;
    selectedItem.date = convertDateFormat(
      e.target.parentElement.parentElement.querySelector("#itemDate")
        .textContent,
      "us"
    );
  }
  if (e.target.tagName == "path") {
    selectedItem.id =
      e.target.parentElement.parentElement.parentElement.querySelector(
        "#itemId"
      ).textContent;
    selectedItem.description =
      e.target.parentElement.parentElement.parentElement.querySelector(
        "#itemDescription"
      ).textContent;
    selectedItem.date = convertDateFormat(
      e.target.parentElement.parentElement.parentElement.querySelector(
        "#itemDate"
      ).textContent,
      "us"
    );
  }
  showEditModal();
}

function showRemoveModal() {
  removeMessage.textContent = `${selectedItem.description}`;
  modalOverlay.classList.remove("hidden");
  modalRemoveConfirmation.classList.remove("hidden");
}

function hideRemoveModal() {
  removeMessage.textContent = `Remover Item?`;
  modalOverlay.classList.add("hidden");
  modalRemoveConfirmation.classList.add("hidden");
  selectedItem = {};
}

function showEditModal() {
  inputModalEditText.textContent = `${selectedItem.description}`;
  modalOverlay.classList.remove("hidden");
  modalEdit.classList.remove("hidden");
  inputModalEditDate.value = `${selectedItem.date}`;
}

function hideEditModal() {
  modalOverlay.classList.add("hidden");
  modalEdit.classList.add("hidden");
  selectedItem = {};
}

function removeItem() {
  switch (selectOptions.selectedIndex) {
    case 0:
      if (selectedItem) {
        removeStore(selectedItem);
      }
      break;
    case 1:
      if (selectedItem) {
        removeCategory(selectedItem);
      }
      break;
    case 2:
      if (selectedItem) {
        removeSignature(selectedItem);
      }
      break;
  }
}

function editSignature() {
  const editedSignature = {
    id: selectedItem.id,
    description: inputModalEditText.value,
    active: selectedItem.active,
    date: inputModalEditDate.value,
  };
  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(editedSignature);
  let requestOptions = {
    method: "PUT",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };

  fetch(
    `${urlDomain}/signatures/update?apiKeyConfig=${apiKeyConfig}`,
    requestOptions
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        inputAddText.value = null;
        hideEditModal();
        listSignatures();
      }
    })
    .catch(function (err) {
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
      hideEditModal();
    });
}

function removeStore(store) {
  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(store);
  let requestOptions = {
    method: "DELETE",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };
  fetch(
    `${urlDomain}/stores/delete?apiKeyConfig=${apiKeyConfig}`,
    requestOptions
  )
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        hideRemoveModal();
        listStores();
      }
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
    });
}

function removeCategory(category) {
  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(category);
  let requestOptions = {
    method: "DELETE",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };
  fetch(
    `${urlDomain}/categories/delete?apiKeyConfig=${apiKeyConfig}`,
    requestOptions
  )
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        hideRemoveModal();
        listCategories();
      }
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
    });
}

function removeSignature(signature) {
  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(signature);
  let requestOptions = {
    method: "DELETE",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };
  fetch(
    `${urlDomain}/signatures/delete?apiKeyConfig=${apiKeyConfig}`,
    requestOptions
  )
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        hideRemoveModal();
        listSignatures();
      }
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
    });
}

function addItem() {
  switch (selectOptions.selectedIndex) {
    case 0:
      addStore(inputAddText.value);
      btnAdd.disabled = true;
      break;
    case 1:
      addCategory(inputAddText.value);
      btnAdd.disabled = true;
      break;
    case 2:
      addSignature(inputAddText.value);
      btnAdd.disabled = true;
      break;
  }
}

async function addStore(description) {
  const newStore = { id: null, description: description };
  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(newStore);
  let requestOptions = {
    method: "POST",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };

  fetch(`${urlDomain}/stores/add?apiKeyConfig=${apiKeyConfig}`, requestOptions)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        inputAddText.value = null;
        listStores();
      }
    })
    .catch(function (err) {
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
    });
}

async function addCategory(description) {
  const newCategory = { id: null, description: description };
  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(newCategory);
  let requestOptions = {
    method: "POST",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };

  fetch(
    `${urlDomain}/categories/add?apiKeyConfig=${apiKeyConfig}`,
    requestOptions
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        inputAddText.value = null;
        listCategories();
      }
    })
    .catch(function (err) {
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
    });
}

function formatDate(date) {
  return (
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0")
  );
}

async function addSignature(description) {
  let futureDate = new Date();
  if (currentSignatures.length > 1) {
    futureDate = new Date(currentSignatures[currentSignatures.length - 1].date);
    const dateDiff =
      new Date(currentSignatures[currentSignatures.length - 1].date) -
      new Date(currentSignatures[currentSignatures.length - 2].date);
    futureDate.setTime(futureDate.getTime() + dateDiff);
  } else if (currentSignatures.length > 0) {
    futureDate = new Date(currentSignatures[currentSignatures.length - 1].date);
    futureDate.setTime(futureDate.getTime() + 1000 * 60 * 60 * 24);
  }

  const newSignature = {
    id: null,
    description: description,
    date: convertDateFormat(futureDate.toISOString()),
  };
  const defaultHeader = new Headers();
  defaultHeader.append("Content-Type", "application/json");
  const requestJSON = JSON.stringify(newSignature);
  let requestOptions = {
    method: "POST",
    headers: defaultHeader,
    body: requestJSON,
    redirect: "follow",
  };

  fetch(
    `${urlDomain}/signatures/add?apiKeyConfig=${apiKeyConfig}`,
    requestOptions
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length > 0 && data[0] == "password") {
        loginText.innerHTML = "Senha inválida!";
        loginText.classList.add("text-red-500");
        inputLoginPassword.value = "";
        showLogin(true);
        return false;
      } else {
        loginText.classList.remove("text-red-500");
        showLogin(false);
        inputAddText.value = null;
        listSignatures();
      }
    })
    .catch(function (err) {
      loginText.innerHTML = "Erro na solicitação.";
      loginText.classList.add("text-red-500");
      console.log("Something went wrong!", err);
    });
}

startUp();
