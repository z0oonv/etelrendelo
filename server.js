const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.')); // Kiszolgálja a HTML, CSS és JS fájljainkat

let db;

// 1. Adatbázis kapcsolat és Tábla létrehozása
(async () => {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS etelek (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nev TEXT,
            ar INTEGER
        )
    `);

    // Alapadatok feltöltése, ha üres az adatbázis
    const rows = await db.all("SELECT * FROM etelek");
    if (rows.length === 0) {
        await db.run("INSERT INTO etelek (nev, ar) VALUES ('Margherita Pizza', 2500)");
        await db.run("INSERT INTO etelek (nev, ar) VALUES ('Sajtos Burger', 2100)");
        await db.run("INSERT INTO etelek (nev, ar) VALUES ('Cézár Saláta', 1900)");
        console.log("Adatbázis alapértelmezett ételekkel feltöltve.");
    }
})();

// 2. API végpont: Ételek listázása (GET)
app.get('/api/etelek', async (req, res) => {
    try {
        const etelek = await db.all("SELECT * FROM etelek");
        res.json(etelek);
    } catch (err) {
        res.status(500).json({ hiba: "Nem sikerült lekérni az ételeket" });
    }
});

// 3. API végpont: Rendelés leadása (POST)
app.post('/api/rendeles', (req, res) => {
    const rendeles = req.body;
    console.log("Rendelés érkezett a szerverre:", rendeles);
    res.json({ uzenet: "Rendelésedet rögzítettük az adatbázisban!", statusz: "OK" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Szerver elindult: http://localhost:${PORT}`);
});