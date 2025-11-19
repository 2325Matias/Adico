document.addEventListener('DOMContentLoaded', () => {
    
    const TOTAL_SPACES = 320;
    // La clave se mantiene estable para que el Tótem siga funcionando
    const STORAGE_KEY = 'dique3_PRODUCCION'; 
    const contentDiv = document.getElementById('main-content');

    let data = {
        companies: [],
        spots: [],
        reports: []
    };

    // --- 1. CARGA DE DATOS Y FUNCIÓN DE RESETEO (CON EJEMPLOS) ---
    function initData() {
        const json = localStorage.getItem(STORAGE_KEY);
        if (json) {
            data = JSON.parse(json);
        } else {
            // Si no hay datos, inicializa con la fábrica (Ejemplos)
            initFactoryData(); 
        }
        renderDashboard(); // Cargar vista inicial
    }

    window.fullReset = function() {
        if(confirm("¿ESTÁS SEGURO? Se borrarán todas las asignaciones y reportes, cargando los datos de ejemplo iniciales.")) {
            initFactoryData();
            alert("Sistema reiniciado y ejemplos cargados correctamente.");
            renderDashboard();
        }
    };

    function initFactoryData() {
        // 1. Empresas iniciales
        data.companies = [
            { id: 1, name: "Bank of China", logo: "img/china.png" },
            { id: 2, name: "Cementos Avellaneda", logo: "img/cementos.png" },
            { id: 3, name: "Dell Technologies", logo: "img/dell.png" },
            { id: 4, name: "Draco Capital", logo: "img/draco.png" },
            { id: 5, name: "Oracle", logo: "img/oracle.png" },
            { id: 6, name: "Salesforce", logo: "img/sales.png" },
            { id: 7, name: "Santa Catalina", logo: "img/santa.png" },
            { id: 8, name: "Worley", logo: "img/worley.png" },
            { id: 9, name: "YPF Luz", logo: "img/luz.png" },
            { id: 10, name: "VMOS", logo: "img/vmos.png" }
        ];
        
        data.spots = [];
        data.reports = [];
        let spotCounter = 1;
        let reportId = 1;

        // --- 🟢 LÓGICA DE CARGA DE EJEMPLOS (10 cocheras asignadas por empresa) ---
        data.companies.forEach(company => {
            // Asignar 10 cocheras (Spots) a la empresa actual
            for (let i = 0; i < 10; i++) {
                const isCurrentlyOccupied = i < 5; // Las primeras 5 (de 10) estarán ocupadas
                const plate = isCurrentlyOccupied ? `ABC${100 + spotCounter}` : null;
                
                data.spots.push({
                    id: spotCounter,
                    companyId: company.id, 
                    isOccupied: isCurrentlyOccupied, 
                    plate: plate,
                    type: 'Fija'
                });

                // Generar reporte de ENTRADA para los autos que están actualmente estacionados
                if (isCurrentlyOccupied) {
                    const now = new Date();
                    // Simulamos que entraron hace 1 o 2 días en un horario de oficina
                    now.setDate(now.getDate() - (i % 2 === 0 ? 1 : 2)); 
                    now.setHours(9 + (i % 3), 15 + (i * 5), 0); 
                    
                    data.reports.push({
                        id: reportId++,
                        date: now.toLocaleDateString(),
                        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        plate: plate,
                        company: company.name,
                        spotId: spotCounter,
                        action: 'ENTRADA'
                    });
                }

                spotCounter++;
            }
        }); 
        // En este punto, se asignaron las cocheras 1 a 100.

        // 3. Rellenar las cocheras restantes (101 a 320) como Sin Asignar
        for (; spotCounter <= TOTAL_SPACES; spotCounter++) {
            data.spots.push({
                id: spotCounter,
                companyId: null, 
                isOccupied: false, 
                plate: null,
                type: 'Fija'
            });
        }
        
        // --- 🟢 EJEMPLOS DE SALIDA/ENTRADA (Historial completo de 10 movimientos) ---
        const companiesForHistory = data.companies.slice(0, 5); // Usamos las 5 primeras empresas
        
        companiesForHistory.forEach((company, index) => {
            const examplePlate = `XYZ${10 + index}`;
            const spotId = 101 + index; // Usamos spots del bloque 'Sin Asignar' para el historial
            
            // Asignamos estas 5 cocheras a las empresas para que el reporte tenga sentido
            data.spots[spotId - 1].companyId = company.id;

            // Movimiento 1: Entrada (hace 3 días)
            let entryTime1 = new Date();
            entryTime1.setDate(entryTime1.getDate() - 3);
            entryTime1.setHours(8 + index, 0, 0);
            data.reports.push({
                id: reportId++, date: entryTime1.toLocaleDateString(), time: entryTime1.toLocaleTimeString(),
                plate: examplePlate, company: company.name, spotId, action: 'ENTRADA'
            });

            // Movimiento 2: Salida (hace 3 días)
            let exitTime1 = new Date(entryTime1);
            exitTime1.setHours(18, 0, 0);
            data.reports.push({
                id: reportId++, date: exitTime1.toLocaleDateString(), time: exitTime1.toLocaleTimeString(),
                plate: examplePlate, company: company.name, spotId, action: 'SALIDA'
            });
        });
        
        saveData();
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('storage'));
    }

    // --- 2. VISTAS (Resto del código idéntico al anterior) ---

    // A. DASHBOARD
    window.renderDashboard = function() {
        const assigned = data.spots.filter(s => s.companyId !== null).length;
        const occupied = data.spots.filter(s => s.isOccupied).length;

        contentDiv.innerHTML = `
            <h2 class="fw-bold mb-4">Dashboard General</h2>
            
            <div class="row g-4 mb-5">
                <div class="col-md-4"><div class="card p-4 shadow-sm border-primary border-start border-4">
                    <h3>${data.companies.length}</h3> <small class="text-muted">Empresas</small>
                </div></div>
                <div class="col-md-4"><div class="card p-4 shadow-sm border-success border-start border-4">
                    <h3>${assigned}</h3> <small class="text-muted">Cocheras Asignadas (Capacidad)</small>
                </div></div>
                <div class="col-md-4"><div class="card p-4 shadow-sm border-danger border-start border-4">
                    <h3>${occupied}</h3> <small class="text-muted">Autos Adentro (Ocupadas)</small>
                </div></div>
            </div>

            <div class="alert alert-warning">
                <h5 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> Zona de Peligro</h5>
                <p>Si desea volver a cargar los ${data.reports.length === 0 ? 'ejemplos de fábrica' : 'ejemplos de fábrica (borrando ' + data.reports.length + ' reportes actuales)'}, use este botón.</p>
                <button class="btn btn-danger" onclick="window.fullReset()"><i class="bi bi-arrow-counterclockwise"></i> REINICIAR SISTEMA DE FÁBRICA</button>
            </div>
        `;
    }

    // B. EMPRESAS
    window.renderCompanies = function() {
        let rows = data.companies.map(c => {
            const count = data.spots.filter(s => s.companyId === c.id).length;
            return `<tr>
                <td><img src="${c.logo}" height="30"></td>
                <td class="fw-bold">${c.name}</td>
                <td><span class="badge bg-info text-dark">${count} Asignadas</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-warning" onclick="openCompanyModal(${c.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCompany(${c.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`;
        }).join('');

        contentDiv.innerHTML = `
            <div class="d-flex justify-content-between mb-3"><h2>Empresas</h2> <button class="btn btn-primary" onclick="openCompanyModal(null)">+ Agregar</button></div>
            <div class="card shadow-sm"><table class="table table-hover mb-0"><tbody>${rows}</tbody></table></div>
        `;
    }

    // C. COCHERAS (EL MAPA)
    window.renderSpots = function() {
        // Resumen arriba
        let summary = data.companies.map(c => {
            const total = data.spots.filter(s => s.companyId === c.id).length; // Capacidad
            const ocup = data.spots.filter(s => s.companyId === c.id && s.isOccupied).length; // Autos
            if (total === 0) return '';
            return `<div class="col-auto mb-2"><div class="border p-2 bg-white rounded shadow-sm small">
                <img src="${c.logo}" height="15" class="me-1"> <strong>${c.name}</strong><br>
                Capacidad: ${total} | Libres: <strong class="text-success">${total - ocup}</strong>
            </div></div>`;
        }).join('');

        // Grid
        let grid = data.spots.map(s => {
            let border = 'border-secondary'; 
            let bg = 'bg-light';
            let info = '<span class="text-muted small">Sin Asignar</span>';
            
            if (s.companyId !== null) {
                const comp = data.companies.find(c => c.id === s.companyId);
                
                if (s.isOccupied) {
                    border = 'border-danger';
                    bg = 'bg-danger-subtle';
                    info = `<strong class="text-danger">${s.plate || 'OCUPADO'}</strong><br><small>${comp.name}</small>`;
                } else {
                    border = 'border-primary';
                    bg = 'bg-white';
                    info = `<span class="text-primary small fw-bold">Libre para usar</span><br><small>${comp.name}</small>`;
                }
            }

            return `<div class="col-6 col-sm-4 col-md-3 col-lg-2">
                <div class="card h-100 text-center shadow-sm ${border} ${bg}" onclick="openSpotModal(${s.id})" style="cursor:pointer">
                    <div class="card-body p-2">
                        <h6 class="fw-bold mb-1">#${s.id}</h6>
                        ${info}
                    </div>
                </div>
            </div>`;
        }).join('');

        contentDiv.innerHTML = `<h2>Gestión de Cocheras</h2><div class="row mb-3">${summary}</div><div class="row g-2">${grid}</div>`;
    }

    // D. REPORTES
    window.renderReports = function() {
        const rows = [...data.reports].reverse().map(r => `
            <tr>
                <td>${r.date} <small class="text-muted">${r.time}</small></td>
                <td class="fw-bold font-monospace">${r.plate}</td>
                <td>${r.company}</td>
                <td>Cochera ${r.spotId}</td>
                <td>${r.action === 'ENTRADA' ? '<span class="badge bg-success">ENTRADA</span>' : '<span class="badge bg-danger">SALIDA</span>'}</td>
            </tr>
        `).join('');
        contentDiv.innerHTML = `
            <h2>Reportes</h2>
            <div class="card shadow-sm">
                <div class="table-responsive" style="max-height: 70vh;">
                    <table class="table table-striped mb-0">
                        <thead class="table-dark sticky-top">
                            <tr><th>Fecha/Hora</th><th>Patente</th><th>Empresa</th><th>Lugar</th><th>Acción</th></tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // --- 3. MODAL LÓGICA (Funciones de Ingreso/Egreso/Asignación) ---
    // (Estas funciones se mantienen iguales, sólo se adaptan a la nueva estructura)
    
    let currentId = null;

    window.openSpotModal = function(id) {
        currentId = id;
        const spot = data.spots.find(s => s.id === id);
        const modal = new bootstrap.Modal(document.getElementById('spotModal'));
        
        document.getElementById('spotNumberDisplay').textContent = id;
        
        // Llenar Combo
        const sel = document.getElementById('spotCompanySelect');
        sel.innerHTML = '<option value="free">-- SIN ASIGNAR --</option>';
        data.companies.forEach(c => {
            sel.innerHTML += `<option value="${c.id}" ${spot.companyId === c.id ? 'selected':''}>${c.name}</option>`;
        });

        // Mostrar u Ocultar secciones
        const divAssign = document.getElementById('assignmentSection');
        const divAccess = document.getElementById('accessControlSection');

        if (spot.companyId === null) {
            // MODO CONFIGURACION (Asignar dueño)
            divAssign.classList.remove('d-none');
            divAccess.classList.add('d-none');
        } else {
            // MODO GUARDIA (Registrar Entrada/Salida)
            divAssign.classList.remove('d-none'); 
            divAccess.classList.remove('d-none');
            
            const comp = data.companies.find(c => c.id === spot.companyId);
            document.getElementById('accessCompanyName').textContent = comp.name;
            document.getElementById('accessCompanyLogo').src = comp.logo;

            if (spot.isOccupied) {
                document.getElementById('entryForm').classList.add('d-none');
                document.getElementById('exitForm').classList.remove('d-none');
                document.getElementById('currentPlateDisplay').textContent = spot.plate;
            } else {
                document.getElementById('entryForm').classList.remove('d-none');
                document.getElementById('exitForm').classList.add('d-none');
                document.getElementById('inputPlate').value = '';
            }
        }
        modal.show();
    }

    // GUARDAR ASIGNACION
    document.getElementById('btnSaveAssignment').onclick = () => {
        const val = document.getElementById('spotCompanySelect').value;
        const spot = data.spots.find(s => s.id === currentId);
        
        if (val === 'free') {
            spot.companyId = null;
            spot.isOccupied = false;
            spot.plate = null;
        } else {
            spot.companyId = parseInt(val);
        }
        saveData();
        bootstrap.Modal.getInstance(document.getElementById('spotModal')).hide();
        renderSpots();
    };

    // ENTRADA
    document.getElementById('btnRegisterEntry').onclick = () => {
        const plate = document.getElementById('inputPlate').value.toUpperCase();
        if(!plate) return alert("Escribe la patente");
        
        const spot = data.spots.find(s => s.id === currentId);
        const comp = data.companies.find(c => c.id === spot.companyId);
        
        spot.isOccupied = true;
        spot.plate = plate;
        
        addReport(plate, comp.name, spot.id, 'ENTRADA');
        saveData();
        bootstrap.Modal.getInstance(document.getElementById('spotModal')).hide();
        renderSpots();
    };

    // SALIDA
    document.getElementById('btnRegisterExit').onclick = () => {
        const spot = data.spots.find(s => s.id === currentId);
        const comp = data.companies.find(c => c.id === spot.companyId);
        
        addReport(spot.plate, comp.name, spot.id, 'SALIDA');
        
        spot.isOccupied = false;
        spot.plate = null;
        
        saveData();
        bootstrap.Modal.getInstance(document.getElementById('spotModal')).hide();
        renderSpots();
    };

    function addReport(plate, comp, spot, action) {
        const now = new Date();
        data.reports.push({
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            plate, company: comp, spotId: spot, action
        });
    }
    
    // --- Lógica de Empresas (sin cambios) ---
    window.openCompanyModal = function(id) {
        const modal = new bootstrap.Modal(document.getElementById('companyModal'));
        if (id) {
            const c = data.companies.find(x => x.id === id);
            document.getElementById('companyId').value = c.id;
            document.getElementById('companyName').value = c.name;
            document.getElementById('companyLogo').value = c.logo;
        } else {
            document.getElementById('companyForm').reset();
            document.getElementById('companyId').value = '';
        }
        modal.show();
    };

    document.getElementById('companyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('companyId').value;
        const name = document.getElementById('companyName').value;
        const logo = document.getElementById('companyLogo').value;

        if (id) {
            const c = data.companies.find(x => x.id == id);
            c.name = name; c.logo = logo;
        } else {
            const newId = data.companies.length ? Math.max(...data.companies.map(c=>c.id))+1 : 1;
            data.companies.push({ id: newId, name, logo });
        }
        saveData();
        bootstrap.Modal.getInstance(document.getElementById('companyModal')).hide();
        renderCompanies();
    });

    window.deleteCompany = function(id) {
        if(confirm("¿Borrar empresa?")) {
            data.spots.forEach(s => { if(s.companyId === id) { s.companyId = null; s.isOccupied = false; } });
            data.companies = data.companies.filter(c => c.id !== id);
            saveData();
            renderCompanies();
        }
    };
    
    // --- NAVEGACIÓN ---
    window.loadView = function(view, el) {
        document.querySelectorAll('.list-group-item').forEach(x => x.classList.remove('active-link'));
        if(el) el.classList.add('active-link');
        if(view === 'dashboard') renderDashboard();
        if(view === 'companies') renderCompanies();
        if(view === 'spots') renderSpots();
        if(view === 'reports') renderReports();
    };
    
    document.getElementById('menu-toggle').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('wrapper').classList.toggle('toggled');
    });

    initData(); // ARRANQUE DEL SISTEMA
});