"use strict";

window.addEventListener("load", start);

const endpoint = "https://database---app-2-default-rtdb.firebaseio.com";

async function start() {
  console.log("Databaseapp kører");

  updatePostsGrid();
  updateUsersGrid();

  document
    .querySelector("#btn-create")
    .addEventListener("click", createPostClicked);

  const postObject = parseJSONString(
    '{"title": "This is my awesome title", "image": "https://share.cederdorff.com/images/petl.jpg" }'
  );
  console.log(postObject);
  const postString = stringify(["Ford", "BMW", "Audi", "Fiat", "VW"]);
  console.log(postString);

  //   document
  //     .querySelector("form#form-create")
  //     .addEventListener("submit", clickSubmit);

  //   document
  //     .querySelector("#TC-create-checkbox")
  //     .addEventListener("click", clickAccept);
}

function clickAccept(event) {
  console.log("Accept changed");
  console.log(event.target.checked);
  if (event.target.checked === true) {
    document.querySelector("#submit-btn-create").disabled = false;
  } else {
    document.querySelector("#submit-btn-create").disabled = true;
  }
}

function clickSubmit(event) {
  event.preventDefault();

  console.log("Submit clicked");
  const elements = document.querySelector("form#form-create").elements;
  const signup = {
    fullname: elements.namedItem("fullName").value,
    email: elements.namedItem("email").value,
    username: elements.namedItem("username").value,
    password: elements.namedItem("password").value,
    payment: elements.namedItem("payment").value,
    payEvery: elements.namedItem("payEvery").value,
    spam: elements.namedItem("spam").value,
  };
  console.log(signup);
}

function createPostClicked() {
  const randomNumber = Math.floor(Math.random() * 100 + 1);
  const title = `My post number: ${randomNumber}`;
  const body = "Ellaborate description of my awesome post";
  const image =
    "https://img.freepik.com/free-photo/face-expressions-illustrations-emotions-feelings_53876-125619.jpg?w=1380&t=st=1681899851~exp=1681900451~hmac=9f1c242ac4c6defdcb69846928ce96a98ac8c1210d9350f8c0b0b9385a8ea406";
  createPost(title, body, image);
}

async function updatePostsGrid() {
  document.querySelector("#posts").innerHTML = "";
  const posts = await getPosts(`${endpoint}/posts.json`);
  posts.forEach(showPosts);
}

async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`);
  const data = await response.json();
  console.log(data);
  const posts = preparePostData(data);
  console.log(posts);
  return posts;
}

async function updateUsersGrid() {
  const users = await getUsers(`${endpoint}/users.json`);
  users.forEach(showUsers);
}

async function getUsers() {
  const response = await fetch(`${endpoint}/users.json`);
  const data = await response.json();
  console.log(data);
  const users = prepareUserData(data);
  console.log(users);
  return users;
}

function preparePostData(dataObject) {
  const newArray = [];
  for (const key in dataObject) {
    const post = dataObject[key];
    post.id = key;
    console.log(post);
    newArray.push(post);
  }
  console.log(newArray);
  return newArray;
}

function prepareUserData(dataObject) {
  const newArray2 = [];
  for (const key in dataObject) {
    const user = dataObject[key];
    user.id = key;
    console.log(user);
    newArray2.push(user);
  }
  console.log(newArray2);
  return newArray2;
}

async function showPosts(post) {
  document.querySelector("#posts").insertAdjacentHTML(
    "beforeend",
    `
        <article class="grid-item">
        <img id="grid-item-image"src="${post.image}" alt""/>
        <div><h2>${post.title}</h2> <br> <p>${post.body}</p>
            <button class="btn-delete">Delete</button>
            <button class="btn-update">Update</button>
        </div>
        </div> 
        
        </article>
        `
  );

  document
    .querySelector("#posts article:last-child .btn-delete")
    .addEventListener("click", deleteClicked);
  document
    .querySelector("#posts article:last-child .btn-update")
    .addEventListener("click", updateClicked);
  function deleteClicked() {
    deletePost(post.id);
  }

  function updateClicked() {
    const title = `${post.title}`;
    const body = "I can now update post with hardcoded data!!";
    const image =
      "https://th.bing.com/th/id/R.24aa4d964d999a6a109664bdd8659839?rik=ffbxrpqMvIcuag&riu=http%3a%2f%2ftruediscipleship.com%2fwp-content%2fuploads%2f2016%2f07%2fparty-2.jpg&ehk=R6o%2fmUH%2bEp%2bI%2f0TsKKx%2bTqU7hk5ngY3XBqLi1Un%2fsJI%3d&risl=&pid=ImgRaw&r=0";
    updatePost(post.id, title, body, image);
  }

  document
    .querySelector("#posts article:last-child")
    .addEventListener("click", postClicked);

  function postClicked(event) {
    console.log(post);

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

  document
    .querySelectorAll("#posts article:last-child button")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent event from bubbling up to grid-item
      });
    });
}

function showUsers(user) {
  document.querySelector("#users").insertAdjacentHTML(
    "beforeend",
    `
    <article class="grid-item">
    <img id="grid-item-image"src="${user.image}" alt""/>
    <div><h2>${user.name}</h2> <br> <h3>${user.title}</h3><p>${user.mail}</p></div> 
    </article>
    `
  );

  document
    .querySelector("#users article:last-child")
    .addEventListener("click", userClicked);

  function userClicked() {
    console.log(user);
    document.querySelector("#dialog-header").textContent = user.name;
    document.querySelector("#dialog-subheader").textContent = user.title;
    document.querySelector("#dialog-description").textContent = user.mail;
    document.querySelector("#dialog-image").src = user.image;
    document.querySelector("#postsDialog").showModal();
    document.querySelector("#postsDialog").scrollTop = 0;
  }
}

async function createPost(title, body, image) {
  const newPost = { title, body, image };
  console.log(newPost);
  const newPostJson = JSON.stringify(newPost);
  const response = await fetch(`${endpoint}/posts.json`, {
    method: "POST",
    body: newPostJson,
  });
  console.log(response);
  //const data = await response.json();
  //console.log(data);
  if (response.ok) {
    console.log("New post added");
    updatePostsGrid();
  }
}

// === UPDATE (PUT) === //
async function updatePost(id, title, body, image) {
  const postToUpdate = { title, body, image };
  const postAsJson = JSON.stringify(postToUpdate);
  const url = `${endpoint}/posts/${id}.json`;

  const response = await fetch(url, { method: "PUT", body: postAsJson });
  const data = await response.json();
  console.log(data);

  if (response.ok) {
    console.log("Post is succesfully updated");
    updatePostsGrid();
  }
}

// === DELETE (DELETE) === //
async function deletePost(id) {
  const url = `${endpoint}/posts/${id}.json`;
  const response = await fetch(url, { method: "DELETE" });
  console.log(response);
  if (response.ok) {
    console.log("post succesfully deleted");
    updatePostsGrid();
  }
}

// JSON - Methods ... Øvelser //
function parseJSONString(string) {
  const parsedString = JSON.parse(string);
  console.log(parsedString);
  return parsedString;
}

function stringify(object) {
  const stringedObject = JSON.stringify(object);
  console.log(stringedObject);
  return stringedObject;
}
