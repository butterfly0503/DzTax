# dztax
DzTax e-learning application

# Jak zaktualizować kategorie na firebase?

1. pobieramy i instalujemy node.js i postępujemy zgodnie z instrukacją (https://nodejs.org/en/)
2. sprawdzamy, czy poprawnie zainstalowaliśmy node.js otwierając wiersz poleceń (cmd) i wpisując w nim **node -v**

3. wpisujemy w wierszu poleceń **npm i firebase firebase/firestore**. 


4. proces aktualizacji wygląda następująco:
    - na początku usuwamy wszystkie wpisy w firebase
    - następnie dodajemy dodatkowe wpisy

Schemat postępowania:

Otwieramy wiersz poleceń (cmd)

Przechodzimy do folderu z pytaniami w tym celu wpisujemy polecenie np. 
cd c:\users\daria\pulip\dztax\pytanie

W celu wyczyszczenia firebase będąc w katalogu z pytaniami używamy komendy *node clearFb*

Następnym krokiem jest dodanie wpisów do bazy, w tym celu używamy komendy *node populateFb*

Struktura plików musi wyglądać jak przykładowe np. matprawo i pozostałe. 

Zawsze dodając dodatkowe pytanie w kategorii pamiętajmy by ID się różniło. Jeśli utworzymy w ten sposób następną kategorię ( utworzymy nowy plik) zawsze musimy go dodać do pliku categoryList zgodnie z tym schematem, który już tam jest np.(const zrodla = require("./zrodla");) 

Dodając kategorię do tego pliku również musimy pamiętać o tym, by ID się różniło (ID moga być kolejnymi liczbami naturalnymi).

W razie dodatkowych pytań proszę o kontakt poprzez Skype.



