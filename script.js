//LocalStorage
var novo_hist = window.localStorage.getItem("db_hist");
var novo_hist_entradas = window.localStorage.getItem("db_hist_entradas");
var novo_hist_geral = window.localStorage.getItem("db_hist_geral");

//Seleção de elementos HTML
var selecionarOp = document.getElementById("op");
var saida = document.getElementById("saida");
var tituloSaida = document.getElementById("titulo-saida");
var tabelaDespesas = document.getElementById("tabela-despesas");
var despesasTotais = document.getElementById("despesas-totais");
var entradasTotais = document.getElementById("entradas-totais");
var saldoTotal = document.getElementById("saldo-total");


//JSON de saídas e entradas
var historico_de_saidas = {
    id:[],
    titulo : [],
    valor : []
}

var historico_de_entradas = {
    id:[],
    titulo : [],
    valor : []
}

var historico_geral = {
    id:[],
    html_ : []
}



let list_data = JSON.parse(novo_hist);
let list_data_entradas = JSON.parse(novo_hist_entradas);
let list_data_geral = JSON.parse(novo_hist_geral);


console.log(list_data_geral)

//Push nos elementos do localStorage para o JSON
if(list_data != null){
    for (var i of list_data.titulo) {
        historico_de_saidas.titulo.push(i);
    }

    for (var i of list_data.valor) {
        historico_de_saidas.valor.push(i);
    }
}

if(list_data_entradas != null){
    for (var i of list_data_entradas.titulo) {
        historico_de_entradas.titulo.push(i);
    }

    for (var i of list_data_entradas.valor) {
        historico_de_entradas.valor.push(i);
    }
}

if(list_data_geral != null){
    for (var i of list_data_geral.html_) {
        historico_geral.html_.push(i);
    }

    for (var i of list_data_geral.id) {
        historico_geral.id.push(i);
    }
}

//Inserir os valores na tabela ao carregar a página
onload = function(){

    for(k = 0;k < historico_geral.html_.length; k++){
        tabelaDespesas.insertAdjacentHTML('afterbegin', historico_geral.html_[k]);
    }

    somarValores();
}

//Registrar novos valores de entradas e saídas
function registrar(chart){
    let valorSaida = saida.value;
    let valorTituloSaida = tituloSaida.value;
    
    //Registro das entradas
    if(selecionarOp.value == 'entrada'){
        if(valorSaida != "" && valorTituloSaida != ""){
            historico_de_entradas.titulo.push(valorTituloSaida);
            historico_de_entradas.valor.push(valorSaida);
            let index = generateId();
            historico_de_entradas.id.push(index);
            historico_geral.id.push(index);
            historico_geral.html_.push(`<tr class="entrada-cor" id="${index}"><td>${valorTituloSaida}</td><td>R$${valorSaida}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${valorSaida}" onclick="deletar(this)"></i></td></tr>`);
            tabelaDespesas.insertAdjacentHTML('afterbegin', `<tr class="entrada-cor" id="${index}"><td>${valorTituloSaida}</td><td>R$${valorSaida}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${valorSaida}" onclick="deletar(this)"></i></td></tr>`);
            addData2(myChart2, valorSaida, selecionarOp.value);
        }else{
            alert("Preencha todos os valores!");
        }//Registro das Saídas
    }else if(selecionarOp.value == 'saida'){
        if(valorSaida != "" && valorTituloSaida != ""){
            historico_de_saidas.titulo.push(valorTituloSaida);
            historico_de_saidas.valor.push(valorSaida);
            let index = generateId();
            historico_de_saidas.id.push(index);
            historico_geral.id.push(index);
            historico_geral.html_.push(`<tr class="saida-cor" id="${index}"><td>${valorTituloSaida}</td><td>R$${valorSaida}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${valorSaida}" onclick="deletar(this)"></i></td></tr>`);
            tabelaDespesas.insertAdjacentHTML('afterbegin', `<tr class="saida-cor" id="${index}"><td>${valorTituloSaida}</td><td>R$${valorSaida}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${valorSaida}" onclick="deletar(this)"></i></td></tr>`);
            addData(myChart, valorTituloSaida, valorSaida);
            addData2(myChart2, valorSaida, selecionarOp.value);
        }else{
            alert("Preencha todos os valores!");
        }
    }
    
    salvarLocal();

    somarValores();

    document.getElementById("entradas-e-saidas").style.display = "none";
}

