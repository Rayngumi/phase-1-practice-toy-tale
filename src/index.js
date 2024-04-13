let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
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

  const toyCollection = document.querySelector("#toy-collection");
    const toyForm = document.querySelector(".add-toy-form");

    const fetchToys = () => {
        fetch('http://localhost:3000/toys')
            .then(response => response.json())
            .then(toys => {
                toys.forEach(toy => renderToy(toy));
            })
            .catch(error => console.error('Error fetching toys:', error));
    };

    const renderToy = (toy) => {
        const toyCard = document.createElement('div');
        toyCard.classList.add('card');

        toyCard.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p>${toy.likes} Likes</p>
            <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
        `;

        toyCollection.appendChild(toyCard);
    };

    toyForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(toyForm);
        const name = formData.get('name');
        const image = formData.get('image');

        fetch('http://localhost:3000/toys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                image: image,
                likes: 0
            })
        })
        .then(response => response.json())
        .then(newToy => {
            renderToy(newToy);
            toyForm.reset();
        })
        .catch(error => console.error('Error adding new toy:', error));
    });

    toyCollection.addEventListener('click', (event) => {
        if (event.target.classList.contains('like-btn')) {
            const toyId = event.target.dataset.id;
            const likesElement = event.target.previousElementSibling;
            const currentLikes = parseInt(likesElement.textContent);
            const newLikes = currentLikes + 1;

            fetch(`http://localhost:3000/toys/${toyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    likes: newLikes
                })
            })
            .then(response => response.json())
            .then(updatedToy => {
                likesElement.textContent = `${updatedToy.likes} Likes`;
            })
            .catch(error => console.error('Error updating toy likes:', error));
        }
    });

    fetchToys();
});
