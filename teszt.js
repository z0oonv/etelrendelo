// Egyszerű unit tesztek a szerver működésének ellenőrzésére
const fs = require('fs');

console.log("--- UNIT TESZTEK INDÍTÁSA ---");

// 1. Teszt: Kosár összegzés ellenőrzése
function osszegTeszt() {
    const tesztKosar = [
        { nev: "Pizza", ar: 2500 },
        { nev: "Burger", ar: 2100 }
    ];
    let szum = 0;
    tesztKosar.forEach(item => szum += item.ar);

    if (szum === 4600) {
        console.log(" Teszt 1: Kosár összegzés rendben.");
    } else {
        console.error(" Teszt 1: Hiba az összegzésnél!");
    }
}

// 2. Teszt: Adatbázis meglétének ellenőrzése
function dbTeszt() {
    if (fs.existsSync('./database.db')) {
        console.log(" Teszt 2: Adatbázis fájl létezik.");
    } else {
        console.error("Teszt 2: Adatbázis fájl nem található!");
    }
}
// Tesztek futtatása
osszegTeszt();
dbTeszt();