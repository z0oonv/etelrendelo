const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.')); 

let db;

(async () => {
    try {
        // 1. Kapcsolódás az adatbázishoz
        db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });

        // 2. Tábla létrehozása
        await db.exec(`
            CREATE TABLE IF NOT EXISTS etelek (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nev TEXT,
                ar INTEGER
            )
        `);

        // 3. Alapadatok feltöltése
        const rows = await db.all("SELECT * FROM etelek");
        if (rows.length === 0) {
            await db.run("INSERT INTO etelek (nev, ar) VALUES ('Margherita Pizza', 2500)");
            await db.run("INSERT INTO etelek (nev, ar) VALUES ('Sajtos Burger', 2100)");
            await db.run("INSERT INTO etelek (nev, ar) VALUES ('Cézár Saláta', 1900)");
            console.log("Adatbázis alapértelmezett ételekkel feltöltve.");
        }

        // 4. CSAK MOST indítjuk el a szervert, ha az adatbázis kész
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Szerver elindult és az adatbázis kész: http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("Hiba történt az inicializálás során:", err);
    }
})();

// API végpontok maradnak a helyükön
app.get('/api/etelek', async (req, res) => {
    try {
        const etelek = await db.all("SELECT * FROM etelek");
        res.json(etelek);
    } catch (err) {
        res.status(500).json({ hiba: "Nem sikerült lekérni az ételeket" });
    }
});

app.post('/api/rendeles', (req, res) => {
    const rendeles = req.body;
    
    // VALIDÁLÁS (Az extra 5 pontért):
    if (!rendeles.etelek || rendeles.etelek.length === 0) {
        return res.status(400).json({ hiba: "Üres rendelést nem lehet leadni!" });
    }

    console.log("Rendelés érkezett:", rendeles);
    res.json({ uzenet: "Rendelésedet rögzítettük!", statusz: "OK" });
});