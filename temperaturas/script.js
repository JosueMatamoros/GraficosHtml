// script.js

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

function drawTemperaturePerDay() {
  // Obtener el elemento input por su ID
  var datepickerInput = document.getElementById("datepicker");

  // Obtener el valor ingresado
  var fechaIngresada = datepickerInput.value;
  
  var data = new google.visualization.DataTable();
  data.addColumn("timeofday", "Hora");
  data.addColumn("number", "Celcius");
  data.addColumn("number", "Fahrenheit");

  data.addRows([
    [{ v: [8, 0, 0], f: "8 am" }, 1, 8],
    [{ v: [9, 0, 0], f: "9 am" }, 2, 4],
    [{ v: [10, 0, 0], f: "10 am" }, 3, 1],
    [{ v: [11, 0, 0], f: "11 am" }, 4, 2.25],
    [{ v: [12, 0, 0], f: "12 pm" }, 5, 2.25],
    [{ v: [13, 0, 0], f: "1 pm" }, 6, 3],
    [{ v: [14, 0, 0], f: "2 pm" }, 7, 4],
    [{ v: [15, 0, 0], f: "3 pm" }, 8, 5.25],
    [{ v: [16, 0, 0], f: "4 pm" }, 9, 7.5],
    [{ v: [17, 0, 0], f: "5 pm" }, 10, 10],
  ]);

  var options = {
    title: "Temperatura por hora del día",
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

  var chart = new google.visualization.ColumnChart(
    document.getElementById("chart_div")
  );
  chart.draw(data, options);
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

