//creo el objeto para promociones
function Promocion(min,max,premio){
    this.min = min;
    this.max = max;
    this.premio = premio;
}

//creo unas promos
const promo1 = new Promocion(1000,10000, "Viaje a Mar del Plata");
const promo2 = new Promocion(10000,100000, "Viaje a Brasil");
const promo3 = new Promocion(100000,1000000000, "Viaje al Caribe");
//armo una lista de promos
const listaDePromos = [promo1,promo2,promo3];


//creo objeto Cliente
function Cliente(nombre, mail, telefono, monto, interes, cuotas){
    this.nombre = nombre;
    this.mail = mail;
    this.telefono = telefono;
    this.monto = monto;
    this.interes = interes;
    this.cuotas = cuotas;
}
//creo Lista vacia de Clientes
const Clientes = [];

//funcion para calcular interes
function CalcularInteres(interes){
    return ((interes / 100) / 12);
}

//funcion para calcular el prestamos
function CalcularPrestamo(valorSolicitado, interes, meses) {
    return (valorSolicitado * (interes / (1 - Math.pow(1 + interes, -meses))));
}

// Funcion para encontrar el premio correspondiente al monto ingresado
function Sorteo(monto){

    let premio = 'Sin premio';
    
    for (const promo of listaDePromos) {
            if (monto >= promo.min && monto < promo.max) {
                premio = promo.premio;
                return premio;
            }
    }
}

//-------------------------------------------------------------------------------------------------------
//BOTON CALCULAR
//Creo evento a la espera de que le haga clic al boton Calcular
let botonCalular = document.getElementById("btnCalcular");


botonCalular.addEventListener('click', ()=>{
    //valido si ingreso datos antes de calcular el prestamo
    const principal = parseInt(document.getElementById('principal').value);
    const interest = parseInt(document.getElementById('interest').value);
    const meses = parseInt(document.getElementById('months').value);

    if (principal && interest && meses) {
        Prestamo()
    }
})

function Prestamo(){
// Obtener los valores del formulario
const principal = parseInt(document.getElementById('principal').value);
const interest = parseInt(document.getElementById('interest').value);
const meses = parseInt(document.getElementById('months').value);

//llamado de funciones
const interes = CalcularInteres(interest);
const montoMensual = CalcularPrestamo(principal,interes,meses);
const premioSorteo = Sorteo(principal);

// Mostrar el resultado
document.getElementById('result').textContent = `Pago mensual: $${montoMensual.toFixed(2)}`;
document.getElementById('premio').textContent = `Con este prestamos participas en el sorteo de un ${premioSorteo}`;
}



//-------------------------------------------------------------------------------------------------------
//
function AgregarCliente(){
// Obtener los valores del formulario
const nombre = document.getElementById('nombreCliente').value;
const mail = document.getElementById('mail').value;
const telefono = parseInt(document.getElementById('telefono').value);
// Obtener los valores del formulario
const monto = parseInt(document.getElementById('principal').value);
const interes = parseInt(document.getElementById('interest').value);
const cuotas = parseInt(document.getElementById('months').value);

const clienteNuevo = new Cliente(nombre,mail,telefono,monto,interes,cuotas);

Clientes.push(clienteNuevo);

guardarDatosEnLocalStorage(Clientes)

// Mostrar que se agrego cliente
Toastify({
    text: `Se agrego el Cliente ${nombre}`,
    duration: 3000
    }).showToast();

//una vez que guardo los datos reseteo el formulario
const form = document.querySelector('#formulario');
form.reset();

}

function guardarDatosEnLocalStorage(datos) {
    localStorage.setItem('datosTabla', JSON.stringify(datos));
  }

//-------------------------------------------------------------------------------------------------------
//BOTON MOSTRAR
//Creo evento a la espera de que le haga clic al boton Mostrar Listado
let botonMostrar = document.getElementById("btnMostrar");
botonMostrar.addEventListener("click", MostrarListado);


