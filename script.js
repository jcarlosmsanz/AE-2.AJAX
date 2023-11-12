// VALIDAR FORMULARIO ANTES DE ENVIARLO

function validarFormulario() {
  // Obtener los valores ingresados en los campos del formulario.
  var nombre = document.getElementById("nombre").value;
  var direccion = document.getElementById("direccion").value;
  var telefono = document.getElementById("telefono").value;
  var email = document.getElementById("email").value;

  // Inicializar banderas para verificar la selección de tamaño e ingredientes.
  var tamanoSeleccionado = false;
  var ingredientesSeleccionados = false;

  // Obtener los elementos de radio con el nombre "tamano" para verificar si se seleccionó uno.
  var tamano = document.getElementsByName("tamano");
  for (var i = 0; i < tamano.length; i++) {
    if (tamano[i].checked) {
      tamanoSeleccionado = true;
      break;
    }
  }

  // Verificar si al menos un ingrediente está seleccionado.
  var ingredientes = document.getElementsByName("ingredientes[]");
  for (var i = 0; i < ingredientes.length; i++) {
    if (ingredientes[i].checked) {
      ingredientesSeleccionados = true;
      break;
    }
  }

  // Realizar validaciones y mostrar alertas en caso de campos faltantes.
  if (nombre === "" || direccion === "" || telefono === "" || email === "") {
    alert("Por favor, complete el formulario");
    return false;
  } else if (!tamanoSeleccionado) {
    alert("Por favor, seleccione un tamaño de pizza");
    return false;
  } else if (!ingredientesSeleccionados) {
    alert("Por favor, seleccione al menos un ingrediente");
    return false;
  }

  // Si todas las validaciones son correctas, se permite el envío del formulario.
  return true;
}

//===================================================================================

// CALCULAR PRECIO TOTAL

function calcularPrecio() {
  // Realiza una solicitud AJAX para obtener los precios desde el servidor
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "precios.json", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      var precios = JSON.parse(xhr.responseText);

      // Selecciona el elemento HTML con el atributo 'name' igual a "tamano" y que esté marcado como "checked".
      const tamano = document.querySelector('input[name="tamano"]:checked');

      // Selecciona todos los elementos HTML con el atributo 'name' igual a "ingredientes[]" que estén marcados como "checked".
      const ingredientes = document.querySelectorAll(
        'input[name="ingredientes[]"]:checked'
      );

      // Comprobar si se ha seleccionado un tamaño y al menos un ingrediente.
      if (tamano && ingredientes.length > 0) {
        let precioBase = precios.tamanos[tamano.value];

        // Calcula el precio de los ingredientes seleccionados, que es igual al número de ingredientes marcados.
        const precioIngredientes =
          ingredientes.length * precios.precioIngrediente;

        // Calcula el precio total sumando el precio base y el precio de los ingredientes.
        const precioTotal = precioBase + precioIngredientes;

        // Actualiza el contenido del elemento con el ID "precioTotal" en el HTML con el precio total calculado y lo muestra en euros.
        document.getElementById("precioTotal").textContent = precioTotal + "€";
      } else {
        // Si no se seleccionó un tamaño o no se seleccionaron ingredientes, muestra una alerta.
        alert("Debe seleccionar un tamaño de pizza y al menos un ingrediente.");
      }
    } else {
      console.error("Error al cargar los datos de precios desde el servidor.");
    }
  };

  xhr.send();
}

//========================================================================================

//CARGAR LOS DATOS DE JSON

function cargarDatos() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "datos.json", true);

  xhr.onload = function () {
    if (xhr.status === 200 && xhr.readyState === 4) {
      var data = JSON.parse(xhr.responseText); //convierte el texto a JSON y lo almacena en 'data'

      // CARGAR TAMAÑOS
      var tamanoContainer = document.getElementById("tamanos-container"); //almacena 'tamanoContainer' en el <div> "tamanos-container"

      //Recorre 'tamanos' creando un radioInput y un label con cada tamaño que encuentr
      data.tamanos.forEach(function (tamano) {
        var radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.id = tamano;
        radioInput.name = "tamano";
        radioInput.value = tamano;
        var label = document.createElement("label");
        label.htmlFor = tamano;
        label.textContent = tamano.charAt(0).toUpperCase() + tamano.slice(1); // Capitalizar la primera letra
        tamanoContainer.appendChild(radioInput);
        tamanoContainer.appendChild(label);
        tamanoContainer.appendChild(document.createElement("br"));
      });

      // Cargar ingredientes dinámicamente
      var ingredientesContainer = document.getElementById("ingredientes-container");
      data.ingredientes.forEach(function (ingrediente) {
        var checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.id = ingrediente;
        checkboxInput.name = "ingredientes[]";
        checkboxInput.value = ingrediente;
        var label = document.createElement("label");
        label.htmlFor = ingrediente;
        label.textContent =
          ingrediente.charAt(0).toUpperCase() + ingrediente.slice(1); // Capitalizar la primera letra
        ingredientesContainer.appendChild(checkboxInput);
        ingredientesContainer.appendChild(label);
        ingredientesContainer.appendChild(document.createElement("br"));
      });
    } else {
      console.error("Error al cargar los datos del servidor.");
    }
  };

  xhr.send();
}

window.onload = cargarDatos; // Llama a cargarDatos al cargar la página.

//========================================================================================

// ACTUALIZAR DATOS

function actualizarDatos() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "datos.json", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      // Eliminar los tamaños y ingredientes existentes antes de cargar los nuevos
      var tamanoContainer = document.getElementById("tamanos-container");
      tamanoContainer.innerHTML = "";
      var ingredientesContainer = document.getElementById(
        "ingredientes-container"
      );
      ingredientesContainer.innerHTML = "";

      // Cargar tamaños de pizzas dinámicamente
      data.tamanos.forEach(function (tamano) {
        var radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.id = tamano;
        radioInput.name = "tamano";
        radioInput.value = tamano;
        var label = document.createElement("label");
        label.htmlFor = tamano;
        label.textContent = tamano.charAt(0).toUpperCase() + tamano.slice(1); // Capitalizar la primera letra
        tamanoContainer.appendChild(radioInput);
        tamanoContainer.appendChild(label);
        tamanoContainer.appendChild(document.createElement("br"));
      });

      // Cargar ingredientes dinámicamente
      data.ingredientes.forEach(function (ingrediente) {
        var checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.id = ingrediente;
        checkboxInput.name = "ingredientes[]";
        checkboxInput.value = ingrediente;
        var label = document.createElement("label");
        label.htmlFor = ingrediente;
        label.textContent =
          ingrediente.charAt(0).toUpperCase() + ingrediente.slice(1); // Capitalizar la primera letra
        ingredientesContainer.appendChild(checkboxInput);
        ingredientesContainer.appendChild(label);
        ingredientesContainer.appendChild(document.createElement("br"));
      });
         // Actualizar el precio total a cero
         document.getElementById("precioTotal").textContent = "0€";
        } else {
          console.error("Error al cargar los datos del servidor.");
        }
      };

  xhr.send();
}
