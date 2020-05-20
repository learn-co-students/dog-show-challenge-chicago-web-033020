const DOGS_URL = "http://localhost:3000/dogs"

document.addEventListener('DOMContentLoaded', () => {
    const dogTableBody = document.getElementById('table-body')
    const newDogForm = document.getElementById('create-dog-form')
    const oldDogForm = document.getElementById('edit-dog-form')

    function dogToTable(dog) {
        dogTableBody.innerHTML += 
        `<tr id=${dog.id}><td>${dog.name}</td><td>${dog.breed}</td><td>${dog.sex}</td><td><button class='edit'>Edit</button></td></tr>`
    }

    fetch(DOGS_URL)
    .then(resp => resp.json())
    .then(dogs => dogs.forEach(dog => dogToTable(dog)))

    newDogForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const obj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: newDogForm.querySelector("input[name='name']").value,
                breed: newDogForm.querySelector("input[name='breed']").value,
                sex: newDogForm.querySelector("input[name='sex']").value
            })
        }

        fetch(DOGS_URL, obj)
        .then(resp => resp.json())
        .then(respDog => dogToTable(respDog))
    })

    document.addEventListener("click", e => {
        if (e.target.className === 'edit') {
            const dog = e.target.parentNode.parentNode

            const nameBox = oldDogForm.querySelector("input[name='name']")
            const breedBox = oldDogForm.querySelector("input[name='breed']")
            const sexBox = oldDogForm.querySelector("input[name='sex']")

            fetch(`${DOGS_URL}/${dog.id}`)
            .then(resp => resp.json())
            .then(json => {
                nameBox.value=json.name
                breedBox.value=json.breed
                sexBox.value=json.sex
            })
            
            oldDogForm.addEventListener("submit", (e) => {
                e.preventDefault()
                
                const obj = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameBox.value,
                        breed: breedBox.value,
                        sex: sexBox.value
                    })
                }
        
                fetch(`${DOGS_URL}/${dog.id}`, obj)
                .then(resp => resp.json())
                .then(json => {
                    dogTableBody.children[dog.id-1].innerHTML = `<td>${json.name}</td><td>${json.breed}</td><td>${json.sex}</td><td><button class="edit">Edit</button></td>`
                })
            })
        }
    })

})