document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    // --- Elementos de input --- //
    const allInputs = {
        basePackage: { el: document.getElementById('base-package'), text: 'Paquete Web Básico' },
        extraPages: { el: document.getElementById('extra-pages'), text: 'Páginas de Servicio Adicionales' },
        contactForm: { el: document.getElementById('contact-form'), text: 'Página de Contacto con Formulario' },
        blog: { el: document.getElementById('blog'), text: 'Integración de Blog' },
        gallery: { el: document.getElementById('gallery'), text: 'Galería de Imágenes/Portafolio' },
        seo: { el: document.getElementById('seo'), text: 'SEO Básico' },
        socialMedia: { el: document.getElementById('social-media'), text: 'Integración con Redes Sociales' },
        ssl: { el: document.getElementById('ssl'), text: 'Certificado SSL (Primer año)' },
        ecommerce: { el: document.getElementById('ecommerce'), text: 'Funcionalidad de Tienda Online' },
        paymentGateway: { el: document.getElementById('payment-gateway'), text: 'Pasarela de Pago (Stripe/PayPal)' },
        clientName: { el: document.getElementById('client-name'), text: 'Nombre del Cliente' },
        projectName: { el: document.getElementById('project-name'), text: 'Nombre del Proyecto' }
    };
    const paymentGatewayLabel = document.querySelector('label[for="payment-gateway"]');
    const totalCostEl = document.getElementById('total-cost');
    const summaryListEl = document.getElementById('summary-list');

    // --- Funciones de Lógica --- //

    const calculateTotal = () => {
        let total = 0;
        // Itera sobre todos los inputs para calcular el total
        Object.values(allInputs).forEach(item => {
            if (item.el.type === 'checkbox' && item.el.checked) {
                total += parseInt(item.el.dataset.price, 10);
            } else if (item.el.type === 'number') {
                const count = parseInt(item.el.value, 10) || 0;
                if (count > 0) {
                    total += count * parseInt(item.el.dataset.pricePerPage, 10);
                }
            } else if (item.el.type === 'text') {
                // Los campos de texto no afectan el precio
                return;
            }
        });
        totalCostEl.textContent = `${total.toLocaleString('es-MX')}`;
    };

    const handleEcommerceChange = () => {
        const isEcommerceChecked = allInputs.ecommerce.el.checked;
        allInputs.paymentGateway.el.disabled = !isEcommerceChecked;
        paymentGatewayLabel.classList.toggle('disabled-label', !isEcommerceChecked);
        if (!isEcommerceChecked) {
            allInputs.paymentGateway.el.checked = false;
        }
        calculateTotal();
    };

    const updateSummary = () => {
        summaryListEl.innerHTML = ''; // Limpiar resumen anterior
        const summaryItems = [];

        Object.values(allInputs).forEach(item => {
            let price = 0;
            let text = '';

            if (item.el.type === 'checkbox' && item.el.checked) {
                price = parseInt(item.el.dataset.price, 10);
                text = item.text;
            } else if (item.el.type === 'number' && parseInt(item.el.value, 10) > 0) {
                const count = parseInt(item.el.value, 10);
                price = count * parseInt(item.el.dataset.pricePerPage, 10);
                text = `${count} x ${item.text}`;
            } else if (item.el.type === 'text' && item.el.value) {
                // No agregamos textos al resumen visual, solo al de WhatsApp
                return;
            }

            if (price > 0) {
                summaryItems.push(`<li><span class="summary-item">${text}</span> <span class="summary-price">${price.toLocaleString('es-MX')}</span></li>`);
            }
        });

        if (summaryItems.length > 0) {
            summaryListEl.innerHTML = `<ul>${summaryItems.join('')}</ul>`;
        } else {
            summaryListEl.innerHTML = '<p>No has seleccionado ninguna opción adicional.</p>';
        }
    };

    // --- Funciones de Navegación --- //

    const showStep = (stepIndex) => {
        steps.forEach((step, index) => {
            step.classList.toggle('active-step', index === stepIndex);
        });

        // Actualizar botones
        prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-block';
        nextBtn.style.display = stepIndex === steps.length - 1 ? 'none' : 'inline-block';
        whatsappBtn.style.display = stepIndex === steps.length - 1 ? 'inline-block' : 'none';

        // El botón "Siguiente" se convierte en "Finalizar" en el penúltimo paso
        nextBtn.textContent = stepIndex === steps.length - 2 ? 'Finalizar y ver Resumen' : 'Siguiente';

        // Si es el último paso (resumen), actualizar el contenido
        if (stepIndex === steps.length - 1) {
            updateSummary();
        }
    };

    const navigate = (direction) => {
        if (currentStep === steps.length - 1 && direction === 1) {
            // Este caso ya no ocurre porque el botón "Siguiente" se oculta
            return;
        }

        // Validar que el nombre del cliente no esté vacío antes de ir al resumen
        if (currentStep === steps.length - 2 && direction === 1) {
            if (!allInputs.clientName.el.value.trim()) {
                alert('Por favor, introduce tu nombre para continuar.');
                return;
            }
        }

        currentStep += direction;
        showStep(currentStep);
    };

    // --- Inicialización y Event Listeners --- //

    // Listeners para todos los inputs para recalcular en tiempo real
    Object.values(allInputs).forEach(item => {
        item.el.addEventListener('change', calculateTotal);
        if (item.el.type === 'number') {
            item.el.addEventListener('input', calculateTotal);
        }
    });

    // Listener específico para e-commerce
    allInputs.ecommerce.el.addEventListener('change', handleEcommerceChange);

    // Listeners para botones de navegación
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
    whatsappBtn.addEventListener('click', sendWhatsAppMessage);

    // --- Lógica de WhatsApp ---
    function sendWhatsAppMessage() {
        const clientName = allInputs.clientName.el.value.trim();
        const projectName = allInputs.projectName.el.value.trim();
        const total = totalCostEl.textContent;

        if (!clientName) {
            alert('Por favor, regresa al paso anterior e introduce tu nombre.');
            return;
        }

        let message = `¡Hola! 👋 Soy ${clientName} y me gustaría solicitar un presupuesto con los siguientes detalles:\n\n`;
        if (projectName) {
            message += `*Proyecto:* ${projectName}\n\n`;
        }

        message += `*DETALLES DEL PRESUPUESTO:*\n`;
        let hasItems = false;

        Object.values(allInputs).forEach(item => {
            let price = 0;
            let text = '';
            let shouldInclude = false;

            if (item.el.type === 'checkbox' && item.el.checked) {
                price = parseInt(item.el.dataset.price, 10);
                text = item.text;
                shouldInclude = true;
            } else if (item.el.type === 'number' && parseInt(item.el.value, 10) > 0) {
                const count = parseInt(item.el.value, 10);
                price = count * parseInt(item.el.dataset.pricePerPage, 10);
                text = `${count} x ${item.text}`;
                shouldInclude = true;
            }

            if (shouldInclude) {
                hasItems = true;
                message += `- ${text}: *${price.toLocaleString('es-MX')}*\n`;
            }
        });

        if (!hasItems) {
            message += `- No se seleccionaron opciones adicionales.\n`;
        }

        message += `\n*He obtenido un presupuesto estimado de:*\n`;
        message += `*~${total} MXN*\n\n`;
        message += `¡Quedo a la espera de su respuesta!`;

        const telefono = '525623229505'; // Tu número de WhatsApp
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    }

    // --- Estado Inicial ---
    showStep(currentStep);
    handleEcommerceChange();
    calculateTotal();
});