function editar(edt){
    let edtPai = edt.parentElement;
    let edtVo = edtPai.parentElement;

    console.log(edtVo);

    document.getElementById("bttn1").insertAdjacentHTML('afterend',`
        <div id="entradas-e-saidas-edt">
            <select name="select" id="op-edt">
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
            </select>
            <p>Título:</p>
            <select id="titulo-saida-edt">
                <option value="Assinaturas">Assinaturas e serviços</option>
                <option value="Casa">Casa</option>
                <option value="Compras">Compras</option>
                <option value="Dívidas">Dívidas e empréstimos</option>
                <option value="Educação">Educação</option>
                <option value="Família">Família e filhos</option>
                <option value="Saúde">Saúde</option>
                <option value="Mercado">Mercado</option>
                <option value="Transporte">Transporte</option>
                <option value="Investimento">Investimento</option>
                <option value="Impostos">Impostos</option>
                <option value="Outros">Outros</option>
            </select>
            <p>Valor:</p>
            <input type="number" id="saida-edt"><br><br>
            <button onclick="mostrarId(${edtVo.id})">Confirmar</button>
        </div>
    `)
}

function mostrarId(idm){

    let opEdt = document.getElementById("op-edt").value;
    let tituloEdt = document.getElementById("titulo-saida-edt").value;
    let saidaEdt = document.getElementById("saida-edt").value;

    let editarGeral = historico_geral.id.indexOf(parseFloat(idm));


    if(opEdt == "entrada"){
        document.getElementById("entradas-e-saidas-edt").style.display = "none";
        historico_de_entradas.id[editarGeral] = idm;
        historico_de_entradas.titulo[editarGeral] = tituloEdt;
        historico_de_entradas.valor[editarGeral] = saidaEdt;

        historico_de_saidas.valor.splice(editarGeral, 1);

        document.getElementById(idm).parentElement.innerHTML = `<tr class="entrada-cor" id="${idm}"><td>${tituloEdt}</td><td>R$${saidaEdt}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${saidaEdt}" onclick="deletar(this)"></i></td></tr>`;
        historico_geral.html_[editarGeral] = `<tr class="entrada-cor" id="${idm}"><td>${tituloEdt}</td><td>R$${saidaEdt}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${saidaEdt}" onclick="deletar(this)"></i></td></tr>`;
        list_data_geral.html_[editarGeral] = `<tr class="entrada-cor" id="${idm}"><td>${tituloEdt}</td><td>R$${saidaEdt}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${saidaEdt}" onclick="deletar(this)"></i></td></tr>`;
    }else if(opEdt == "saida"){
        document.getElementById("entradas-e-saidas-edt").style.display = "none";
        historico_de_saidas.id[editarGeral] = idm;
        historico_de_saidas.titulo[editarGeral] = tituloEdt;
        historico_de_saidas.valor[editarGeral] = saidaEdt;

        historico_de_entradas.valor.splice(editarGeral, 1);

        document.getElementById(idm).parentElement.innerHTML = `<tr class="saida-cor" id="${idm}"><td>${tituloEdt}</td><td>R$${saidaEdt}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${saidaEdt}" onclick="deletar(this)"></i></td></tr>`;
        historico_geral.html_[editarGeral] = `<tr class="saida-cor" id="${idm}"><td>${tituloEdt}</td><td>R$${saidaEdt}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${saidaEdt}" onclick="deletar(this)"></i></td></tr>`;
        list_data_geral.html_[editarGeral] = `<tr class="saida-cor" id="${idm}"><td>${tituloEdt}</td><td>R$${saidaEdt}</td><td><i class="fa-solid fa-pen-to-square" onclick="editar(this)"></i> <i class="fa-solid fa-trash-can" id="${saidaEdt}" onclick="deletar(this)"></i></td></tr>`;
    }

    historico_geral.id[editarGeral] = idm;
    list_data_geral.id[editarGeral] = idm;
    

    console.log(editarGeral);


    salvarLocal();
    somarValores();
}

function deletar(del){

    let delPai = del.parentElement;
    let delVo = delPai.parentElement;
    let idElemento = del.id;
    let nomeElemento = delVo.firstChild.textContent;

    console.log(nomeElemento);


    let deletarGeral = historico_geral.id.indexOf(parseFloat(delVo.id));
    let deletarEntrada = historico_de_entradas.id.indexOf(parseFloat(delVo.id));
    let deletarSaida = historico_de_saidas.id.indexOf(parseFloat(delVo.id));


    if(delVo.className == "entrada-cor"){
        historico_de_entradas.id.splice(deletarEntrada, 1);
        historico_de_entradas.titulo.splice(deletarEntrada, 1);
        historico_de_entradas.valor.splice(deletarEntrada, 1);
    }else if(delVo.className == "saida-cor"){
        historico_de_saidas.id.splice(deletarSaida, 1);
        historico_de_saidas.titulo.splice(deletarSaida, 1);
        historico_de_saidas.valor.splice(deletarSaida, 1);
    }

    historico_geral.html_.splice(deletarGeral, 1);
    list_data_geral.html_.splice(deletarGeral, 1);

    historico_geral.id.splice(deletarGeral, 1);
    list_data_geral.id.splice(deletarGeral, 1);

    delVo.remove();
    removeData(myChart, deletarGeral, idElemento, nomeElemento);

    console.log(deletarGeral);

    salvarLocal();
    somarValores();
}

