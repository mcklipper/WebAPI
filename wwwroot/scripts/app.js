function getPeople() {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
  
      if (this.status == 200 && this.readyState == 4) {
        let data = JSON.parse(this.response);
        resolve(data);
      }

      if (this.readyState == 4 && this.status > 400) {
        reject(this.status);
      }
  
    }
  
    xhr.open('get', 'https://localhost:7036/People', true);
    xhr.send();
  }); 
}

async function fillTable() {
  const people = await getPeople();
  const table = document.getElementById('tbody');
  
  if (table.children.length > 0) 
    table.querySelectorAll('tr').forEach(tr => tr.remove());

  for (let person of people) {

    let tr = document.createElement('tr');

    for (let prop in person) {
      let td = document.createElement('td');
      td.innerText = person[prop];
      tr.appendChild(td);
    }

    addDeleteBtn(tr, person.id);
    addUpdateBtn(tr, person.id);
    table.appendChild(tr);
  }
}

function addDeleteBtn(tr, id) {
  let deleteTd = document.createElement('td');
  let deleteBtn = document.createElement('button');

  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'Törlés';
  deleteBtn.setAttribute('data-id', `${id}`);
  deleteBtn.addEventListener('click', async function (e) {
    let url = `https://localhost:7036/People/${this.getAttribute('data-id')}`;
    await fetch(url, { method: 'delete' });

    await fillTable();
  });

  deleteTd.appendChild(deleteBtn);
  tr.appendChild(deleteTd);
}

function addUpdateBtn(tr, id) {
  let updateTd = document.createElement('td');
  let updateBtn = document.createElement('button');

  updateBtn.classList.add('update-btn');
  updateBtn.textContent = 'Módosítás';
  updateBtn.setAttribute('data-id', `${id}`);
  updateBtn.addEventListener('click', async (e) => await loadUpdateTemplate(id));

  updateTd.appendChild(updateBtn);
  tr.appendChild(updateTd);
}

async function createPerson() {
  const name = document.getElementById('name');
  const age = document.getElementById('age');

  await fetch('https://localhost:7036/People', { 
    method: 'post', 
    body: JSON.stringify({ name: name.value, age: parseInt(age.value) }), 
    headers: { 'Content-Type': 'application/json' }
  });

  loadTemplate('table-template');
  await fillTable();
}

async function updatePerson() {
  const name = document.getElementById('name');
  const age = document.getElementById('age');
  const btn = document.getElementById('update-btn');

  await fetch(`https://localhost:7036/People/${btn.getAttribute('data-id')}`, { 
    method: 'put', 
    body: JSON.stringify({ name: name.value, age: parseInt(age.value) }), 
    headers: { 'Content-Type': 'application/json' }
  });

  loadTemplate('table-template');
  await fillTable();
}

async function loadUpdateTemplate(personId) {
  loadTemplate('update-from-template');

  const name = document.getElementById('name');
  const age = document.getElementById('age');
  const btn = document.getElementById('update-btn');

  let person = await (await fetch(`https://localhost:7036/People/${personId}`)).json();

  name.value = person.name;
  age.value = person.age;
  btn.setAttribute('data-id', personId);
}

function loadTemplate(templateId) {
  const container = document.getElementById('container');
  const template = document.getElementById(templateId);

  const fetchingNode = document.importNode(template.content, true);

  if (container.firstElementChild)
    return container.firstElementChild.replaceWith(fetchingNode);

  container.appendChild(fetchingNode);
}

(async function main() {
  loadTemplate('table-template');
  await fillTable();
})();


