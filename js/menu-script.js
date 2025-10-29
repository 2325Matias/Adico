document.addEventListener('DOMContentLoaded', () => {
    
    const wrapper = document.getElementById('wrapper');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.sidebar-wrapper .list-group-item-action');
    const contentArea = document.getElementById('main-content-area'); 

    // 1. Lógica para mostrar/ocultar la barra lateral (Móvil)
    if (sidebarToggle && wrapper) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.toggle('toggled');
        });
    }
    
    // ----------------------------------------------------
    // 🟢 DATOS Y CONSTANTES GLOBALES PARA COCHERAS
    // ----------------------------------------------------
    const TOTAL_SPACES = 320;
    const SPACE_STATUS = {
        DISPONIBLE: { label: "Disponible", color: "info", icon: "bi-check-circle-fill" },
        FIJA: { label: "Fija", color: "danger", icon: "bi-pin-angle-fill" },
        MOVIL: { label: "Móvil", color: "warning", icon: "bi-arrow-right-circle-fill" },
        EXCLUSIVA: { label: "Exclusiva", color: "success", icon: "bi-star-fill" }
    };

    let parkingSpots = []; // Array para las 320 cocheras
    
    // Inicialización de las cocheras
    for (let i = 1; i <= TOTAL_SPACES; i++) {
        // Inicializar algunas asignadas para probar el dashboard
        let assignedTo = null;
        let type = SPACE_STATUS.DISPONIBLE.label;

        if (i <= 5) {
            assignedTo = 1; // Bank of China
            type = SPACE_STATUS.EXCLUSIVA.label;
        } else if (i > 5 && i <= 15) {
            assignedTo = 2; // Cementos Avellaneda
            type = SPACE_STATUS.FIJA.label;
        } else if (i === 16) {
             assignedTo = 3; // Dell Technologies
             type = SPACE_STATUS.MOVIL.label;
        }

        parkingSpots.push({
            id: i,
            status: type, // Status now reflects the assigned type or Disponble
            assignedTo: assignedTo, // Company ID (null if Disponible)
            type: type
        });
    }
    // ----------------------------------------------------
    
    // Datos iniciales de empresas (sin cocheras disponibles en el objeto)
    let empresas = [
        { id: 1, nombre: "Bank of China", imagen: "img/china.png" },
        { id: 2, nombre: "Cementos Avellaneda", imagen: "img/cementos.png" },
        { id: 3, nombre: "Dell Technologies", imagen: "img/dell.png" },
        { id: 4, nombre: "Draco Capital", imagen: "img/draco.png" },
        { id: 5, nombre: "Oracle", imagen: "img/oracle.png" },
        { id: 6, nombre: "Salesforce", imagen: "img/sales.png" },
    ];
    let nextId = 7; 

    // 2. Funciones de gestión (Deben ser globales para ser llamadas desde el HTML dinámico)
    window.renderizarTablaEmpresas = function() {
        const tableBody = document.getElementById('companies-table-body');
        if (!tableBody) return;

        let htmlContent = '';
        
        empresas.forEach(empresa => {
            htmlContent += `
                <tr data-id="${empresa.id}">
                    <td><img src="${empresa.imagen}" alt="Logo" class="img-fluid me-2"></td>
                    <td>${empresa.nombre}</td>
                    <td>
                        <button class="btn btn-info btn-action-sm me-2" onclick="viewCompany(${empresa.id})"><i class="bi bi-eye"></i> Ver</button>
                        <button class="btn btn-warning btn-action-sm me-2" onclick="editCompany(${empresa.id})"><i class="bi bi-pencil"></i> Modificar</button>
                        <button class="btn btn-danger btn-action-sm" onclick="deleteCompany(${empresa.id})"><i class="bi bi-trash"></i> Eliminar</button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = htmlContent;
    }

    // --- FUNCIÓN VER (Modal) ---
    window.viewCompany = function(id) {
        const empresa = empresas.find(e => e.id === id);
        const assignedSpots = parkingSpots.filter(spot => spot.assignedTo === id);

        if (empresa) {
            const modal = document.getElementById('viewCompanyModal');
            const modalTitle = modal.querySelector('.modal-title');
            const modalBody = modal.querySelector('.modal-body');

            modalTitle.innerHTML = `<i class="bi bi-eye me-2"></i> Detalles de ${empresa.nombre}`;
            
            modalBody.innerHTML = `
                <div class="text-center mb-4">
                    <img src="${empresa.imagen}" alt="Logo" class="img-fluid border p-2 rounded" style="max-height: 100px; width: auto; object-fit: contain;">
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>ID:</strong> ${empresa.id}</li>
                    <li class="list-group-item"><strong>Nombre:</strong> ${empresa.nombre}</li>
                    <li class="list-group-item"><strong>Cocheras Asignadas:</strong> <span class="badge bg-primary fs-5">${assignedSpots.length}</span></li>
                    <li class="list-group-item text-muted small">Ruta de Imagen (Simulada): ${empresa.imagen}</li>
                </ul>
                <h6 class="mt-3">Listado de Cocheras Asignadas:</h6>
                <div class="p-2 border rounded small" style="max-height: 100px; overflow-y: auto;">
                    ${assignedSpots.map(s => `N° ${s.id} (${s.type})`).join(', ') || 'Ninguna cochera asignada.'}
                </div>
            `;
            
            // Muestra el modal
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }

    // --- FUNCIÓN EDITAR (Modal con campo de Logo) ---
    window.editCompany = function(id) {
        const empresa = empresas.find(e => e.id === id);
        if (empresa) {
            const modal = document.getElementById('editCompanyModal');
            const modalTitle = modal.querySelector('.modal-title');
            const submitButton = modal.querySelector('#editCompanySubmit');
            const form = modal.querySelector('#modalEditCompanyForm');
            
            modalTitle.innerHTML = `<i class="bi bi-pencil me-2"></i> Modificar ${empresa.nombre}`;
            submitButton.innerHTML = `<i class="bi bi-save me-2"></i> Guardar Cambios`;
            
            form.querySelector('#editCompanyName').value = empresa.nombre;
            const logoInput = form.querySelector('#editCompanyLogo');
            logoInput.value = '';

            const handleEditSubmit = (e) => {
                e.preventDefault();
                const newName = form.querySelector('#editCompanyName').value.trim();
                const newLogoFile = logoInput.files[0];
                
                if (!newName) {
                    alert("El nombre no puede estar vacío.");
                    return;
                }
                
                empresa.nombre = newName;
                
                if (newLogoFile) {
                    empresa.imagen = URL.createObjectURL(newLogoFile); 
                }

                window.renderizarTablaEmpresas(); 
                if (contentArea.getAttribute('data-current-view') === 'car-spaces') {
                    window.renderCarSpaces(); 
                }
                
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();

                // **SE ELIMINÓ la limpieza ad-hoc. Ahora es universal.**
                
                const pageFeedback = document.getElementById('companies-page-feedback');
                if(pageFeedback) {
                    pageFeedback.innerHTML = '<div class="alert alert-warning mt-3">Empresa modificada con éxito y listado actualizado.</div>';
                    setTimeout(() => pageFeedback.innerHTML = '', 4000);
                }
            };
            
            if (form.getAttribute('data-temp-listener')) {
                form.removeEventListener('submit', form['data-temp-listener']);
            }
            form.addEventListener('submit', handleEditSubmit);
            form['data-temp-listener'] = handleEditSubmit;

            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }

    window.deleteCompany = function(id) {
        if (confirm("¿Estás seguro de que deseas eliminar esta empresa?")) {
            // Desasignar todas las cocheras de esta empresa
            parkingSpots.forEach(spot => {
                if (spot.assignedTo === id) {
                    spot.assignedTo = null;
                    spot.type = SPACE_STATUS.DISPONIBLE.label;
                }
            });
            
            // Eliminar la empresa
            empresas = empresas.filter(e => e.id !== id);
            window.renderizarTablaEmpresas(); 
            
             if (contentArea.getAttribute('data-current-view') === 'car-spaces') {
                window.renderCarSpaces(); 
            }
            alert("Empresa eliminada y cocheras desasignadas.");
        }
    }

    // 3. Lógica de Añadir Empresa (Para el Modal)
    window.handleAddCompanySubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const feedback = document.getElementById('modal-form-feedback'); 
        
        const companyNameInput = form.querySelector('#companyName');
        const companyLogoInput = form.querySelector('#companyLogo');


        if (!companyNameInput || companyNameInput.value.trim() === '') {
            feedback.innerHTML = '<div class="alert alert-danger">Por favor, ingrese el nombre de la empresa.</div>';
            setTimeout(() => feedback.innerHTML = '', 3000);
            return;
        }
        if (!companyLogoInput || companyLogoInput.files.length === 0) {
            feedback.innerHTML = '<div class="alert alert-danger">Por favor, seleccione un logo para la empresa.</div>';
            setTimeout(() => feedback.innerHTML = '', 3000);
            return;
        }

        const newLogoFile = companyLogoInput.files[0];
        const newLogoUrl = URL.createObjectURL(newLogoFile);


        const newCompany = {
            id: nextId++,
            nombre: companyNameInput.value,
            imagen: newLogoUrl
        };
        
        empresas.push(newCompany);
        window.renderizarTablaEmpresas();
        form.reset();
        
        const modalElement = document.getElementById('addCompanyModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        bootstrapModal.hide();
        
        // **SE ELIMINÓ la limpieza ad-hoc. Ahora es universal.**
        
        const pageFeedback = document.getElementById('companies-page-feedback');
        if(pageFeedback) {
            pageFeedback.innerHTML = '<div class="alert alert-success mt-3">Empresa añadida con éxito y listado actualizado.</div>';
            setTimeout(() => pageFeedback.innerHTML = '', 4000);
        }
    }


    // ----------------------------------------------------
    // 🟢 FUNCIONES PARA GESTIÓN DE COCHERAS
    // ----------------------------------------------------

    // Función auxiliar para obtener la clase de color y el nombre de la empresa
    function getSpotDetails(spot) {
        let spotClass = `bg-${SPACE_STATUS.DISPONIBLE.color}`;
        let companyName = "LIBRE";
        let icon = SPACE_STATUS.DISPONIBLE.icon;

        if (spot.assignedTo) {
            const statusDetail = Object.values(SPACE_STATUS).find(s => s.label === spot.type);
            spotClass = `bg-${statusDetail.color}`;
            icon = statusDetail.icon;
            companyName = empresas.find(e => e.id === spot.assignedTo)?.nombre || "Empresa Desconocida";
        }

        return { spotClass, companyName, icon };
    }

    // Renderiza la vista completa de Gestión de Cocheras
    window.renderCarSpaces = function() {
        const carSpacesContainer = document.getElementById('car-spaces-grid');
        const summaryContainer = document.getElementById('car-spaces-summary');
        
        if (!carSpacesContainer || !summaryContainer) return;
        
        // --- Cálculo de Resumen ---
        let summary = {
            total: TOTAL_SPACES,
            free: 0,
            companyCounts: {}
        };
        
        empresas.forEach(emp => {
            summary.companyCounts[emp.id] = { name: emp.nombre, count: 0 };
        });

        parkingSpots.forEach(spot => {
            if (spot.assignedTo === null) {
                summary.free++;
            } else if (summary.companyCounts[spot.assignedTo]) {
                summary.companyCounts[spot.assignedTo].count++;
            }
        });
        summary.occupied = TOTAL_SPACES - summary.free;


        // --- Render Resumen ---
        let companyListHtml = empresas.map(emp => {
            const count = summary.companyCounts[emp.id]?.count || 0;
            return `<li class="list-group-item d-flex justify-content-between align-items-center">
                ${emp.nombre}
                <span class="badge bg-secondary rounded-pill">${count}</span>
            </li>`;
        }).join('');

        summaryContainer.innerHTML = `
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card text-center p-3 shadow-sm border-start border-primary border-4">
                        <h5 class="card-title fw-bold">Total de Cocheras</h5>
                        <p class="display-4 fw-bold text-primary">${TOTAL_SPACES}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center p-3 shadow-sm border-start border-info border-4">
                        <h5 class="card-title fw-bold">Cocheras Libres</h5>
                        <p class="display-4 fw-bold text-info">${summary.free}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center p-3 shadow-sm border-start border-secondary border-4">
                        <h5 class="card-title fw-bold">Cocheras Ocupadas</h5>
                        <p class="display-4 fw-bold text-secondary">${summary.occupied}</p>
                    </div>
                </div>
            </div>
            <div class="card shadow-sm mt-4">
                <div class="card-header bg-light fw-bold">Cocheras Asignadas por Empresa</div>
                <ul class="list-group list-group-flush">
                    ${companyListHtml}
                </ul>
            </div>
        `;

        // --- Render Grid de Cocheras ---
        let gridHtml = '';
        parkingSpots.forEach(spot => {
            const { spotClass, companyName, icon } = getSpotDetails(spot);
            
            gridHtml += `
                <div class="col-6 col-md-4 col-lg-3 col-xl-2"> 
                    <div class="card text-center car-space-card h-100" 
                         data-bs-toggle="modal" 
                         data-bs-target="#assignCarSpaceModal" 
                         onclick="window.openAssignModal(${spot.id})">
                        <div class="card-body p-2">
                            <div class="d-flex align-items-center justify-content-center flex-column">
                                <div class="${spotClass} rounded-circle me-2 mb-2 d-flex align-items-center justify-content-center text-white" 
                                     style="min-width: 30px; height: 30px; font-size: 1rem;">
                                     <i class="bi ${icon}"></i>
                                </div>
                                <h6 class="card-subtitle mb-0 fw-bold">N° ${spot.id}</h6>
                                <small class="text-muted" style="font-size: 0.75rem; line-height: 1.1;">${companyName}</small> 
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        carSpacesContainer.innerHTML = gridHtml;
    }

    // Abre el modal de asignación y carga los datos de la cochera
    window.openAssignModal = function(spotId) {
        const spot = parkingSpots.find(s => s.id === spotId);
        if (!spot) return;

        const modal = document.getElementById('assignCarSpaceModal');
        const modalTitle = modal.querySelector('.modal-title');
        const form = modal.querySelector('#modalAssignCarSpaceForm');
        
        modalTitle.textContent = `Asignar Cochera N° ${spot.id}`;
        
        // 1. Populate Company Select (Dropdown)
        const companySelect = form.querySelector('#assignCompanyId');
        
        // Primer opción (placeholder)
        companySelect.innerHTML = '<option value="" disabled>-- SELECCIONE UNA OPCIÓN --</option>'; 

        // Opción para dejarla Libre (Valor especial: "0")
        const isFree = spot.assignedTo === null;
        const freeSelected = isFree ? 'selected' : '';
        // Usaremos el valor "0" para representar "Libre" o desasignar
        companySelect.innerHTML += `<option value="0" ${freeSelected}>Libre</option>`; 
        
        // Opciones de Empresas
        empresas.forEach(emp => {
            const selected = spot.assignedTo === emp.id ? 'selected' : '';
            companySelect.innerHTML += `<option value="${emp.id}" ${selected}>${emp.nombre}</option>`;
        });
        
        // Si la cochera tiene una empresa asignada, asegurarse de seleccionar el ID, no el placeholder
        if (spot.assignedTo !== null) {
             companySelect.value = spot.assignedTo;
        } else if (isFree) {
            companySelect.value = "0"; // Si está libre, selecciona "Libre"
        } else {
             companySelect.value = ""; // Si no hay nada seleccionado, selecciona el placeholder (solo al abrir)
        }


        // 2. Set Spot Type Radios
        const radioContainer = form.querySelector('#assignTypeContainer');
        radioContainer.innerHTML = '';
        
        // Solo incluimos Fija, Móvil y Exclusiva en los radios de TIPO.
        Object.keys(SPACE_STATUS).forEach(key => {
            const type = SPACE_STATUS[key];
            if (type.label === SPACE_STATUS.DISPONIBLE.label) return; // Excluir "Disponible"
            
            const checked = spot.type === type.label ? 'checked' : '';
            
            radioContainer.innerHTML += `
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="assignType" id="type_${key}" value="${type.label}" ${checked}>
                    <label class="form-check-label" for="type_${key}">${type.label}</label>
                </div>
            `;
        });
        
        const typeRadios = form.querySelectorAll('input[name="assignType"]');
        const assignTypeGroup = form.querySelector('#assignTypeGroup');

        function updateRadiosState() {
            // isAssigned es verdadero si el valor es una ID de empresa (distinto de "" y "0")
            const isAssigned = companySelect.value !== "" && companySelect.value !== "0"; 
            
            // Si NO está asignada (Libre) o es el placeholder
            if (!isAssigned) {
                // OCULTA el grupo de radios. Una cochera libre SIEMPRE es "Disponible".
                assignTypeGroup.style.display = 'none'; 
                
            } else {
                // Si SÍ está asignada, MUESTRA el grupo de radios.
                assignTypeGroup.style.display = 'block'; 

                // Si no se ha seleccionado ningún tipo (ej. al asignar por primera vez), seleccionar 'Fija'
                const isAnyTypeChecked = Array.from(typeRadios).some(r => r.checked);
                const fixedRadio = form.querySelector(`#type_FIJA`);

                if (!isAnyTypeChecked) {
                    // Si la cochera se estaba reasignando desde "Libre" o era una nueva, forzar a 'Fija'.
                    if (fixedRadio) {
                         fixedRadio.checked = true;
                    }
                }
            }
        }
        
        // Limpiar y añadir el listener de cambio para controlar los radios
        if (companySelect['data-listener']) {
            companySelect.removeEventListener('change', companySelect['data-listener']);
        }
        const changeListener = (e) => {
            updateRadiosState();
        };
        companySelect.addEventListener('change', changeListener);
        companySelect['data-listener'] = changeListener;
        
        updateRadiosState(); // Llamada inicial para establecer el estado

        // Store spot ID on the form element for submission
        form.setAttribute('data-spot-id', spotId);

        // Show modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }

    // Maneja la asignación de la cochera al enviar el formulario del modal
    window.handleAssignFormSubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const spotId = parseInt(form.getAttribute('data-spot-id'));
        const spot = parkingSpots.find(s => s.id === spotId);
        
        const companySelect = form.querySelector('#assignCompanyId');
        const selectedValue = companySelect.value; 

        // 1. Validar que se seleccionó una opción válida (no el placeholder)
        if (selectedValue === "") {
             alert("Por favor, seleccione una opción válida (Libre o una Empresa) para la cochera.");
             return;
        }

        // 2. Determinar si se libera o se asigna/reasigna
        // Si el valor es "0" (Libre), desasignar.
        const isLiberar = selectedValue === "0"; 
        
        // Si es una ID de empresa (distinta de "0" y "")
        const selectedCompanyId = isLiberar ? null : parseInt(selectedValue);
        
        // El tipo solo es relevante si se seleccionó una empresa
        const selectedTypeInput = form.querySelector('input[name="assignType"]:checked');
        let selectedType = selectedTypeInput ? selectedTypeInput.value : SPACE_STATUS.DISPONIBLE.label;

        if (isLiberar) {
            // Desasignar (Dejar libre)
            spot.assignedTo = null;
            spot.type = SPACE_STATUS.DISPONIBLE.label; 
            // Feedback
            const pageFeedback = document.getElementById('companies-page-feedback');
            if(pageFeedback) {
                pageFeedback.innerHTML = `<div class="alert alert-info mt-3">Cochera N° ${spotId} ha sido marcada como <strong>Disponible (Libre)</strong>.</div>`;
                setTimeout(() => pageFeedback.innerHTML = '', 4000);
            }
        } else {
            // Asignar o reasignar
            spot.assignedTo = selectedCompanyId;
            
            // Si no se seleccionó ningún radio (porque el grupo estaba oculto al seleccionar LIBRE) 
            // forzar a 'Fija' como tipo por defecto en la asignación
            if (!selectedTypeInput) {
                 selectedType = SPACE_STATUS.FIJA.label;
            }
            spot.type = selectedType;

            // Feedback
            const companyName = empresas.find(e => e.id === selectedCompanyId)?.nombre || 'Empresa';
            const pageFeedback = document.getElementById('companies-page-feedback');
            if(pageFeedback) {
                pageFeedback.innerHTML = `<div class="alert alert-success mt-3">Cochera N° ${spotId} asignada a <strong>${companyName}</strong> como <strong>${spot.type}</strong>.</div>`;
                setTimeout(() => pageFeedback.innerHTML = '', 4000);
            }
        }

        window.renderCarSpaces(); 
        
        const modalElement = document.getElementById('assignCarSpaceModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modalElement);

        if (bootstrapModal) {
            // Cierre normal de Bootstrap
            bootstrapModal.hide();
        } 
        
        // **SE ELIMINÓ la limpieza ad-hoc. Ahora es universal.**
    }

    // ----------------------------------------------------
    
    // 4. Contenido HTML para las vistas dinámicas
    const views = {
        'dashboard': `
            <h1 class="mt-4 mb-4 fw-bold text-dark">Dashboard</h1>
            <p class="lead">Resumen del sistema y estadísticas clave.</p>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card p-3 text-center shadow-sm border-start border-primary border-4">
                        <h3 class="display-5 text-primary">10</h3>
                        <p class="text-muted mb-0">Empresas Activas</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3 text-center shadow-sm border-success border-3 border-start">
                        <h3 class="display-5 text-success">${TOTAL_SPACES}</h3>
                        <p class="text-muted mb-0">Total de Cocheras</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-3 text-center shadow-sm border-warning border-3 border-start">
                        <h3 class="display-5 text-warning">86</h3>
                        <p class="text-muted mb-0">Cocheras Ocupadas</p>
                    </div>
                </div>
            </div>
            <h2 class="mt-5 mb-4 fw-bold text-dark">Monitoreo Rápido</h2>
            <div class="alert alert-info">Aquí se mostraría una tabla o lista de las cocheras actuales para una gestión rápida.</div>
        `,
        'companies': `
            <h1 class="mt-4 mb-4 fw-bold text-dark"><i class="bi bi-buildings me-2"></i>Gestión de Empresas</h1>
            <p class="lead">Gestiona las empresas que se muestran en el tótem.</p>
            
            <div id="companies-page-feedback"></div>

            <div class="mb-4 d-flex justify-content-start">
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCompanyModal">
                    <i class="bi bi-plus-circle me-2"></i> Agregar Empresa
                </button>
            </div>
            
            <h3 class="mb-3 fw-bold mt-4">Listado de Empresas</h3>
            
            <div class="card p-4 shadow-sm">
                <table class="table table-striped table-hover mt-3 mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>Logo</th>
                            <th>Empresa</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="companies-table-body">
                        </tbody>
                </table>
            </div>
        `,
        // 🟢 VISTA DE GESTIÓN DE COCHERAS
        'car-spaces': `
            <h1 class="mt-4 mb-4 fw-bold text-dark"><i class="bi bi-p-circle me-2"></i>Gestión de Cocheras</h1>
            <p class="lead">Asignación y estado de los ${TOTAL_SPACES} espacios de estacionamiento.</p>
            
            <div id="car-spaces-summary" class="mb-5">
                </div>

            <h3 class="mb-3 fw-bold mt-4">Mapa de Cocheras</h3>
            <div id="companies-page-feedback"></div>

            <div class="row g-2" id="car-spaces-grid">
                </div>
        `,
        'settings': `
            <h1 class="mt-4 mb-4 fw-bold text-dark"><i class="bi bi-gear me-2"></i>Configuración del Sistema</h1>
            <p class="lead">Ajustes generales del panel de control y preferencias del sistema.</p>
            <div class="alert alert-info">Funcionalidad en desarrollo.</div>
        `
    };
    
    // ----------------------------------------------------
    // 🟢 NUEVA FUNCIÓN DE LIMPIEZA FORZADA
    // ----------------------------------------------------
    function forceModalCleanup() {
        // Ejecuta la limpieza de seguridad forzada después de que cualquier modal se haya ocultado.
        // Esto soluciona el problema de que el 'modal-backdrop' quede atascado.
        setTimeout(() => {
            // Elimina el fondo oscuro (backdrop)
            document.querySelector('.modal-backdrop')?.remove();

            // Restablece el body para que permita la interacción
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 50); // Un tiempo corto de espera para asegurar que Bootstrap ha terminado su animación.
    }


    // 5. Lógica para cargar contenido dinámico
    function loadContent(viewName) {
        contentArea.innerHTML = views[viewName] || '<h1>Error: Contenido no encontrado.</h1>';
        // Almacenar la vista actual para saber qué actualizar en caso de un cambio global (ej. borrar empresa)
        contentArea.setAttribute('data-current-view', viewName); 

        if (viewName === 'companies') {
            window.renderizarTablaEmpresas();
        } else if (viewName === 'car-spaces') {
            window.renderCarSpaces();
        }
    }

    // 6. Manejar la navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active-link'));
            link.classList.add('active-link');
            
            const contentKey = link.getAttribute('data-content');
            if (contentKey) {
                loadContent(contentKey);
            }
            
            if (window.innerWidth <= 768) {
                wrapper.classList.remove('toggled');
            }
        });
    });

    // 7. Inicialización y listeners de modales
    // Cargar la vista de Dashboard por defecto al inicio
    loadContent('dashboard');
    
    // Adjuntar listeners de formularios MODALES
    const modalAddCompanyForm = document.getElementById('modalAddCompanyForm');
    if (modalAddCompanyForm) {
        modalAddCompanyForm.addEventListener('submit', window.handleAddCompanySubmit);
    }
    
    // 🟢 Listener para el nuevo modal de cocheras
    const modalAssignCarSpaceForm = document.getElementById('modalAssignCarSpaceForm');
    if (modalAssignCarSpaceForm) {
        modalAssignCarSpaceForm.addEventListener('submit', window.handleAssignFormSubmit);
    }

    // 🟢 Aplicar la función de limpieza a todos los modales al ocultarse
    const assignModal = document.getElementById('assignCarSpaceModal');
    const addModal = document.getElementById('addCompanyModal');
    const editModal = document.getElementById('editCompanyModal');
    const viewModal = document.getElementById('viewCompanyModal');
    
    [assignModal, addModal, editModal, viewModal].forEach(modalElement => {
        if (modalElement) {
            // El evento 'hidden.bs.modal' se dispara cuando el modal termina de ocultarse.
            modalElement.addEventListener('hidden.bs.modal', forceModalCleanup);
        }
    });
});