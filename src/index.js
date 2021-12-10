let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  fetchToys()
  
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  // ADD EVENT LISTENER TO CREATE TOY BUTTON AND CREATE NEW CARD
  toyFormContainer.addEventListener('submit', (evt) => {
    evt.preventDefault()
    postToy(evt.target.name.value, evt.target.image.value)
  })
});

const toyContainer = document.getElementById('toy-collection')

function fetchToys() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toys => {
    for (toy of toys) {
      createToyCards(toy)
    }
  })
}

function createToyCards(toy) {
  let card = document.createElement('div')
  card.className = "card"
  card.id = `${toy.id}_card`
  toyContainer.appendChild(card)


  let toyName = document.createElement('h2')
  toyName.textContent = toy.name
  card.appendChild(toyName)

  let toyImg = document.createElement('img')
  toyImg.className = "toy-avatar"
  toyImg.src = toy.image
  card.appendChild(toyImg)

  let likes = document.createElement('p')
  let likesNum = toy.likes
  likes.textContent = `${likesNum} likes!`
  card.appendChild(likes)

  let likeBtn = document.createElement('button')
  likeBtn.innerHTML = " Like &#10084"
  card.appendChild(likeBtn)
  likeBtn.addEventListener('click', (evt) => {
    let likesMessage = evt.target.parentNode.children[2]
    let currentLikes = parseInt(likesMessage.innerText.split(' ')[0])
    let newLikes = currentLikes + 1
    patchLikes(toy, newLikes)
    likesMessage.innerText = `${newLikes} likes!`
  })
}

function postToy(toyName, toyUrl) {
  fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: toyName,
        image: toyUrl,
        likes: 0,
      })
  })
  .then(response => response.json())
  .then(toy => createToyCards(toy))
}

function patchLikes(toy, likeNum) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: likeNum,
      })
  })
  .then(response => response.json())
  .then(toy => console.log(toy))
}

