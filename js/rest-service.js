const endpoint = "https://database---app-2-default-rtdb.firebaseio.com/";
let posts;

async function getPosts() {
  // -- Fetcher posts fra databasen, sender dem videre til preparePostData-funktionen og returnerer svaret --//
  const response = await fetch(`${endpoint}/posts.json`);
  const data = await response.json();
  posts = preparePostData(data);
  return posts;
}

async function getUsers() {
  const response = await fetch(`${endpoint}/users.json`);
  const data = await response.json();
  const users = prepareUserData(data);
  return users;
}

async function createPost(title, body, image, post) {
  const newPost = { title, body, image, post };
  const newPostJson = JSON.stringify(newPost);
  const response = await fetch(`${endpoint}/posts.json`, {
    method: "POST",
    body: newPostJson,
  });
  return response;
}

// === UPDATE (PUT) === //
async function updatePost(id, post) {
  const postAsJson = JSON.stringify(post);
  const url = `${endpoint}/posts/${id}.json`;

  const response = await fetch(url, { method: "PUT", body: postAsJson });
  const data = await response.json();
  return response;
}

// === DELETE (DELETE) === //
async function deletePost(id) {
  const url = `${endpoint}/posts/${id}.json`;
  const response = await fetch(url, { method: "DELETE" });
  return response;
}

function preparePostData(dataObject) {
  const newArray = [];
  for (const key in dataObject) {
    const post = dataObject[key];
    post.id = key;
    newArray.push(post);
  }
  return newArray;
}

function prepareUserData(dataObject) {
  const newArray2 = [];
  for (const key in dataObject) {
    const user = dataObject[key];
    user.id = key;
    newArray2.push(user);
  }
  return newArray2;
}

export {
  deletePost,
  updatePost,
  createPost,
  getPosts,
  getUsers,
  preparePostData,
  prepareUserData,
};
