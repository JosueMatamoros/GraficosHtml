// script.js

// Agrega un event listener al campo de fecha
document.getElementById("datepicker").addEventListener("change", function() {
  // Llama a la función para dibujar la temperatura cuando la fecha cambia
  drawTemperaturePerDay();
});

google.charts.load("current", {
  packages: ["corechart"],
});

flatpickr("#datepicker", {
  enableTime: false,
  dateFormat: "Y-m-d",
  minDate: "2023-09-27",
});

function drawCelsiusChart() {
  drawChart("matriz_celsius.json", "Temperaturas por Día (Celsius)", "Celsius");
}

function drawFahrenheitChart() {
  drawChart(
    "matriz_fahrenheit.json",
    "Temperaturas por Día (Fahrenheit)",
    "Fahrenheit"
  );
}

function drawChart(dataFile, chartTitle, yAxisTitle) {
  // Realizar una solicitud HTTP para cargar los datos desde el archivo JSON
  fetch(dataFile)
    .then((response) => response.json())
    .then((jsonData) => {
      // Convertir la matriz en un DataTable
      var data = google.visualization.arrayToDataTable(jsonData);

      var options = {
        title: chartTitle,
        vAxis: {
          title: yAxisTitle,
        },
        hAxis: {
          title: "Día",
        },
        seriesType: "bars",
        series: {
          5: {
            type: "line",
          },
        },
      };

      // Seleccionar el elemento HTML donde se renderizará el gráfico
      var chart = new google.visualization.ComboChart(
        document.getElementById("chart_div")
      );

      // Dibujar el gráfico con los datos y opciones
      chart.draw(data, options);
    })
    .catch((error) => console.error("Error al cargar los datos:", error));
}

function drawTemperaturePerDay() {
  // Obtener el elemento input por su ID
  var datepickerInput = document.getElementById("datepicker");

  // Obtener el valor ingresado
  var fechaIngresada = datepickerInput.value;

  // Realizar una solicitud fetch para obtener el archivo JSON
  fetch('matriz.json')
    .then(response => response.json())
    .then(jsonObject => {
      // Verifica si jsonObject es un objeto
      if (
        typeof jsonObject !== "object" ||
        jsonObject === null ||
        Array.isArray(jsonObject)
      ) {
        console.error("El contenido del archivo no es un objeto.");
        return;
      }

      // Obtén la información para la fecha seleccionada
      const infoForDate = jsonObject[fechaIngresada];

      // Muestra la información en la consola
      if (infoForDate) {
        // Inicializa la DataTable
        var data = new google.visualization.DataTable();
        data.addColumn("timeofday", "Hora");
        data.addColumn("number", "C");
        data.addColumn("number", "F");

        // Ordena las horas ('00' al '23')
        const sortedHours = Object.keys(infoForDate).sort();

        // Crea un array para las filas de la DataTable
        const dataTableRows = sortedHours.map((hour) => {
          const celcius = infoForDate[hour][0];
          const fahrenheit = infoForDate[hour][1];
          return [{ v: [parseInt(hour), 0, 0], f: `${hour} am` }, celcius, fahrenheit];
        });

        // Agrega las filas a la DataTable
        data.addRows(dataTableRows);

        // Configuración del gráfico
        var options = {
          title: `Temperatura por hora del día - ${fechaIngresada}`,
          focusTarget: "category",
          hAxis: {
            title: "Hora",
            format: "h:mm a",
            textStyle: {
              fontSize: 14,
              color: "#053061",
              bold: true,
              italic: false,
            },
            titleTextStyle: {
              fontSize: 18,
              color: "#053061",
              bold: true,
              italic: false,
            },
          },
          vAxis: {
            title: "Rating (scale of 1-10)",
            textStyle: {
              fontSize: 18,
              color: "#67001f",
              bold: false,
              italic: false,
            },
            titleTextStyle: {
              fontSize: 18,
              color: "#67001f",
              bold: true,
              italic: false,
            },
          },
        };

        // Inicializa el gráfico
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div")
        );

        // Dibuja el gráfico con los datos dinámicos
        chart.draw(data, options);
      } else {
        console.log(`No hay información para la fecha ${fechaIngresada}.`);
      }
    })
    .catch(error => {
      console.error('Error al obtener el archivo JSON:', error);
    });
}
