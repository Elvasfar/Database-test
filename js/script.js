"use strict";

import {
  deletePost,
  updatePost,
  createPost,
  getPosts,
  getUsers,
  preparePostData,
  prepareUserData,
  updateUser,
  deleteUser,
} from "./rest-service.js";

import {
  sortPostsByBody,
  sortPostsByTitle,
  sortUsersByMail,
  sortUsersByName,
  sortUsersByTitle,
  searchOption,
  searchedPosts,
  searchedUsers,
} from "./helper.js";

window.addEventListener("load", start);
// -- global variabel til databasen -- //
const endpoint = "https://database---app-2-default-rtdb.firebaseio.com/";
let posts;
let users;

async function start() {
  // -- Kalder funktioner til visning af posts og users --//
  updatePostsGrid();
  updateUsersGrid();

  // -- Evenlisteners på knapper -- //
  document
    .querySelector("#btn-create")
    .addEventListener("click", createPostClicked);

  document
    .querySelector("form#form-create")
    .addEventListener("submit", clickSubmit);
  document
    .querySelector("form#form-delete-post")
    .addEventListener("submit", deletePostClicked);

  document
    .querySelector("form#form-delete-user")
    .addEventListener("submit", deleteUserClicked);

  document
    .querySelector("#form-update")
    .addEventListener("submit", updatePostClicked);

  document
    .querySelector("#form-update-user")
    .addEventListener("submit", updateUserClicked);

  const closeButtonDelete = document.querySelector("#btn-cancel");
  closeButtonDelete.addEventListener("click", function () {
    const dialogClose = document.querySelector("#dialog-delete-post");
    dialogClose.close();
  });

  const closeButtonDeleteUser = document.querySelector("#btn-cancel-user");
  closeButtonDeleteUser.addEventListener("click", function () {
    const dialogClose = document.querySelector("#dialog-delete-user");
    dialogClose.close();
  });

  const closeButton = document.querySelector("#create-close-btn");
  closeButton.addEventListener("click", function () {
    const dialog = document.querySelector("#create-post");
    dialog.close();
  });

  const closeButtonUpdate = document.querySelector("#update-close-btn");
  closeButtonUpdate.addEventListener("click", function () {
    const dialog = document.querySelector("#update-post");
    dialog.close();
  });

  const closeButtonUpdateUser = document.querySelector(
    "#update-user-close-btn"
  );
  closeButtonUpdateUser.addEventListener("click", function () {
    const dialog = document.querySelector("#update-user");
    dialog.close();
  });

  const selectElement = document.getElementById("sort-by");
  selectElement.addEventListener("change", handleUserInput);

  const selectElement2 = document.getElementById("user-sort-by");
  selectElement2.addEventListener("change", handleUserInput2);

  const selectElement3 = document.getElementById("filter-by");
  selectElement3.addEventListener("change", handleUserInput3);

  const searchValue = document.getElementById("search-filter");
  searchValue.addEventListener("keydown", async function () {
    const posts = await getPosts(`${endpoint}/posts.json`);
    const filteredPosts = searchedPosts(posts);
    document.querySelector("#posts").innerHTML = "";
    filteredPosts.forEach(showPosts);
  });

  const searchValue2 = document.getElementById("search-filter");
  searchValue2.addEventListener("keydown", async function () {
    const users = await getUsers(`${endpoint}/users.json`);
    const filteredUsers = searchedUsers(users);
    document.querySelector("#users").innerHTML = "";
    filteredUsers.forEach(showUsers);
  });
}
// -- eventlistener til at vise preview-image på create-post og update-post -- //
document
  .querySelector("#image-create")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      document
        .querySelector("#preview-image-create")
        .setAttribute("src", reader.result);
    };
  });

document
  .querySelector("#image-update")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      document
        .querySelector("#preview-image-update")
        .setAttribute("src", reader.result);
    };
  });

document
  .querySelector("#image-update-user")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      document
        .querySelector("#preview-image-update-user")
        .setAttribute("src", reader.result);
    };
  });

async function updatePostsGrid(filteredPosts) {
  document.querySelector("#posts").innerHTML = "";
  posts = await getPosts(`${endpoint}/posts.json`);

  if (filteredPosts) {
    filteredPosts.forEach(showPosts);
  } else {
    posts.forEach(showPosts);
  }
}