function removeData(chart, index, valor) {


    let num = myChart.data.datasets[0].data[index];

    let sub = parseFloat(num) - parseFloat(valor);

    myChart.data.datasets[0].data[index] = sub;
    cntrl = 1;
    if(sub <= 0){
        myChart.data.labels.splice(index, 1);
        myChart.data.datasets[0].data.splice(index, 1);
    }

    chart.update();
}

//Soma de valores
function somarValores(){
    let somaValorSaidas = 0;
    let somaValorEntradas = 0;
    let saldoFinal = 0;
    for(i = 0; i < historico_de_saidas.valor.length; i++){
        somaValorSaidas = parseFloat(somaValorSaidas) + parseFloat(historico_de_saidas.valor[i]);
    }

    for(l = 0; l < historico_de_entradas.valor.length; l++){
        somaValorEntradas = parseFloat(somaValorEntradas) + parseFloat(historico_de_entradas.valor[l]);
    }
        
    saldoFinal = somaValorEntradas - somaValorSaidas;

    entradasTotais.innerText = somaValorEntradas;
    despesasTotais.innerText = somaValorSaidas;
    saldoTotal.innerText = saldoFinal;
}

function generateId(){
    return Math.random() * 100 * Date.now();
}

function popup(){
    document.getElementById("entradas-e-saidas").style.display = "block";
}

function salvarLocal(){
    window.localStorage.setItem("db_hist", JSON.stringify(historico_de_saidas));
    window.localStorage.setItem("db_hist_entradas", JSON.stringify(historico_de_entradas));
    window.localStorage.setItem("db_hist_geral", JSON.stringify(historico_geral));
}

function addData(chart, label, data) {

    let controle = 0;

    for(i=0; i<myChart.data.labels.length; i++){
        if(myChart.data.labels[i] == label){
            controle = 1;
        }
    }
    if(controle == 0){
        myChart.data.labels.push(label);
        myChart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
    }else if(controle == 1){
        var indexVar = myChart.data.labels.indexOf(label);
        console.log(indexVar);
        var num = myChart.data.datasets[0].data[indexVar]
        data = parseFloat(num)+parseFloat(data);
        myChart.data.datasets.forEach((dataset) => {
            dataset.data[indexVar] = data;
        });
    }
    chart.update();
}

function addData2(chart, valor, op) {
    console.log(op);

    if(op == 'entrada'){
        myChart2.data.datasets[0].data[6] = myChart2.data.datasets[0].data[6] + parseFloat(valor);
    }else if(op=='saida'){
        myChart2.data.datasets[1].data[6] = myChart2.data.datasets[1].data[6] + parseFloat(valor);
    }

    chart.update();
}

function mostrarNome(){
    alert("teste")
    console.log("teste")
}

const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                
              ],
              datasets: [{
                label: 'My First Dataset',
                data: [],
                backgroundColor: [
                  '#C84AF7',
                  '#8540D6',
                  '#6F52ED',
                  '#404DD6',
                  '#4A87F7',
                  '#511E63',
                  '#44216E',
                  '#291E57',
                  '#21286E',
                  '#1E3663',
                  '#205A99',
                  '#1BA6A4'
                ],
                hoverOffset: 4
              }]
        }
    });


    const ctx2 = document.getElementById('myChart2').getContext('2d');
    const myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
              ],
              datasets: [{
                label: 'Entradas',
                data: [3200, 3150, 3500, 3800, 3200, 3400, 0],
                backgroundColor: [
                  'green',
                ],
                hoverOffset: 4
              },
              {
                label: 'Saídas',
                data: [2450, 3800, 2600, 2950, 3750, 3650, 0],
                backgroundColor: [
                  'red',
                ],
                hoverOffset: 4
              },
              
            ]
        }
    });

  function cngValue(){

    apoio = selecionarOp.value;

    if(apoio == 'saida'){
        tituloSaida.innerHTML = `<option value="Assinaturas">Assinaturas e serviços</option>
        <option value="Casa">Casa</option>
        <option value="Compras">Compras</option>
        <option value="Dívidas">Dívidas e empréstimos</option>
        <option value="Educação">Educação</option>
        <option value="Família">Família e filhos</option>
        <option value="Saúde">Saúde</option>
        <option value="Mercado">Mercado</option>
        <option value="Transporte">Transporte</option>
        <option value="Investimento">Investimento</option>
        <option value="Impostos">Impostos</option>
        <option value="Outros">Outros</option>`
    }else if(apoio == 'entrada'){
        tituloSaida.innerHTML = `<option value="Investimentos">Investimentos</option>
        <option value="Salário">Salário</option>
        <option value="Dividendos">Dividendos</option>
        <option value="Serviços">Serviços</option>
        <option value="Freelance">Freelance</option>
        <option value="Outros">Outros</option>`
    }

  }
