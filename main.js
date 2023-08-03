/* Inicializando variáveis */
const num_entradas = 4;
const nome_entradas = ['Caminhão','ônibus','Carro','Moto'];
let entradas = [
  [1,0,0,1,1,0],
  [1,0,1,0,1,0],
  [0,0,0,0,1,1],
  [0,1,0,0,0,1]
];

const num_sinapses = 6;
let sinapses = [
  [1,1,0,0,1,1],
  [0,0,0,1,1,1],
  [1,1,1,0,0,0],
  [1,0,0,0,0,1]
];

let erros_epoca = [0, 0, 0, 0];
let sinapse_antiga_aux = [];
let erro_total = 9999;
let cont = 0;

const prompt = require('prompt-sync')();
let opcao = 0;

do {
  console.log('Você deseja [1]Treinar, [2]Testar, [3]Sair:');
  opcao = prompt('Escolha:');
  console.log(opcao);

  if(opcao == 1)
    treinamento();
  if(opcao == 2)
    teste();
} while (opcao != 3)

function teste() 
{
  let entrada_teste = [];
  console.log('|-----------------------------------------|');
  console.log('Entre com a sequencia a ser analisada:')
  for(let i = 0; i < num_sinapses; i++)
  {
    entrada_teste[i] = prompt('');
  }
  console.log('|--------------Entrada Processada--------------|');

  let resultado = processarEntradaTeste(entrada_teste);
  console.log('Entrada Processada:');
  console.log(entrada_teste);
  console.log('|-------------- Resultado --------------|');
  console.log(nome_entradas[resultado]);

}

function processarEntradaTeste(vetor)
{
  
  processarVetor(vetor, num_sinapses);
  let maior_v = 0;
  let sinapse_vencedora = 0;

  sinapses.forEach(sinapse => {
    v = multiplicarVetores(vetor, sinapse);
    if(v > maior_v)
    {
      maior_v = v;
      const indice = sinapses.indexOf(sinapse);
      sinapse_vencedora = indice;
    }
  });

  return sinapse_vencedora;
}


function treinamento() 
{
 
  sinapses.forEach(sinapse => {
    processarVetor(sinapse, num_sinapses);
  });
 
  console.log('|----------------Sinapses Processadas----------------|');
  
  do { 
    
    for(let neuronio = 0; neuronio < num_entradas; neuronio++)
    {
    
      console.log('|---------------- '+ neuronio +' ----------------|');
      let sinapse_vencedora = processarEntrada(neuronio);
      console.log('|----------------Neurônio vencedor----------------|');
      console.log(sinapse_vencedora);
      autalizarSinapse(sinapse_vencedora, entradas[neuronio]);
      console.log('|---------------- Erros da época ----------------|');
      calcularErroIndividual(sinapses[sinapse_vencedora], neuronio);
      console.log(erros_epoca);
      
    }
    erro_total = calcularErroTotal();
    console.log('erro da geração = '+erro_total);
    console.log('Geração = ' + cont);
    console.log('-------------------------');

    cont++;
  } while (cont < 200);
}

function processarVetor(vetor, num)
{
  let soma = 0;

  vetor.forEach(peso => {
    soma = soma + peso;
  });

  soma = Math.sqrt(soma);

  for(let i = 0; i < num; i++) 
  {
    vetor[i] = vetor[i] / soma;
  }
}

function processarEntrada(index)
{

  processarVetor(entradas[index], num_sinapses);
  let maior_v = 0;
  let sinapse_vencedora = 0;

  sinapses.forEach(sinapse => {
    v = multiplicarVetores(entradas[index], sinapse);

    if(v > maior_v)
    {
      maior_v = v;
      const indice = sinapses.indexOf(sinapse);
      sinapse_vencedora = indice;
    }
  });

  return sinapse_vencedora;
}

function multiplicarVetores(vetor_1, vetor_2)
{
  let resultado = 0;

  vetor_1.forEach((elemento, index) => {
    resultado = resultado + (elemento * vetor_2[index]);
  });

  return resultado;
}

function autalizarSinapse(index, entrada_atual)
{
  let numerador = [];
  let denominador = 0;

  for(let i = 0; i < num_sinapses; i++)
  {
    numerador[i] = (entrada_atual[i] - sinapses[index][i])*0.5;
    numerador[i] = numerador[i] + sinapses[index][i];

    denominador = denominador + (numerador[i] * numerador[i]);
  }

  denominador = Math.sqrt(denominador);

  for(let i = 0; i < num_sinapses; i++)
  {
    sinapse_antiga_aux[i] = sinapses[index][i];
    sinapses[index][i] = numerador[i] / denominador;
  }
}

function calcularErroIndividual(sinapse_nova, neuronio)
{
  let aux = [];
  let soma = 0;
  for(let i = 0; i < num_sinapses; i++)
  {
    aux[i] = sinapse_nova[i] - sinapse_antiga_aux[i];
    aux[i] = aux[i] * aux[i];
    soma = soma + aux[i];
  }

  erros_epoca[neuronio] = Math.sqrt(soma);
}

function calcularErroTotal()
{
  let soma = 0;

  erros_epoca.forEach(erro => {
    soma = soma + erro;
  });

  return (soma / num_entradas);
}