const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sData = document.querySelector('#m-data')
const sNome = document.querySelector('#m-nome')
const sValor = document.querySelector('#m-valor')
const sCategoria = document.querySelector('#m-categoria')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sData.value = itens[index].data
    sNome.value = itens[index].nome
    sValor.value = itens[index].valor
    sCategoria.value = itens[index].categoria
    id = index
  } else {
    sData.value = ''
    sNome.value = ''
    sValor.value = ''
    sCategoria.value = ''
  }
  
}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.data}</td>
    <td>${item.nome}</td>
    <td>${item.valor}</td>
    <td>${item.categoria}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  
  if (sData.value == '' || sNome.value == '' || sValor.value == '' || sCategoria.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].data = sData.value
    itens[id].nome = sNome.value
    itens[id].valor = sValor.value
    itens[id].categoria = sCategoria.value
  } else {
    itens.push({'data': sData.value, 'nome': sNome.value, 'valor': sValor.value, 'categoria': sCategoria.value})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()
