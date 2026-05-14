// server.js - API SZERVER
// [BE-01] Étlap lekérése: 30-45. sor
// [BE-02] Rendelés mentése: 50-70. sor
const express = require('express'); //Meghívja az express keretrendszert.
const sqlite3 = require('sqlite3');//SQLite adatbázis kezelő könyvtár.
const { open } = require('sqlite');//Segít megnyitni az SQLite adatbázist aszinkron módon.
const path = require('path');//Segít fájl- és könyvtárútvonalak kezelésében.
const fs = require('fs');//Fájlrendszer műveletekhez, például naplózás.
const app = express(); //Létrehozza az express alkalmazást.
app.use(express.json());
app.use(express.static('public')); 

let db;
// Az adatbázis inicializálása és a szerver indítása csak akkor történik meg, ha az adatbázis sikeresen létre lett hozva és feltöltve.
//  Ez biztosítja, hogy a szerver csak akkor indul el, ha minden szükséges erőforrás rendelkezésre áll.
(async () => {
    try {
        // 1. Kapcsolódás az adatbázishoz
        db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });

        // 2. Tábla létrehozása etelek néven, ha még nem létezik
        await db.exec(`
            CREATE TABLE IF NOT EXISTS etelek (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nev TEXT,
                ar INTEGER
            )
        `);
        // 3. tábla létrehozása rendelések néven, ha még nem létezik
        await db.exec(`
            CREATE TABLE IF NOT EXISTS rendelesek (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                etelek TEXT,
                osszeg INTEGER
            )
        `);


        // 4. Alapadatok feltöltése
        const rows = await db.all("SELECT * FROM etelek");
        if (rows.length === 0) {
            await db.run("INSERT INTO etelek (nev, ar) VALUES ('Margherita Pizza', 2500)");
            await db.run("INSERT INTO etelek (nev, ar) VALUES ('Sajtos Burger', 2100)");
            await db.run("INSERT INTO etelek (nev, ar) VALUES ('Cézár Saláta', 1900)");
            console.log("Adatbázis alapértelmezett ételekkel feltöltve.");
        }

        // 5. CSAK MOST indítjuk el a szervert, ha az adatbázis kész
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Szerver elindult és az adatbázis kész: http://localhost:${PORT}`);
        });
// Ha bármilyen hiba történik az inicializálás során, azt itt kezeljük
// Ez megakadályozza, hogy a szerver elinduljon egy nem működő adatbázissal, és segít gyorsan azonosítani a problémákat.
    } catch (err) {
        console.error("Hiba történt az inicializálás során:", err);
    }
})();

// [BE-01] Étlap lekérése
app.get('/api/etelek', async (req, res) => {
    try {
        const etelek = await db.all("SELECT * FROM etelek");
        res.json(etelek);
    } catch (err) {
        res.status(500).json({ hiba: "Nem sikerült lekérni az ételeket" });
    }
});
// [BE-02] Rendelés mentése
app.post('/api/rendeles', async (req, res) => {
    const rendeles = req.body;

    // 1. Validálás
    if (!rendeles.etelek || rendeles.etelek.length === 0) {
        return res.status(400).json({ hiba: "Üres rendelést nem lehet leadni!" });
    }

    try {
        // 2. Rendelés mentése adatbázisba
        await db.run("INSERT INTO rendelesek (etelek, osszeg) VALUES (?, ?)",
            [JSON.stringify(rendeles.etelek), rendeles.osszeg]);

        // 3. Rendelési előzmények mentése fájlba
        const naploBejegyzes = {
            időpont: new Date().toISOString(),
            rendeles: rendeles.etelek,
            vegosszeg: rendeles.osszeg
        };

        fs.appendFile('rendelesek.log', JSON.stringify(naploBejegyzes) + "\n", (err) => {
            if (err) console.error("Hiba a naplózásnál:", err);
        });

        // 4. Visszajelzés a kliensnek - EZ LEGYEN AZ UTOLSÓ SOR A SIKERES ÁGON
        console.log("Rendelés mentve és naplózva:", rendeles);
        return res.json({ uzenet: "Rendelésedet rögzítettük!", statusz: "OK" });

    } catch (err) {
        console.error("Hiba a folyamat során:", err);
        if (!res.headersSent) {
            return res.status(500).json({ hiba: "Nem sikerült rögzíteni a rendelést" });
        }
    }
    // FIGYELEM: Itt már ne legyen semmi más! A függvény véget ér.
});