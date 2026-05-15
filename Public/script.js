// === SCRIPT.JS TÉRKÉP / FUNKCIÓK ===
// [FE-01] etlapBetoltes() -> Lekéri az adatokat a szerverről
// [FE-02] kosarba() -> Kezeli a helyi kosár változót
// [FE-03] kosarFrissites() -> Frissíti a HTML-t
// [FE-04] rendelesLeadasa() -> Elküldi a kosarat a szervernek

let kosar = [];

// [FE-01] Étlap betöltése a szerverről
async function etlapBetoltes() {
    try {
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
                            <p class="card-text text-primary fw-bold">${etel.ar} Ft</p>
                            <button class="btn btn-outline-primary" onclick="kosarba('${etel.nev}', ${etel.ar})">
                                Kosárba +
                            </button>
                        </div>
                    </div>
                </div>`;
        });
    } catch (err) {
        console.error("Hiba az étlap betöltésekor:", err);
    }
}

// [FE-02] Elem hozzáadása a kosárhoz
function kosarba(nev, ar) {
    kosar.push({ nev, ar });
    kosarFrissites();
}

// [FE-03] A kosár vizuális frissítése 
function kosarFrissites() {
    const lista = document.getElementById('kosar-lista');
    const osszesen = document.getElementById('osszesen');
    
    lista.innerHTML = '';
    let szum = 0;

    kosar.forEach(item => {
        szum += item.ar;
        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.nev} 
                <span class="badge bg-secondary rounded-pill">${item.ar} Ft</span>
            </li>`;
    });

    if (kosar.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-muted text-center">Üres a kosár</li>';
    }
    
    osszesen.innerText = szum;
}

// [FE-04] Rendelés elküldése a backendnek
async function rendelesLeadasa() {
    if (kosar.length === 0) {
        alert("Üres a kosarad!");
        return;
    }

    try {
        const response = await fetch('/api/rendeles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                etelek: kosar,
                osszeg: Number(document.getElementById('osszesen').innerText)
            })
        });

        const valasz = await response.json();
        
        if (response.ok) {
            alert("Siker! " + valasz.uzenet);
            kosar = []; // Kosár ürítése
            kosarFrissites();
        } else {
            alert("Hiba: " + valasz.hiba);
        }
    } catch (err) {
        console.error("Hiba a rendelés során:", err);
        alert("Szerver hiba történt!");
    }
}

// Inicializálás az oldal betöltésekor
window.onload = etlapBetoltes;
