// 1. Az ételek listája (adatbázis helyett)
const etelek = [
    { id: 1, nev: "Margherita Pizza", ar: 2500, kep: "https://via.placeholder.com/150" },
    { id: 2, nev: "Sajtos Burger", ar: 2100, kep: "https://via.placeholder.com/150" },
    { id: 3, nev: "Cézár Saláta", ar: 1900, kep: "https://via.placeholder.com/150" }
];

let kosar = [];

// 2. Függvény, ami kirajzolja az ételeket az oldalra
function etlapKirajzolas() {
    const kontener = document.getElementById('etlap-kontener');
    kontener.innerHTML = ''; // Kiürítjük a "Betöltés..." feliratot

    etelek.forEach(etel => {
        kontener.innerHTML += `
            <div class="col-md-6 mb-3">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${etel.nev}</h5>
                        <p class="card-text">${etel.ar} Ft</p>
                        <button class="btn btn-primary btn-sm" onclick="kosarbaTeszi(${etel.id})">
                            Kosárba +
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// 3. Kosár kezelése
function kosarbaTeszi(id) {
    const valasztottEtel = etelek.find(e => e.id === id);
    kosar.push(valasztottEtel);
    kosarFrissites();
}

function kosarFrissites() {
    const lista = document.getElementById('kosar-lista');
    const osszesenElem = document.getElementById('osszesen');
    
    lista.innerHTML = ''; // Ürítjük a listát
    let vegosszeg = 0;

    kosar.forEach((elem, index) => {
        vegosszeg += elem.ar;
        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${elem.nev}
                <span class="badge bg-danger rounded-pill" style="cursor:pointer" onclick="torol(${index})">X</span>
            </li>
        `;
    });

    if (kosar.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-muted">A kosarad még üres.</li>';
    }

    osszesenElem.innerText = vegosszeg;
}

function torol(index) {
    kosar.splice(index, 1);
    kosarFrissites();
}

function rendelesLeadasa() {
    if (kosar.length === 0) {
        alert("Üres a kosarad!");
        return;
    }
    alert("Rendelés leadva! Összesen: " + document.getElementById('osszesen').innerText + " Ft");
    kosar = [];
    kosarFrissites();
}

// Indításkor futtassuk le az étlap kirajzolását
etlapKirajzolas();