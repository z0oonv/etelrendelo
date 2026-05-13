// === SCRIPT.JS TÉRKÉP / FUNKCIÓK ===
// [FE-01] etlapBetoltes() -> Lekéri az adatokat a szerverről (kapcsolódik a server.js GET ágához)
// [FE-02] kosarba() -> Kezeli a helyi kosár változót (memóriában tárolás)
// [FE-03] kosarFrissites() -> Frissíti a HTML-t (DOM manipuláció a Bootstrap osztályokkal)
// [FE-04] rendelesLeadasa() -> Elküldi a kosarat a szervernek (kapcsolódik a server.js POST ágához)
let kosar = [];

// Étlap lekérése a szerver API-tól
async function etlapBetoltes() {
    const response = await fetch('/api/etelek');
    const etelek = await response.json();
    
    const kontener = document.getElementById('etlap-kontener');
    kontener.innerHTML = '';

    etelek.forEach(etel => {
        kontener.innerHTML += `
            <div class="col-md-6 mb-3">
                <div class="card h-100 shadow-sm">
                    <div class="card-body text-center">
                        <h5 class="card-title">${etel.nev}</h5>
                        <p class="card-text">${etel.ar} Ft</p>
                        <button class="btn btn-primary" onclick="kosarba('${etel.nev}', ${etel.ar})">Kosárba +</button>
                    </div>
                </div>
            </div>`;
    });
}

function kosarba(nev, ar) {
    kosar.push({ nev, ar });
    kosarFrissites();
}

function kosarFrissites() {
    const lista = document.getElementById('kosar-lista');
    const osszesen = document.getElementById('osszesen');
    lista.innerHTML = '';
    let szum = 0;

    kosar.forEach((item, index) => {
        szum += item.ar;
        lista.innerHTML += `<li class="list-group-item d-flex justify-content-between">${item.nev} <span>${item.ar} Ft</span></li>`;
    });

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

    const valasz = await response.json();
    
    if (valasz.statusz === "OK") {
        alert("Siker! " + valasz.uzenet);
        kosar = []; // Kosár ürítése
        kosarFrissites();
    }
}

window.onload = etlapBetoltes;
