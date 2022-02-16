// Inicia Local Storage vazio
let objStorage = [];

if (localStorage.getItem("transactions")) {
  objStorage = JSON.parse(localStorage.getItem("transactions"));
}
// Abre menu ao clicar no hamburguer
function openSide() {
  document.getElementsByClassName("menu")[0].classList.toggle("Open");
}

// Fecha menu ao clicar no 'X'
function closeSide() {
  document.getElementsByClassName("menu")[0].classList.toggle("Open");
}

function focusSelect() {
  document.getElementById("inpt-select").focus();
}

function removeTable() {
  // Testa a quantidade de itens no objStorage
  if (
    objStorage.length > 0 &&
    window.confirm("Deseja remover todas as informações?")
  ) {
    // Remove todos os itens da tabela e do local storage quando clicado..
    for (element of document.querySelectorAll(".transacao-mercadoria")) {
      element.remove();
      localStorage.clear();
      objStorage = [];
      drawTable();
    }
    // Apos verificar a quantidade de itens no local storage emite um alert informando
    // Que não foi possivel remover os itens se a quantidade for menor ou igual a 0..
  } else if (objStorage <= 0) {
    alert(
      "Não foi possivel limpar os dados. Pois não há transações no extrato.."
    );
  }
}

// Formata para moeda local
const currencyFormat = new Intl.NumberFormat("pt-br", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});
// Adiciona os itens html
function drawTable() {
  let selectTable = document.querySelector("#trans tbody");

  let total = 0; // valor que será utilizado no calculo

  // Inicialmente remove todos os itens  da tabela para não multiplicar os itens da tabela
  // Pois e contabilizado o valor inicial + o valor no local storage + o valor que está sendo adicionado
  for (element of document.querySelectorAll(".transacao-mercadoria")) {
    element.remove();
  }
  // Testa a quantidade de itens no local storage e exibe na tabela se a quantidade for 0..
  if (objStorage.length == 0) {
    selectTable.innerHTML += `<tr class="transacao-mercadoria">  
    <td style="border:none; text-align:center; width:100%; padding-left:60px;"> Nenhuma Transação cadastrada </td> </tr>`;
  }

  // Percorre os itens do objStorage
  // Inicialmente transforma em numeros reais.
  // Após testa se o valor é um número e substitui por vazio..
  // Variavel guarda a substituição
  for (item in objStorage) {
    let valorMercadoria = parseFloat(
      objStorage[item].valorMercadoria.replace(/[^0-9]/g, "")
    );
    // Testa o valor do tipo da mercadoria é iguala compra e executa uma operação
    if (objStorage[item].tipoMercadoria == "Compra") {
      total -= valorMercadoria;
    } else {
      total += valorMercadoria;
    }

    // Adiciona uma tabela no html e pega os valores do objeto storage
    // Em seguida testa o valor do objeto storage e adiciona um sinal de mais e de menos
    // Prosseguindo converte o famor em moeda local, depois transforma o valor da mercadoria em string e substitui a virgula por ponto através do regex..
    selectTable.innerHTML += `<tr class="transacao-mercadoria">
    <td style= "padding-left: 22px;"> ${
      objStorage[item].tipoMercadoria == "Compra" ? "-" : "+"
    } &nbsp;  ${objStorage[item].nomeMercadoria}</td>
    <td class="transacao-mercadoria" style="text-align:start;"> 
    ${currencyFormat.format(
      valorMercadoria.toString().replace(/([0-9]{2})$/g, ".$1")
    )}</td>
   
     </tr>
      `;
  }

  // Nessa etapa testamos o valor do objStorage
  // Se o valor for maior do que zero realizamos o calculo estabelecido anteriormente
  // Além de aplicar as formatações para moeda local e a substituição da virgula ","por ".""
  // através do regex e do replace

  if (objStorage.length > 0) {
    selectTable.innerHTML += ` 
     <tr class="transacao-mercadoria"> <td> </td> <td> </td>  </tr>
     <tr><td class="transacao-mercadoria" style="padding-left:25px; border:none;"><strong>Total</strong></td>
     <td class="transacao-mercadoria" style="border:none; font-weight:600; text-align:end; padding-bottom:0px ">${currencyFormat.format(
       total.toString().replace(/([0-9]{2})$/g, ".$1")
     )}</td>
     </tr> 
     <tr class="transacao-mercadoria"> <td style="border:none;"> </td> <td  class="transacao-mercadoria" style= "border:none; padding: 0px 0px 35px 10px; text-align:end; "> 
     ${objStorage[item].tipoMercadoria == "Compra" ? "[Despesa]" : "[Lucro]"} 
      </td> </tr>
   `;
  }
}

// Criação da mascara para o input de valor

// Padrão de letras
// Regex "seleciona" o que não for número ou seja letras
const letterPattern = /[^0-9]/;
// Executa um evento que recebe as teclas digitadas
// Verifica se a tecla digitada corresponde a seleção do regex
// E executa o prevent.default que interrompe um evento de acontecer
// por exemplo um reload de page.. que ao utilizar é parado porém executado da mesma forma

function mask(e) {
  if (letterPattern.test(e.key)) {
    console.log(e.key);
    e.preventDefault();
    return;
  }

  // Se o valor alvo for oposto ao do elemento
  // ele irá retornar

  if (!e.target.value) return;
  valor = e.target.value.toString();
  // valor recebe valor alvo convertido para string
  valor = valor.replace(/[\D]+/g, "");
  // valor recebe valor e modifica o valor se for diferente de um numero  para vazio

  valor = valor.replace(/([0-9]{1})$/g, ",$1");
  // valor recebe valor e modifica o valor para o formato de moeda e insere uma virgula

  // Se o valor for maior ou igual a 6
  if (valor.length >= 6) {
    while (/([0-9]{4})[,|\.]/g.test(valor)) {
      valor = valor.replace(/([0-9]{1})$/g, ",$1");
      // valor recebe valor e modifica o valor para o formato de moeda e insere uma virgula antes da segunda
      // casa decimal

      valor = valor.replace(/([0-9]{3})[,|\.]/g, ".$1");
    }
  }
  e.target.value = valor;
}

// le a tabela no submit
function lertabela(e) {
  e.preventDefault();
  // selecionando  os elementos usados no submit
  let nomeMercadoriaDOM = e.target.elements["inpt-name"].value;
  let valorMercadoriaDOM = e.target.elements["inpt-valor"].value;
  let select = e.target.elements["inpt-select"];
  let tipoMercadoriaDOM = e.target.elements[select.selectedIndex].value;
  // Adicionando os elementos no objStorage
  objStorage.push({
    nomeMercadoria: nomeMercadoriaDOM,
    valorMercadoria: valorMercadoriaDOM,
    tipoMercadoria: tipoMercadoriaDOM,
  });
  // Enviando os elementos e convertendo eles em string para serem recebidos no dom..
  localStorage.setItem("transactions", JSON.stringify(objStorage));
  // Desenhando a tabela ao enviar o submit...
  drawTable();
}
// Desenhando a tabela novamente para persistir os dados na pagina mesmo depois de atualizado e fechado..
drawTable();
