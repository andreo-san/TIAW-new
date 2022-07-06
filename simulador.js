var c
var i
var n
var aporte
var valorFinal = 0

function updateValues(){
    myChart2.data.datasets[0].data = [];
    myChart2.data.labels = [];
    c = document.getElementById("capital").value
    i = (document.getElementById("juros").value)/100
    n = document.getElementById("tempo").value
    aporte = document.getElementById("aporte").value

    if(aporte == ""){
      for(t = 1; t <= n; t++){
        var juros = c * (Math.pow((1 + i),t));
        myChart2.data.datasets[0].data.push(juros)
        myChart2.data.labels.push(`Ano ${t}`)
    }
    }else if(aporte != ""){
      i = i/12
      n = n * 12
      for(t2 = 0; t2 < n; t2++){
        var juros = aporte * (Math.pow((1 + i),t2));
        rendimentos.push(juros)
        if(t2%12==0){
          for(k = 0; k<rendimentos.length; k++){
            valorFinal += rendimentos[k]
          }
          myChart2.data.labels.push(`Mês ${t2}`)
          myChart2.data.datasets[0].data.push(valorFinal);
        }
      }
    }
    console.log(rendimentos)
    console.log(valorFinal)
    console.log(tempoAporte)

    myChart2.update();
}


var tempoAporte = []
var rendimentos = []
var tempo = []

const ctx2 = document.getElementById('myChart2').getContext('2d');
const myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [
            
          ],
          datasets: [{
            label: 'Montante',
            data: [],
            backgroundColor: [
              '#6F52ED',
            ],
            hoverOffset: 4
          },
        ]
    }
});