// Esta función convierte el nombre completo en un objeto con nombre y apellidos
const convertirNombre = (nombreCompleto) => {
  const partes = nombreCompleto.split(',');
  const apellidos = partes[0].trim(); // Extraigo los apellidos y elimino espacios extra
  const nombre = partes.length > 1 ? partes[1].trim() : ''; // Extraigo el nombre si existe
  return { nombre, apellidos };
}

// Esta función maneja la carga y procesamiento del archivo CSV
const manejarCargaCSV = (evento) => {
  const archivo = evento.target.files[0]; // Obtengo el archivo seleccionado
  const lector = new FileReader(); // Creo un nuevo FileReader
  const resultados = document.getElementById('nombresConvertidos'); // Selecciono el elemento donde mostraré los resultados

  lector.onload = function(e) {
      const contenido = e.target.result; // Obtengo el contenido del archivo
      const lineas = contenido.split('\n'); // Divido el contenido en líneas
      resultados.innerHTML = '';  // Limpio el contenido previo

      const tabla = document.createElement('table'); // Creo la tabla para mostrar los datos
      const thead = document.createElement('thead'); // Creo el encabezado de la tabla
      const tbody = document.createElement('tbody'); // Creo el cuerpo de la tabla
      const encabezado = document.createElement('tr'); // Creo la fila del encabezado
      const thNombre = document.createElement('th');  // Creo la celda para el nombre
      const thApellidos = document.createElement('th'); // Creo la celda para los apellidos
      thNombre.textContent = 'Nombre'; // Establezco el texto de la celda de nombre
      thApellidos.textContent = 'Apellidos'; // Establezco el texto de la celda de apellidos
      encabezado.appendChild(thNombre); // Agrego la celda de nombre a la fila del encabezado
      encabezado.appendChild(thApellidos); // Agrego la celda de apellidos a la fila del encabezado
      thead.appendChild(encabezado); // Agrego la fila del encabezado al thead
      tabla.appendChild(thead); // Agrego el thead a la tabla
      tabla.appendChild(tbody); // Agrego el tbody a la tabla
      resultados.appendChild(tabla); // Agrego la tabla al contenedor de resultados

      // Procesa cada línea del CSV
      const datosConvertidos = lineas.map(linea => {
          if (linea.trim()) { // Si la línea no está vacía
              const { nombre, apellidos } = convertirNombre(linea); // Convierto el nombre completo a nombre y apellidos
              const fila = document.createElement('tr'); // Creo una nueva fila para la tabla
              const celdaNombre = document.createElement('td'); // Creo una celda para el nombre
              const celdaApellidos = document.createElement('td'); // Creo una celda para los apellidos
              celdaNombre.textContent = nombre; // Establezco el texto de la celda de nombre
              celdaApellidos.textContent = apellidos; // Establezco el texto de la celda de apellidos
              fila.appendChild(celdaNombre); // Agrego la celda de nombre a la fila
              fila.appendChild(celdaApellidos); // Agrego la celda de apellidos a la fila
              tbody.appendChild(fila); // Agrego la fila al tbody
              return { nombre, apellidos };  // Devuelvo el objeto con nombre y apellidos
          }
      }).filter(Boolean); // Filtro las líneas vacías

      const botonDescargar = document.createElement('button'); // Creo un botón para descargar el CSV
      botonDescargar.textContent = 'Descargar CSV'; // Establezco el texto del botón
      botonDescargar.onclick = () => descargarCSV(datosConvertidos); // Asigno la función de descarga al botón
      resultados.appendChild(botonDescargar); // Agrego el botón al contenedor de resultados
  };

  lector.readAsText(archivo, 'UTF-8'); // Leo el archivo como texto usando UTF-8
}

// Esta función convierte un array de objetos a formato CSV
const convertirA_CSV = (datos) => {
  const encabezados = Object.keys(datos[0]).join(';'); // Creo los encabezados del CSV
  const filas = datos.map(obj => Object.values(obj).map(val => `"${val}"`).join(';')).join('\n'); // Creo las filas del CSV
  return `\uFEFF${encabezados}\n${filas}`; // Agrego BOM para UTF-8 y retorno el CSV
}

// Esta función maneja la descarga del archivo CSV
const descargarCSV = (datos) => {
  const csvString = convertirA_CSV(datos); // Convierte los datos a CSV
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' }); // Creo un blob con el contenido del CSV
  const url = URL.createObjectURL(blob); // Creo un URL para el blob
  const enlace = document.createElement('a'); // Creo un enlace para la descarga
  enlace.setAttribute('href', url); // Establezco el href del enlace
  enlace.setAttribute('download', 'nombres_convertidos.csv'); // Establezco el nombre del archivo para la descarga
  enlace.style.display = 'none'; // Oculto el enlace
  document.body.appendChild(enlace); // Agrego el enlace al cuerpo del documento
  enlace.click(); // Hago clic en el enlace para iniciar la descarga
  document.body.removeChild(enlace); // Elimino el enlace del cuerpo del documento
}
// Asigno la función manejarCargaCSV al evento de cambio del input de archivo
document.getElementById('csvInput').addEventListener('change', manejarCargaCSV);
