// === SCRIPT.JS TÉRKÉP / FUNKCIÓK ===
// [FE-01] etlapBetoltes() -> Lekéri az adatokat a szerverről (kapcsolódik a server.js GET ágához)
// [FE-02] kosarba() -> Kezeli a helyi kosár változót (memóriában tárolás)
// [FE-03] kosarFrissites() -> Frissíti a HTML-t (DOM manipuláció a Bootstrap osztályokkal)
// [FE-04] rendelesLeadasa() -> Elküldi a kosarat a szervernek (kapcsolódik a server.js POST ágához)
let kosar = [];

// Étlap lekérése a szerver API-tól
async function etlapBetoltes() {
    const response = await fetch('/api/etelek');// [FE-01] GET kérés a szerverhez az ételek listájáért
    const etelek = await response.json();// Visszakapjuk az ételek listáját JSON formátumban, amit JavaScript objektummá alakítunk
    
    const kontener = document.getElementById('etlap-kontener');// A HTML-ben található konténer elem, ahová az ételeket megjelenítjük
    kontener.innerHTML = '';
// Minden ételhez létrehozunk egy kártyát a Bootstrap stílusában, és hozzáadjuk a konténerhez
    etelek.forEach(etel => {
        kontener.innerHTML += `
            <div class="col-md-6 mb-3">// Bootstrap osztályok a reszponzív megjelenéshez és a margóhoz
                <div class="card h-100 shadow-sm">// Bootstrap kártya osztályok a megjelenéshez
                    <div class="card-body text-center">// Kártya tartalma középre igazítva
                        <h5 class="card-title">${etel.nev}</h5>// Az étel neve megjelenítése a kártya címeként
                        <p class="card-text">${etel.ar} Ft</p>// Az étel ára megjelenítése a kártya szöveges részében
                        <button class="btn btn-primary" onclick="kosarba('${etel.nev}', ${etel.ar})">Kosárba +</button>// Gomb, amely a kosarba() függvényt hívja meg az étel nevével és árával, amikor rákattintanak
                    </div>
                </div>
            </div>`;
    });
}
// Kosárba helyezés és kosár frissítése
function kosarba(nev, ar) {
    kosar.push({ nev, ar });
    kosarFrissites();
}
// Kosár frissítése a HTML-ben
function kosarFrissites() {
    const lista = document.getElementById('kosar-lista');// A kosár listájának HTML eleme
    const osszesen = document.getElementById('osszesen');// A kosár összegét megjelenítő HTML elem
    lista.innerHTML = '';
    let szum = 0;// A kosárban lévő tételek összegzése és megjelenítése a listában
// Minden kosárban lévő tételhez hozzáadjuk az árát a szum változóhoz, és megjelenítjük a listában
    kosar.forEach((item, index) => {
        szum += item.ar;
        lista.innerHTML += `<li class="list-group-item d-flex justify-content-between">${item.nev} <span>${item.ar} Ft</span></li>`;
    });
// Ha a kosár üres, megjelenítünk egy üzenetet, és az összeg 0 lesz
    if(kosar.length === 0) lista.innerHTML = '<li class="list-group-item text-muted">Üres a kosár</li>';
    osszesen.innerText = szum;
}

// Rendelés leadása a szervernek
async function rendelesLeadasa() {
    if (kosar.length === 0) {
        alert("Üres a kosarad!");
        return;
    }

    // Elküldjük a kosár tartalmát a szervernek
    const response = await fetch('/api/rendeles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            etelek: kosar,
            osszeg: document.getElementById('osszesen').innerText
        })
    });

    const valasz = await response.json();// Válasz a szervertől, amely tartalmazhat egy üzenetet és egy státuszt
    // Ha a rendelés sikeres volt, megjelenítünk egy üzenetet, és ürítjük a kosarat
    if (valasz.statusz === "OK") {
        alert("Siker! " + valasz.uzenet);
        kosar = []; // Kosár ürítése
        kosarFrissites();
    }
}
// Oldal betöltésekor az étlap betöltése
window.onload = etlapBetoltes;
