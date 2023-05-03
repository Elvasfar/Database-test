// Filtered posts //

function sortPostsByTitle(posts) {
  console.log(posts);
  const filteredPostsByTitle = posts.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
  return filteredPostsByTitle;
}

function sortPostsByBody(posts) {
  const filteredPostsByBody = posts.sort((a, b) => {
    const bodyA = a.body.toUpperCase();
    const bodyB = b.body.toUpperCase();
    if (bodyA < bodyB) {
      return -1;
    }
    if (bodyA > bodyB) {
      return 1;
    }
    return 0;
  });
  return filteredPostsByBody;
}

function searchOption() {
  const searchValue = document.getElementById("search-filter").value;
  return searchValue;
}

function searchedPosts(posts) {
  const searchValue = searchOption();
  const filteredPosts = posts.filter((post) => {
    const title = post.title.toLowerCase();
    const body = post.body.toLowerCase();
    return title.includes(searchValue) || body.includes(searchValue);
  });

  return filteredPosts;
}

function searchedUsers(users) {
  const searchValue = searchOption();
  const filteredUsers = users.filter((user) => {
    const name = user.name.toLowerCase();
    const title = user.title.toLowerCase();
    const mail = user.mail.toLowerCase();
    return (
      name.includes(searchValue) ||
      title.includes(searchValue) ||
      mail.includes(searchValue)
    );
  });

  return filteredUsers;
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
  sortPostsByBody,
  sortPostsByTitle,
  searchOption,
  searchedPosts,
  preparePostData,
  prepareUserData,
  searchedUsers,
};
