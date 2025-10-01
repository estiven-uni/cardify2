// Variables globales para almacenar las imágenes
let frenteImage = null;
let dorsoImage = null;

// Elementos del DOM
const frenteInput = document.getElementById('frente-input');
const dorsoInput = document.getElementById('dorso-input');
const frenteUpload = document.getElementById('frente-upload');
const dorsoUpload = document.getElementById('dorso-upload');
const frentePreview = document.getElementById('frente-preview');
const dorsoPreview = document.getElementById('dorso-preview');
const frentePlaceholder = document.getElementById('frente-placeholder');
const dorsoPlaceholder = document.getElementById('dorso-placeholder');
const frenteImg = document.getElementById('frente-img');
const dorsoImg = document.getElementById('dorso-img');
const convertBtn = document.getElementById('convert-btn');
const statusMessage = document.getElementById('status-message');
const statusText = document.getElementById('status-text');

// Controles de ajuste
const frenteScale = document.getElementById('frente-scale');
const frenteX = document.getElementById('frente-x');
const frenteY = document.getElementById('frente-y');
const dorsoScale = document.getElementById('dorso-scale');
const dorsoX = document.getElementById('dorso-x');
const dorsoY = document.getElementById('dorso-y');
const resetControlsBtn = document.getElementById('reset-controls-btn');

// Loader
const loaderOverlay = document.getElementById('loader-overlay');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Event listeners para inputs de archivo
    frenteInput.addEventListener('change', (e) => handleFileSelect(e, 'frente'));
    dorsoInput.addEventListener('change', (e) => handleFileSelect(e, 'dorso'));

    // Event listeners para drag and drop
    setupDragAndDrop('frente');
    setupDragAndDrop('dorso');

    // Event listener para el botón de conversión
    convertBtn.addEventListener('click', convertToPDF);

    // Event listeners para controles de ajuste
    setupControlListeners();
    
    // Event listener para botón de reiniciar
    resetControlsBtn.addEventListener('click', resetControls);
}

function setupControlListeners() {
    // Frente
    frenteScale.addEventListener('input', (e) => {
        document.getElementById('frente-scale-value').textContent = e.target.value + '%';
    });
    
    frenteX.addEventListener('input', (e) => {
        document.getElementById('frente-x-value').textContent = e.target.value + 'mm';
    });
    
    frenteY.addEventListener('input', (e) => {
        document.getElementById('frente-y-value').textContent = e.target.value + 'mm';
    });
    
    // Dorso
    dorsoScale.addEventListener('input', (e) => {
        document.getElementById('dorso-scale-value').textContent = e.target.value + '%';
    });
    
    dorsoX.addEventListener('input', (e) => {
        document.getElementById('dorso-x-value').textContent = e.target.value + 'mm';
    });
    
    dorsoY.addEventListener('input', (e) => {
        document.getElementById('dorso-y-value').textContent = e.target.value + 'mm';
    });
}

function resetControls() {
    // Reiniciar valores a los valores por defecto
    frenteScale.value = 70;
    frenteX.value = 0;
    frenteY.value = 20;
    dorsoScale.value = 70;
    dorsoX.value = 0;
    dorsoY.value = -20;
    
    // Actualizar displays
    document.getElementById('frente-scale-value').textContent = '70%';
    document.getElementById('frente-x-value').textContent = '0mm';
    document.getElementById('frente-y-value').textContent = '20mm';
    document.getElementById('dorso-scale-value').textContent = '70%';
    document.getElementById('dorso-x-value').textContent = '0mm';
    document.getElementById('dorso-y-value').textContent = '-20mm';
}

function setupDragAndDrop(type) {
    const uploadArea = document.getElementById(`${type}-upload`);
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect({ target: { files } }, type);
        }
    });
}