async function updateUsersGrid(filteredUsers) {
  document.querySelector("#users").innerHTML = "";
  users = await getUsers(`${endpoint}/users.json`);

  if (filteredUsers) {
    filteredUsers.forEach(showUsers);
  } else {
    users.forEach(showUsers);
  }
}

async function showPosts(post) {
  //-- Indsætter et HTML-element for hvert post --//
  document.querySelector("#posts").insertAdjacentHTML(
    "beforeend",
    `
        <article class="grid-item">
        <img id="grid-item-image"src="${post.image}" alt""/>
        <div><h2>${post.title}</h2> <br> <p>${post.body}</p>
            <button class="btn-delete" data-id="${post.id}">Delete</button>
            <button class="btn-update" data-id="${post.id}">Update</button>
        </div>
        </div> 
        
        </article>
        `
  );
  //-- eventlistenere på knapperne i hvert post som kalder deleteClicked og updateClicked --//
  document
    .querySelector("#posts article:last-child .btn-delete")
    .addEventListener("click", () => deleteClicked(post));
  document
    .querySelector("#posts article:last-child .btn-update")
    .addEventListener("click", () => updateClicked(post));

  document
    .querySelector("#posts article:last-child")
    .addEventListener("click", (event) => postClicked(event, post));

  document
    .querySelectorAll("#posts article:last-child button")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent event from bubbling up to grid-item
      });
    });

  function postClicked(event, post) {
    if (event.target.tagName === "BUTTON") {
      // If the click target is a button, don't open the dialog
      return;
    }
    document.querySelector("#dialog-header").textContent = post.title;
    document.querySelector("#dialog-description").textContent = post.body;
    document.querySelector("#dialog-image").src = post.image;
    document.querySelector("#postsDialog").showModal();
    document.querySelector("#postsDialog").scrollTop = 0;
  }
}

function deleteClicked(post) {
  //-- Åbner dialog med det pågældende posts properties for title og id --//
  document.querySelector("#dialog-delete-post-title").textContent = post.title;
  document.querySelector("#form-delete-post").setAttribute("data-id", post.id);
  document.querySelector("#dialog-delete-post").showModal();
}
function updateClicked(post) {
  const updateForm = document.querySelector("#form-update");
  updateForm.id.value = post.id;
  updateForm.title.value = post.title;
  updateForm.body.value = post.body;
  document.querySelector("#preview-image-update").src = post.image;
  document.querySelector("#update-post").showModal();
}

function showUsers(user) {
  document.querySelector("#users").insertAdjacentHTML(
    "beforeend",
    `
    <article class="grid-item">
    <img id="grid-item-image"src="${user.image}" alt""/>
    <div><h2>${user.name}</h2> <br> <h3>${user.title}</h3><p>${user.mail}</p>
                <button class="btn-delete" data-id="${user.id}">Delete</button>
            <button class="btn-update" data-id="${user.id}">Update</button>
</div> 
    </article>
    `
  );

  document
    .querySelector("#users article:last-child")
    .addEventListener("click", (event) => userClicked(event, user));

  document
    .querySelectorAll("#users article:last-child button")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent event from bubbling up to grid-item
      });
    });

  document
    .querySelector("#users article:last-child .btn-delete")
    .addEventListener("click", () => deleteClickedUser(user));
  document
    .querySelector("#users article:last-child .btn-update")
    .addEventListener("click", (event) => updateClickedUser(user));

  function userClicked(event, user) {
    if (event.target.tagName === "BUTTON") {
      // If the click target is a button, don't open the dialog
      return;
    }
    document.querySelector("#dialog-header").textContent = user.name;
    document.querySelector("#dialog-subheader").textContent = user.title;
    document.querySelector("#dialog-description").textContent = user.mail;
    document.querySelector("#dialog-image").src = user.image;
    document.querySelector("#postsDialog").showModal();
    document.querySelector("#postsDialog").scrollTop = 0;
  }
}

// CREATE //
async function clickSubmit(event, post) {
  event.preventDefault();
  const elements = document.querySelector("form#form-create").elements;

  const file = elements.namedItem("image").files[0]; // get the selected file
  const reader = new FileReader(); // create a FileReader object

  // set up a callback to be called when the file is loaded
  reader.onload = async () => {
    const post = {
      title: elements.namedItem("title").value,
      body: elements.namedItem("body").value,
      image: reader.result, // set the image property to the data URL
    };
    const response = await createPost(post.title, post.body, post.image, post);
    if (response.ok) {
      console.log("New post added");
      updatePostsGrid();
    }

    document.querySelector("#create-post").close(); // close dialog
  };

  // read the file as a data URL
  reader.readAsDataURL(file);
}

