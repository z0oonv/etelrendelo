Online Étterem - API Dokumentáció
Ez a dokumentáció leírja a projekt backendje által biztosított végpontokat és azok használatát.

Alap URL
A helyi fejlesztői környezetben: http://localhost:3000/api

1. Étlap lekérése
Lekéri az adatbázisban tárolt összes elérhető ételt.

Végpont: /etelek

Metódus: GET

Válasz formátuma: application/json

Sikeres válasz (200 OK)
JSON
[
  {
    "id": 1,
    "nev": "Margherita Pizza",
    "ar": 2500,
    "kategoria": "Pizza"
  },
  {
    "id": 2,
    "nev": "Bolognai Spagetti",
    "ar": 2800,
    "kategoria": "Tészta"
  }
]
2. Rendelés leadása
Új rendelést rögzít az adatbázisban és a naplófájlban.

Végpont: /rendeles

Metódus: POST

Válasz formátuma: application/json

Kérés törzse (Request Body)
JSON
{
  "etelek": [
    {"id": 1, "nev": "Margherita Pizza", "mennyiseg": 2},
    {"id": 2, "nev": "Bolognai Spagetti", "mennyiseg": 1}
  ],
  "osszeg": 7800
}
Sikeres válasz (200 OK)
JSON
{
  "üzenet": "Rendelés sikeresen mentve!",
  "rendelesId": 42
}
 Hiba válasz (400 Bad Request)
Ha a küldött adatok hiányosak vagy a rendelési lista üres.

JSON
{
  "hiba": "Érvénytelen rendelési adatok!"
}
Biztonsági jellemzők
SQL Injection elleni védelem: Minden adatbázis-művelet paraméterezett lekérdezésekkel (Prepared Statements) történik.

Szerveroldali validálás: A szerver ellenőrzi az adatok meglétét és formátumát a feldolgozás előtt.

Naplózás: Minden POST kérés után a rendszer automatikusan rögzíti az eseményt a rendelesek.log fájlba.