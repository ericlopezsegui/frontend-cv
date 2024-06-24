# Project documentation
En aquest arxiu farem una explicació de com funciona i com hem implementat el frontend. 

# Estructura
El frontend segueix la següent estructura:
Un arxiu index.html on es crida l'arxiu main.jsx que és l'arxiu encarregat de mostrar cada element.

Després hi ha la carpeta src, que conté cada arxiu .jsx amb la implementació de cada element (Activities, Grades, Users, ...).
La implementació de les activities, les subjects, i els users consta de un arxiu per mostrar tot el contingut (que es l'arxiu que esta en plural) i un altre arxiu per mostrar un element individual (que son els arxius en singular).

Després tenim l'arxiu Home que es la pantalla d'inici amb un missatge de benvinguda. I finalment vam crear la carpeta components on està l'arxiu que conté la barra de navegació pero moure't pels diferents elements del campus.

