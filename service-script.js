document.addEventListener('DOMContentLoaded', function() {
    const services = {
        web: {
            title: "PÁGINAS WEB",
            description: "Diseño y desarrollo de páginas y aplicaciones web adaptadas a tus necesidades. Ofrecemos soluciones a medida para mejorar la presencia en línea de tu negocio, con diseño responsivo, optimización SEO, y experiencia de usuario de primera calidad."
        },
        networks: {
            title: "REDES",
            description: "Diseño e implementación de redes seguras y eficientes para tu empresa. Nos aseguramos de que tu infraestructura de red esté configurada para soportar el crecimiento y proporcionar un acceso seguro y rápido a los recursos esenciales de tu empresa."
        },
        servers: {
            title: "SERVIDORES",
            description: "Gestión y configuración de servidores Linux y Windows para un rendimiento óptimo. Ofrecemos servicios de administración de servidores, incluyendo monitoreo, mantenimiento, y optimización, asegurando un tiempo de actividad máximo y un rendimiento fiable."
        }
    };

    const menuBtn = document.querySelector('.menu-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const serviceTitle = document.getElementById('service-title');
    const serviceDescription = document.getElementById('service-description');

    menuBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
    });

    dropdownContent.addEventListener('click', function(event) {
        const serviceKey = event.target.getAttribute('data-service');
        if (services[serviceKey]) {
            serviceTitle.textContent = services[serviceKey].title;
            serviceDescription.innerHTML = `<p>${services[serviceKey].description}</p>`;
        }
        dropdownContent.classList.remove('show');
    });

    window.addEventListener('click', function(event) {
        if (!event.target.matches('.menu-btn')) {
            dropdownContent.classList.remove('show');
        }
    });
});
