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

function convertToPDF() {
    if (!frenteImage || !dorsoImage) {
        showStatus('Por favor sube ambas imágenes antes de convertir', 'error');
        return;
    }

    showStatus('Generando PDF...', 'info');
    convertBtn.disabled = true;

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

        // Procesar imagen del frente
        const frenteSize = resizeImageToFit(frenteImage, contentWidth, imageHeight);
        const frenteX = margin + (contentWidth - frenteSize.width) / 2;
        const frenteY = margin;

        // Procesar imagen del dorso
        const dorsoSize = resizeImageToFit(dorsoImage, contentWidth, imageHeight);
        const dorsoX = margin + (contentWidth - dorsoSize.width) / 2;
        const dorsoY = margin + imageHeight + margin;

        // Agregar imágenes al PDF
        pdf.addImage(frenteImage, 'JPEG', frenteX, frenteY, frenteSize.width, frenteSize.height);
        pdf.addImage(dorsoImage, 'JPEG', dorsoX, dorsoY, dorsoSize.width, dorsoSize.height);

        // Generar nombre de archivo con timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `carnet_${timestamp}.pdf`;

        // Descargar el PDF
        pdf.save(filename);
        
        showStatus('¡PDF generado y descargado exitosamente!', 'success');
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        showStatus('Error al generar el PDF. Inténtalo de nuevo.', 'error');
    } finally {
        convertBtn.disabled = false;
    }
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
