document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('empresas-container');
    const STORAGE_KEY = 'dique3_PRODUCCION'; // LA MISMA CLAVE QUE EL ADMIN

    function renderTotem() {
        const json = localStorage.getItem(STORAGE_KEY);
        
        if (!json) {
            // Si no hay datos, mostramos mensaje de espera
            container.innerHTML = '<div class="col-12 text-center"><h2 class="text-muted">Iniciando sistema...</h2></div>';
            return;
        }
        
        const data = JSON.parse(json); // { companies, spots, reports }

        // --- CÁLCULO MATEMÁTICO CLAVE ---
        const listado = data.companies.map(emp => {
            // 1. ¿Cuántas cocheras son de esta empresa? (Capacidad Total)
            const totalSpots = data.spots.filter(s => s.companyId === emp.id).length;
            
            // 2. ¿En cuántas de esas hay un auto estacionado? (Ocupados)
            const occupiedSpots = data.spots.filter(s => s.companyId === emp.id && s.isOccupied).length;
            
            // 3. Disponibles = Total - Ocupados
            let available = totalSpots - occupiedSpots;
            if (available < 0) available = 0; // Seguridad

            return {
                ...emp,
                displayNumber: available // ESTE ES EL NÚMERO QUE SE MUESTRA
            };
        });

        // Ordenar: Las que tienen más lugar arriba
        listado.sort((a, b) => b.displayNumber - a.displayNumber);

        // Generar HTML
        let html = '';
        listado.forEach(emp => {
            // (Opcional) Solo mostrar empresas que tienen al menos 1 cochera asignada
            // Si quieres mostrar todas, borra la siguiente línea:
            // if (data.spots.filter(s => s.companyId === emp.id).length === 0) return;

            html += `
                <div class="col">
                    <div class="card card-empresa">
                        <div class="row g-0 d-flex align-items-center h-100"> 
                            <div class="col-6 d-flex align-items-center justify-content-center h-100 p-3">
                                <img src="${emp.logo}" class="img-fluid logo-totem" alt="${emp.name}" onerror="this.src='img/default.png'">
                            </div>
                            <div class="col-6 p-0 h-100">
                                <div class="h-100 w-100 col-numero d-flex align-items-center justify-content-center rounded-end-3 bg-light">
                                    <div class="cocheras-numero fw-bold text-dark">
                                        ${emp.displayNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    renderTotem(); // Carga inicial
    
    // Actualizar automáticamente cuando el Admin haga cambios
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) renderTotem();
    });
    
    // Refresco de seguridad cada 2 segundos
    setInterval(renderTotem, 2000);
});