function MostrarListado() {

    var datos = JSON.parse(localStorage.getItem('datosTabla')) || [];
    var tablaExistente = document.getElementById('table-clientes');

    //verifico si existe la tabla, si existe la borro
    if (tablaExistente) {
        document.getElementById("tablaClientes").removeChild(tablaExistente)
    }

    // Crear la tabla
    var tabla = document.createElement('table');
    tabla.id = 'table-clientes';

    // Crear la fila de encabezados
    var encabezados = document.createElement('tr');
    for (var clave in datos[0]) {
        var th = document.createElement('th');
        th.textContent = clave.charAt(0).toUpperCase() + clave.slice(1); 
        encabezados.appendChild(th);
      }
    tabla.appendChild(encabezados);

    // Agregar filas de datos
    datos.forEach(function(fila) {
        var tr = document.createElement('tr');
        for (var clave in fila) {
            var td = document.createElement('td');
            td.textContent = fila[clave];
            tr.appendChild(td);
        }
    tabla.appendChild(tr);
    });

  // Agregar la tabla al cuerpo del documento
  document.getElementById("tablaClientes").appendChild(tabla);

}

//-------------------------------------------------------------------------------------------------------
//Muestro la cotizacion del dolar

const urlDOlarOficial = "https://dolarapi.com/v1/dolares/oficial"
const urlDOlarBlue = "https://dolarapi.com/v1/dolares/blue"

mostrarDolar(urlDOlarOficial, 'cuadroDolar1')
mostrarDolar(urlDOlarBlue, 'cuadroDolar2')

function mostrarDolar(url, id){
    fetch(url)
        .then(response => response.json())
        .then(data => {
         var cuadroDolar = document.getElementById(id);
            cuadroDolar.innerHTML = `
            <h2>Dolar ${data.nombre}</h2>
            <p>Moneda: ${data.moneda}</p>
            <p>Compra: ${data.compra}</p>
            <p>Venta: ${data.venta}</p>
            `;
         });
}


//-------------------------------------------------------------------------------------------------------
//VALIDACION DE FORMULARIO
//BOTON AGREGAR

const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

window.addEventListener('load', ()=>{
    const form = document.querySelector('#formulario');
    const nombre = document.getElementById('nombreCliente');
    const mail = document.getElementById('mail');
    const telefono = document.getElementById('telefono');

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        validarCampos()
    })

//valido todos los campos de Cliente antes de agregarUsuario
function validarCampos(){
    //capturamos los valores ingresados
    const nombreValor = nombre.value;
    const mailValor = mail.value;
    const telefonoValor = telefono.value;
    var nombreValid=false;
    var mailValid=false;
    var telefonoValid=false;

    //valido en campo de nombre
    (!validaNombre(nombreValor)) ? validaFalla(nombre, 'Escribe un nombre') : (nombreValid = validaOk(nombre))
    
    //valido en campo de mail
    if(!mailValor){
            validaFalla(mail, 'Campo vacío')            
        }else if(!validaEmail(mailValor)) {
            validaFalla(mail, 'El e-mail no es válido')
        }else {
            mailValid = validaOk(mail)
        }
    
    //valido en campo de telefono
    if (!telefonoValor) {
            validaFalla(telefono, 'Campo vacío') 
    } else if (isNaN(telefonoValor)) {
            validaFalla(telefono, 'Telefono no valido') 
    } else {
        telefonoValid = validaOk(telefono)
    }

    if (nombreValid && mailValid && telefonoValid) {
       //si llego aca es porque todo los campos son correctos
       //Si esta todo validado entonces agrero el cliente nuevo
        AgregarCliente();
    }
        
}

})

const validaFalla = (input, mensaje) => {
    const formControl = input.parentElement
    const aviso = formControl.querySelector('p')
    aviso.innerText = mensaje

    formControl.className = 'form-control falla'
}
const validaOk = (input) => {
    const formControl = input.parentElement
    formControl.className = 'form-control ok'
    return true;
}

const validaNombre = (nombr) => {
    const nombrecompleto = nombr.replace(/\s/g, "");;//le quito espacios al nombre
    return /^[A-Za-z]+$/.test(nombrecompleto);
}
const validaEmail = (mail) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail);        
}