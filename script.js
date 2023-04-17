"use strict";

window.addEventListener("load", start);

const endpoint = "https://database-project-6449a-default-rtdb.firebaseio.com";

function start() {
  console.log("Databaseapp kører");
  getPosts();
}

async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`);
  const data = await response.json();
  console.log(data);
  const posts = preparePostData(data);
  console.log(posts);
  return posts;
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