function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        showStatus('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showStatus('El archivo es demasiado grande. Máximo 10MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Almacenar la imagen
            if (type === 'frente') {
                frenteImage = img;
                showImagePreview(img, 'frente');
            } else {
                dorsoImage = img;
                showImagePreview(img, 'dorso');
            }
            
            checkIfCanConvert();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function showImagePreview(img, type) {
    const preview = document.getElementById(`${type}-preview`);
    const placeholder = document.getElementById(`${type}-placeholder`);
    const imgElement = document.getElementById(`${type}-img`);

    imgElement.src = img.src;
    preview.classList.remove('hidden');
    placeholder.classList.add('hidden');
}

function checkIfCanConvert() {
    if (frenteImage && dorsoImage) {
        convertBtn.disabled = false;
        showStatus('¡Listo para convertir!', 'success');
    } else {
        convertBtn.disabled = true;
        hideStatus();
    }
}

function showStatus(message, type) {
    statusText.textContent = message;
    statusText.className = `text-sm ${type === 'error' ? 'text-red-600' : 'text-green-600'}`;
    statusMessage.classList.remove('hidden');
}

function hideStatus() {
    statusMessage.classList.add('hidden');
}

function showLoader() {
    loaderOverlay.classList.remove('hidden');
}

function hideLoader() {
    loaderOverlay.classList.add('hidden');
}

// Función para crear una imagen con esquinas redondeadas
function createRoundedImage(img, borderRadius = 20) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Establecer el tamaño del canvas igual al de la imagen
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Crear el path con esquinas redondeadas
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(canvas.width - borderRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, borderRadius);
    ctx.lineTo(canvas.width, canvas.height - borderRadius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - borderRadius, canvas.height);
    ctx.lineTo(borderRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    
    // Recortar y dibujar la imagen
    ctx.clip();
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Retornar la imagen como base64
    return canvas.toDataURL('image/png');
}

function convertToPDF() {
    if (!frenteImage || !dorsoImage) {
        showStatus('Por favor sube ambas imágenes antes de convertir', 'error');
        return;
    }

    // Mostrar loader y deshabilitar botón
    showLoader();
    convertBtn.disabled = true;
    hideStatus();

    // Usar setTimeout para permitir que el DOM se actualice antes del proceso pesado
    setTimeout(() => {
        try {
        // Crear nuevo documento PDF en formato A4 (210 x 297 mm)
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Dimensiones A4 en mm
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const contentWidth = pageWidth - (margin * 2);
        
        // Calcular altura para cada imagen (mitad de la página menos márgenes)
        const imageHeight = (pageHeight - (margin * 3)) / 2;

        // Función para redimensionar imagen manteniendo proporción
        function resizeImageToFit(img, maxWidth, maxHeight) {
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            return {
                width: img.width * ratio,
                height: img.height * ratio
            };
        }

        // Obtener valores de los controles
        const frenteScaleValue = parseFloat(frenteScale.value) / 100;
        const frenteXOffset = parseFloat(frenteX.value);
        const frenteYOffset = parseFloat(frenteY.value);
        const dorsoScaleValue = parseFloat(dorsoScale.value) / 100;
        const dorsoXOffset = parseFloat(dorsoX.value);
        const dorsoYOffset = parseFloat(dorsoY.value);

        // Crear imágenes con esquinas redondeadas
        const frenteRounded = createRoundedImage(frenteImage, 70);
        const dorsoRounded = createRoundedImage(dorsoImage, 70);

        // Procesar imagen del frente con escala personalizada
        let frenteSize = resizeImageToFit(frenteImage, contentWidth, imageHeight);
        frenteSize.width *= frenteScaleValue;
        frenteSize.height *= frenteScaleValue;
        const frenteXPos = margin + (contentWidth - frenteSize.width) / 2 + frenteXOffset;
        const frenteYPos = margin + frenteYOffset;

        // Procesar imagen del dorso con escala personalizada
        let dorsoSize = resizeImageToFit(dorsoImage, contentWidth, imageHeight);
        dorsoSize.width *= dorsoScaleValue;
        dorsoSize.height *= dorsoScaleValue;
        const dorsoXPos = margin + (contentWidth - dorsoSize.width) / 2 + dorsoXOffset;
        const dorsoYPos = margin + imageHeight + margin + dorsoYOffset;

        // Agregar imágenes con esquinas redondeadas al PDF
        pdf.addImage(frenteRounded, 'PNG', frenteXPos, frenteYPos, frenteSize.width, frenteSize.height);
        pdf.addImage(dorsoRounded, 'PNG', dorsoXPos, dorsoYPos, dorsoSize.width, dorsoSize.height);

        // Generar nombre de archivo con timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `carnet_${timestamp}.pdf`;

        // Descargar el PDF
        pdf.save(filename);
        
        // Ocultar loader y mostrar mensaje de éxito
        hideLoader();
        showStatus('¡PDF generado y descargado exitosamente!', 'success');
        
        } catch (error) {
            console.error('Error al generar PDF:', error);
            hideLoader();
            showStatus('Error al generar el PDF. Inténtalo de nuevo.', 'error');
        } finally {
            convertBtn.disabled = false;
        }
    }, 100); // Pequeño delay para actualizar el DOM
}

// Función para limpiar las imágenes (opcional)
function clearImages() {
    frenteImage = null;
    dorsoImage = null;
    
    frentePreview.classList.add('hidden');
    dorsoPreview.classList.add('hidden');
    frentePlaceholder.classList.remove('hidden');
    dorsoPlaceholder.classList.remove('hidden');
    
    frenteInput.value = '';
    dorsoInput.value = '';
    
    checkIfCanConvert();
}
