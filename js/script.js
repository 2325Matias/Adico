// 1. Datos de las empresas (SIN CAMBIOS EN LOS DATOS)
const empresas = [
    // ... tus 10 objetos de empresa aquí ...
    { nombre: "Bank of China", cocherasDisponibles: 6, imagen: "img/china.png" },
    { nombre: "Cementos Avellaneda", cocherasDisponibles: 22, imagen: "img/cementos.png" },
    { nombre: "Dell Technologies", cocherasDisponibles: 31, imagen: "img/dell.png" },
    { nombre: "Draco Capital", cocherasDisponibles: 19, imagen: "img/draco.png" },
    { nombre: "Oracle", cocherasDisponibles: 47, imagen: "img/oracle.png" },
    { nombre: "Salesforce", cocherasDisponibles: 29, imagen: "img/sales.png" },
    { nombre: "Santa Catalina", cocherasDisponibles: 28, imagen: "img/santa.png" },
    { nombre: "Worley", cocherasDisponibles: 22, imagen: "img/worley.png" },
    { nombre: "YPF Luz", cocherasDisponibles: 23, imagen: "img/luz.png" },
    { nombre: "VMOS - Vaca Muerta Oil Sur", cocherasDisponibles: 17, imagen: "img/vmos.png" }
];


// 2. Función para generar el HTML de una tarjeta horizontal (SIN COLORES DE ESTADO)
function crearTarjetaEmpresa(empresa) {
    // 🔴 CORRECCIÓN: Ya no se define badgeClass. El color de fondo es fijo en el CSS.
    
    return `
        <div class="col">
            <div class="card card-empresa">
                <div class="row g-0 d-flex align-items-center h-100"> 
                    <div class="col-6 d-flex align-items-center justify-content-center h-100 p-3">
                        <img src="${empresa.imagen}" class="img-fluid logo-totem" alt="${empresa.nombre}">
                    </div>
                    
                    <div class="col-6 p-0 h-100">
                        <div class="h-100 w-100 col-numero d-flex align-items-center justify-content-center rounded-end-3">
                            <div class="cocheras-numero fw-bold">
                                ${empresa.cocherasDisponibles}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 3. Renderizar y ordenar (el resto del código se mantiene igual)
function renderizarEmpresas() {
    const container = document.getElementById('empresas-container');
    let htmlContent = '';
    
    // Ordenar por cocheras disponibles (opcional)
    empresas.sort((a, b) => b.cocherasDisponibles - a.cocherasDisponibles); 

    empresas.forEach(empresa => {
        htmlContent += crearTarjetaEmpresa(empresa);
    });

    container.innerHTML = htmlContent;
}

document.addEventListener('DOMContentLoaded', renderizarEmpresas);