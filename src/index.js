document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector("#table-body")
  const form = document.querySelector("form")
  let currentId

  table.addEventListener("click", handleEditListener)
  form.addEventListener("submit", submitForm)
  
  function handleEditListener(event){
    if (event.target.tagName === "BUTTON"){
      const dogId = parseInt(event.target.dataset.id)
      fetch(`http://localhost:4000/dogs/${dogId}`)
      .then(resp => resp.json())
      .then(json => fillInForm(json))
    }
  }
  
  function fillInForm(dog){
    form.name.value = dog.name
    form.breed.value = dog.breed
    form.sex.value = dog.sex
    currentId = parseInt(dog.id)
  }
  
  function submitForm(event){
    event.preventDefault();
    const formData = {
      name: event.target.name.value,
      breed: event.target.breed.value,
      sex: event.target.sex.value
    }
    form.reset()

    const reqObj = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }
  
    fetch(`http://localhost:4000/dogs/${currentId}`, reqObj)
    .then(resp => getDogs())
  }
  
  function getDogs(){
    fetch(`http://localhost:4000/dogs`)
    .then(resp => resp.json())
    .then(json => renderDogs(json))
  }
  
  function renderDogs(allDogs){
    console.log("in render")
    table.innerHTML = ''
    allDogs.forEach(dog => {
      const table = document.querySelector("#table-body")
      table.innerHTML += renderOneDog(dog)
    })
  }
  
  function renderOneDog(dog){
    return `<tr><td>${dog.name}</td> <td>${dog.breed}</td> <td>${dog.sex}</td> <td><button data-id="${dog.id}">Edit</button></td></tr>`
  }

  getDogs()
})