function createPostClicked() {
  //-- Åbner dialog og scroller automatisk til toppen af vinduet --//
  document.querySelector("#create-post").showModal();
  document.querySelector("#create-post").scrollTop = 0;
}

// DELETE //
async function deletePostClicked(event) {
  const id = event.target.getAttribute("data-id");
  const response = await deletePost(id);
  if (response.ok) {
    console.log("post succesfully deleted");
    updatePostsGrid();
  }
}

async function deleteUserClicked(event) {
  const id = event.target.getAttribute("data-id");
  const response = await deleteUser(id);
  if (response.ok) {
    console.log("post succesfully deleted");
    updateUsersGrid();
  }
}

function deleteClickedUser(user) {
  //-- Åbner dialog med det pågældende posts properties for title og id --//
  document.querySelector("#dialog-delete-user-name").textContent = user.name;
  document.querySelector("#form-delete-user").setAttribute("data-id", user.id);
  document.querySelector("#dialog-delete-user").showModal();
}

// UPDATE //

function updateClickedUser(user) {
  const updateForm = document.querySelector("#form-update-user");
  console.log(user.id);
  updateForm.id.value = user.id;
  updateForm.name.value = user.name;
  updateForm.title.value = user.title;
  updateForm.mail.value = user.mail;
  document.querySelector("#preview-image-update-user").src = user.image;
  document.querySelector("#update-user").showModal();
}

async function updateUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.id.value;
  const title = form.title.value;
  const name = form.name.value;
  const mail = form.mail.value;
  const image = form.image.files[0];

  if (!image) {
    alert("Please select an image.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = async () => {
    const user = {
      name,
      title,
      mail,
      image: reader.result,
    };
    const response = await updateUser(id, user);
    console.log(response.status); // Log the status code
    console.log(response.statusText); // Log the status text
    if (response.ok) {
      updateUsersGrid();
      document.querySelector("#update-user").close();
    }
  };
}

async function updatePostClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.id.value;
  const title = form.title.value;
  const body = form.body.value;
  const image = form.image.files[0];

  if (!image) {
    alert("Please select an image.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = async () => {
    const post = {
      title,
      body,
      image: reader.result,
    };
    const response = await updatePost(id, post);
    if (response.ok) {
      updatePostsGrid();
      document.querySelector("#update-post").close();
    }
  };
}

function handleUserInput() {
  const selectElement = document.getElementById("sort-by");
  const selectedValue = selectElement.value;

  if (selectedValue === "title") {
    console.log(posts);
    const sortedPosts = sortPostsByTitle(posts);
    updatePostsGrid(sortedPosts);
  } else if (selectedValue === "body") {
    const sortedPosts = sortPostsByBody(posts);
    updatePostsGrid(sortedPosts);
  } else {
    updatePostsGrid();
  }
}

function handleUserInput2() {
  const selectElement = document.getElementById("user-sort-by");
  const selectedValue = selectElement.value;

  if (selectedValue === "name") {
    console.log(posts);
    const sortedUsers = sortUsersByName(users);
    updateUsersGrid(sortedUsers);
  } else if (selectedValue === "title") {
    const sortedUsers = sortUsersByTitle(users);
    updateUsersGrid(sortedUsers);
  } else if (selectedValue === "mail") {
    const sortedUsers = sortUsersByMail(users);
    updateUsersGrid(sortedUsers);
  } else {
    updateUsersGrid();
  }
}

function handleUserInput3() {
  const selectElement = document.getElementById("filter-by");
  const selectedValue = selectElement.value;

  if (selectedValue === "users") {
    const filteredPosts = posts.filter((post) => post.id < 0);
    updatePostsGrid(filteredPosts);
    updateUsersGrid();
  } else if (selectedValue === "posts") {
    const filteredUsers = users.filter((user) => user.id < 0);
    updateUsersGrid(filteredUsers);
    updatePostsGrid();
  } else {
    updateUsersGrid();
    updatePostsGrid();
  }
}
