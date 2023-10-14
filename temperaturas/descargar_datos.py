import os
import firebase_admin
from firebase_admin import credentials, db

# Obtiene la ruta del script actual
current_dir = os.path.dirname(os.path.realpath(__file__))

# Configura las credenciales con el archivo JSON en la misma carpeta que el script
cred = credentials.Certificate(os.path.join(current_dir, 'credenciales.json'))
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://temperatura-bdc35-default-rtdb.firebaseio.com/'
})

# Obtiene una referencia a la base de datos
ref = db.reference('/')

# Lee datos de la base de datos
datos_firebase = ref.get()
# Convierte los datos a una matriz
titulos = ['Dia', '6 AM', '9 AM', '12 MD', '3 PM', '6 PM', '%']
matriz_datos = []
matriz_fahrenheit = []
matriz = {}
matriz_datos.append(titulos)
matriz_fahrenheit.append(titulos)


for fecha, horas in datos_firebase['Temperature'].items():
    fila = [fecha]
    fila_fahrenheit = [fecha]
    fila_matriz = [fecha]
    matriz[fecha] = {}
    promedioCelcius = 0
    promediofahrenheit = 0
    for hora, datos_hora in horas.items():
        matriz[fecha][hora] = datos_hora["celcius"], datos_hora["farenheit"]

        if hora == "06" or hora == "09" or hora == "12" or hora == "15" or hora == "18":
            fila.extend([datos_hora['celcius']])
            fila_fahrenheit.extend([datos_hora['farenheit']])
            promedioCelcius += datos_hora['celcius']
            promediofahrenheit += datos_hora['farenheit']

    fila.extend([promedioCelcius/5])
    fila_fahrenheit.extend([promediofahrenheit/5])
    matriz_datos.append(fila)
    matriz_fahrenheit.append(fila_fahrenheit)

# Crear un json con los datos
import json
with open('temperaturas/matriz_celsius.json', 'w') as file:
    json.dump(matriz_datos, file, indent=2)

with open('temperaturas/matriz_fahrenheit.json', 'w') as file:
    json.dump(matriz_fahrenheit, file, indent=2)

with open('temperaturas/matriz.json', 'w') as file:
    json.dump(matriz, file, indent=2)

print("Datos descargados exitosamente")

