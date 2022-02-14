let objStorage = [];

if (localStorage.getItem("transactions")) {
  objStorage = JSON.parse(localStorage.getItem("transactions"));
}

// function removeTable() {
//   if (window.confirm("Deseja remover todas as transações?")) {
//     for (element of document.querySelectorAll(".transacao-mercadoria")) {
//       element.remove();
//       localStorage.clear();
//       objStorage = [];
//       drawTable()
//     }
//   }
// }

function removeTable() {
  if (
    objStorage.length > 0 &&
    window.confirm("Deseja remover todas as informações?")
  ) {
    for (element of document.querySelectorAll(".transacao-mercadoria")) {
      element.remove();
      localStorage.clear();
      objStorage = [];
      drawTable();
    }
  } else if (objStorage <= 0) {
    alert(
      "Não foi possivel remover a transação, pois não há transacão cadastrada!!"
    );
  }
}

const currencyFormat = new Intl.NumberFormat("pt-br", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});
// Função que adiciona os itens na tabela..
function drawTable() {
  let selectTable = document.querySelector("#trans tbody");
  let total = 0;

  for (element of document.querySelectorAll(".transacao-mercadoria")) {
    element.remove();
  }

  //  removeElem = [...document.querySelectorAll(".transacao-mercadoria")];
  //  removeElem.forEach((element) => {
  //   element.remove();
  //  });

  if (objStorage.length == 0) {
    selectTable.innerHTML += `<tr class="transacao-mercadoria">  
    <td style="border:none; text-align:center; width:100%; padding-left:60px;"> Nenhuma Transação cadastrada </td> </tr>`;
  }

  for (item in objStorage) {
    let valorMercadoria = parseFloat(
      objStorage[item].valorMercadoria.replace(/[^0-9]/g, "")
    );

    if (objStorage[item].tipoMercadoria == "Compra") {
      total -= valorMercadoria;
    } else {
      total += valorMercadoria;
    }
    selectTable.innerHTML += `<tr class="transacao-mercadoria">
    <td style= "padding-left: 22px;"> ${
      objStorage[item].tipoMercadoria == "Compra" ? "-" : "+"
    } ${objStorage[item].nomeMercadoria}</td>
    <td class="wide-b"> 
    ${currencyFormat.format(
      valorMercadoria.toString().replace(/([0-9]{2})$/g, ".$1")
    )}</td>
   
     </tr>
      `;
  }

  if (objStorage.length > 0) {
    //  alert(total)
    selectTable.innerHTML += ` 
     <tr class="transacao-mercadoria"> <td> </td> <td> </td>  </tr>
     <tr><td class="transacao-mercadoria" style="padding-left:35px; border:none;"><strong>Total</strong></td>
     <td class="transacao-mercadoria"style= "border:none;">${currencyFormat.format(
       total.toString().replace(/([0-9]{2})$/g, ".$1")
     )}</td>
     </tr> 
     <tr class="transacao-mercadoria">  <td style="width:100%; border:none; text-align:right;position:relative; left:50px; bottom:10px"> ${
       objStorage[item].tipoMercadoria == "Compra" ? "[Despesa]" : "[Lucro]"
     }  </td> </tr>
   `;
  }

  // Other form
  //  removeElem = [...document.querySelectorAll(".transacao-mercadoria")];
  //  removeElem.forEach((element) => {
  //    element.remove();
  //  });

  // Desenha a tabela
}

function mask() {
  var elemento = document.getElementById("inpt-valor");
  var valor = elemento.value;

  valor = valor + "";
  valor = parseInt(valor.replace(/[\D]+/g, ""));
  valor = valor + "";
  valor = valor.replace(/([0-9]{2})$/g, ",$1");

  if (valor.length > 6) {
    valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
  }

  elemento.value = valor;
}

function lertabela() {
  let nomeMercadoriaDOM = document.getElementById("inpt-name").value;
  let valorMercadoriaDOM = document.getElementById("inpt-valor").value;
  let select = document.getElementById("inpt-select");
  let tipoMercadoriaDOM = select.options[select.selectedIndex].value;

  objStorage.push({
    nomeMercadoria: nomeMercadoriaDOM,
    valorMercadoria: valorMercadoriaDOM,
    tipoMercadoria: tipoMercadoriaDOM,
  });
  localStorage.setItem("transactions", JSON.stringify(objStorage));
  drawTable();
}

drawTable();
// function drawTable() {
//   let tabela = [];

//   for (item in tabela) {
//     document.querySelector("#trans tbody").innerHTML += `<tr>
//     <td> Lorem ipsum dolor sit amet consectetur</td>
//     <td class="wide-b">R$ 12.999,99</td>
//    </tr>
//   <tr> `;
//   }
// }

// drawTable();
