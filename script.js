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

// Preview
const previewCanvas = document.getElementById('preview-canvas');
const previewPlaceholder = document.getElementById('preview-placeholder');
const previewCtx = previewCanvas ? previewCanvas.getContext('2d') : null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializePreviewCanvas();
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
        updatePreview();
    });
    
    frenteX.addEventListener('input', (e) => {
        document.getElementById('frente-x-value').textContent = e.target.value + 'mm';
        updatePreview();
    });
    
    frenteY.addEventListener('input', (e) => {
        document.getElementById('frente-y-value').textContent = e.target.value + 'mm';
        updatePreview();
    });
    
    // Dorso
    dorsoScale.addEventListener('input', (e) => {
        document.getElementById('dorso-scale-value').textContent = e.target.value + '%';
        updatePreview();
    });
    
    dorsoX.addEventListener('input', (e) => {
        document.getElementById('dorso-x-value').textContent = e.target.value + 'mm';
        updatePreview();
    });
    
    dorsoY.addEventListener('input', (e) => {
        document.getElementById('dorso-y-value').textContent = e.target.value + 'mm';
        updatePreview();
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
    
    // Actualizar preview
    updatePreview();
}

function initializePreviewCanvas() {
    if (!previewCanvas) return;
    
    // Tamaño A4 en proporción (210 x 297 mm)
    const maxWidth = previewCanvas.parentElement.clientWidth - 40;
    const aspectRatio = 297 / 210;
    const width = Math.min(maxWidth, 300);
    const height = width * aspectRatio;
    
    previewCanvas.width = width;
    previewCanvas.height = height;
    previewCanvas.style.maxWidth = '100%';
}

function updatePreview() {
    if (!previewCanvas || !previewCtx || (!frenteImage && !dorsoImage)) {
        if (previewPlaceholder) {
            previewPlaceholder.style.display = 'block';
            previewPlaceholder.classList.remove('hidden');
        }
        if (previewCanvas) {
            previewCanvas.style.display = 'none';
            previewCanvas.classList.add('hidden');
        }
        return;
    }
    
    // Ocultar placeholder y mostrar canvas
    if (previewPlaceholder) {
        previewPlaceholder.style.display = 'none';
        previewPlaceholder.classList.add('hidden');
    }
    previewCanvas.style.display = 'block';
    previewCanvas.classList.remove('hidden');
    
    const canvasWidth = previewCanvas.width;
    const canvasHeight = previewCanvas.height;
    
    // Limpiar canvas
    previewCtx.fillStyle = '#FFFFFF';
    previewCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Obtener valores de los controles
    const frenteScaleValue = parseFloat(frenteScale.value) / 100;
    const frenteXOffset = parseFloat(frenteX.value) * (canvasWidth / 210); // Convertir mm a px del canvas
    const frenteYOffset = parseFloat(frenteY.value) * (canvasHeight / 297);
    const dorsoScaleValue = parseFloat(dorsoScale.value) / 100;
    const dorsoXOffset = parseFloat(dorsoX.value) * (canvasWidth / 210);
    const dorsoYOffset = parseFloat(dorsoY.value) * (canvasHeight / 297);
    
    const margin = canvasWidth * 0.05; // 5% de margen
    const contentWidth = canvasWidth - (margin * 2);
    const imageHeight = (canvasHeight - (margin * 3)) / 2;
    
    // Dibujar frente si existe
    if (frenteImage) {
        const ratio = Math.min(contentWidth / frenteImage.width, imageHeight / frenteImage.height);
        let frenteW = frenteImage.width * ratio * frenteScaleValue;
        let frenteH = frenteImage.height * ratio * frenteScaleValue;
        const frenteX = margin + (contentWidth - frenteW) / 2 + frenteXOffset;
        const frenteY = margin + frenteYOffset;
        
        // Dibujar con esquinas redondeadas
        drawRoundedImage(previewCtx, frenteImage, frenteX, frenteY, frenteW, frenteH, 10);
    }
    
    // Dibujar dorso si existe
    if (dorsoImage) {
        const ratio = Math.min(contentWidth / dorsoImage.width, imageHeight / dorsoImage.height);
        let dorsoW = dorsoImage.width * ratio * dorsoScaleValue;
        let dorsoH = dorsoImage.height * ratio * dorsoScaleValue;
        const dorsoX = margin + (contentWidth - dorsoW) / 2 + dorsoXOffset;
        const dorsoY = margin + imageHeight + margin + dorsoYOffset;
        
        // Dibujar con esquinas redondeadas
        drawRoundedImage(previewCtx, dorsoImage, dorsoX, dorsoY, dorsoW, dorsoH, 10);
    }
}

function drawRoundedImage(ctx, img, x, y, width, height, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
    
    // Dibujar borde
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
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
    const uploadArea = document.getElementById(`${type}-upload`);

    imgElement.src = img.src;
    preview.classList.remove('hidden');
    placeholder.classList.add('hidden');
    uploadArea.classList.add('has-image');
    
    // Actualizar preview
    updatePreview();
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

// Función para comprimir y redimensionar imagen
function compressImage(img, maxWidth = 1200, maxHeight = 1600) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calcular nuevas dimensiones manteniendo la proporción
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Dibujar la imagen redimensionada
    ctx.drawImage(img, 0, 0, width, height);
    
    return { canvas, width, height };
}

// Función para crear una imagen con esquinas redondeadas (SIN comprimir)
function createRoundedImageHighQuality(img, borderRadius = 70) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Fondo blanco para consistencia
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calcular el radio de borde - usar un porcentaje mayor para esquinas más visibles
    const scaledBorderRadius = Math.min(borderRadius, img.width * 0.08, img.height * 0.08);
    
    // Crear el path con esquinas redondeadas
    ctx.beginPath();
    ctx.moveTo(scaledBorderRadius, 0);
    ctx.lineTo(canvas.width - scaledBorderRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, scaledBorderRadius);
    ctx.lineTo(canvas.width, canvas.height - scaledBorderRadius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - scaledBorderRadius, canvas.height);
    ctx.lineTo(scaledBorderRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - scaledBorderRadius);
    ctx.lineTo(0, scaledBorderRadius);
    ctx.quadraticCurveTo(0, 0, scaledBorderRadius, 0);
    ctx.closePath();
    
    // Recortar y dibujar la imagen original sin comprimir
    ctx.clip();
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Retornar la imagen en PNG de alta calidad (sin pérdida)
    return canvas.toDataURL('image/png', 1.0);
}

// Función para crear una imagen con esquinas redondeadas y comprimida
function createRoundedImageCompressed(img, borderRadius = 70) {
    // Primero comprimir la imagen
    const { canvas: tempCanvas, width, height } = compressImage(img);
    
    // Crear nuevo canvas para las esquinas redondeadas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Fondo blanco (importante para JPEG que no soporta transparencia)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calcular el radio de borde - usar un valor fijo más grande basado en el tamaño
    const scaledBorderRadius = Math.min(borderRadius * (width / img.width), width * 0.08, height * 0.08);
    
    // Crear el path con esquinas redondeadas
    ctx.beginPath();
    ctx.moveTo(scaledBorderRadius, 0);
    ctx.lineTo(canvas.width - scaledBorderRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, scaledBorderRadius);
    ctx.lineTo(canvas.width, canvas.height - scaledBorderRadius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - scaledBorderRadius, canvas.height);
    ctx.lineTo(scaledBorderRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - scaledBorderRadius);
    ctx.lineTo(0, scaledBorderRadius);
    ctx.quadraticCurveTo(0, 0, scaledBorderRadius, 0);
    ctx.closePath();
    
    // Recortar y dibujar la imagen
    ctx.clip();
    ctx.drawImage(tempCanvas, 0, 0, width, height);
    
    // Retornar la imagen como JPEG comprimido (calidad 0.85 para balance entre calidad y tamaño)
    return canvas.toDataURL('image/jpeg', 0.85);
}

function convertToPDF() {
    if (!frenteImage || !dorsoImage) {
        showStatus('Por favor sube ambas imágenes antes de convertir', 'error');
        return;
    }

    // Obtener opciones seleccionadas
    const format = document.querySelector('input[name="format"]:checked').value;
    const quality = document.querySelector('input[name="quality"]:checked').value;

    // Mostrar loader y deshabilitar botón
    showLoader();
    convertBtn.disabled = true;
    hideStatus();

    // Usar setTimeout para permitir que el DOM se actualice antes del proceso pesado
    setTimeout(() => {
        try {
            // Decidir qué formato exportar
            if (format === 'pdf') {
                exportToPDF(quality);
            } else if (format === 'jpg') {
                exportToImage('jpg', quality);
            } else if (format === 'png') {
                exportToImage('png', quality);
            }
        } catch (error) {
            console.error('Error al generar archivo:', error);
            hideLoader();
            showStatus('Error al generar el archivo. Inténtalo de nuevo.', 'error');
            convertBtn.disabled = false;
        }
    }, 100);
}

function exportToPDF(quality) {
    try {
        const isCompressed = quality === 'compressed';
        
        // Crear nuevo documento PDF en formato A4 (210 x 297 mm)
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: isCompressed
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

        // Crear imágenes con esquinas redondeadas según calidad
        const frenteRounded = isCompressed 
            ? createRoundedImageCompressed(frenteImage, 70)
            : createRoundedImageHighQuality(frenteImage, 70);
        const dorsoRounded = isCompressed 
            ? createRoundedImageCompressed(dorsoImage, 70)
            : createRoundedImageHighQuality(dorsoImage, 70);

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
        const imageFormat = isCompressed ? 'JPEG' : 'PNG';
        pdf.addImage(frenteRounded, imageFormat, frenteXPos, frenteYPos, frenteSize.width, frenteSize.height);
        pdf.addImage(dorsoRounded, imageFormat, dorsoXPos, dorsoYPos, dorsoSize.width, dorsoSize.height);

        // Generar nombre de archivo con timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const qualityLabel = isCompressed ? '_optimizado' : '_alta_calidad';
        const filename = `carnet${qualityLabel}_${timestamp}.pdf`;

        // Descargar el PDF
        pdf.save(filename);
        
        // Ocultar loader y mostrar mensaje de éxito
        hideLoader();
        showStatus('¡PDF generado y descargado exitosamente!', 'success');
        convertBtn.disabled = false;
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        hideLoader();
        showStatus('Error al generar el PDF. Inténtalo de nuevo.', 'error');
        convertBtn.disabled = false;
    }
}

function exportToImage(format, quality) {
    try {
        const isCompressed = quality === 'compressed';
        
        // Obtener valores de los controles
        const frenteScaleValue = parseFloat(frenteScale.value) / 100;
        const frenteXOffset = parseFloat(frenteX.value) * 3.78; // Convertir mm a px aprox
        const frenteYOffset = parseFloat(frenteY.value) * 3.78;
        const dorsoScaleValue = parseFloat(dorsoScale.value) / 100;
        const dorsoXOffset = parseFloat(dorsoX.value) * 3.78;
        const dorsoYOffset = parseFloat(dorsoY.value) * 3.78;

        // Crear canvas para la imagen combinada (A4 en píxeles: 794 x 1123)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 794;
        canvas.height = 1123;
        
        // Fondo blanco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Crear imágenes con esquinas redondeadas según calidad
        const frenteRounded = isCompressed 
            ? createRoundedImageCompressed(frenteImage, 70)
            : createRoundedImageHighQuality(frenteImage, 70);
        const dorsoRounded = isCompressed 
            ? createRoundedImageCompressed(dorsoImage, 70)
            : createRoundedImageHighQuality(dorsoImage, 70);

        // Cargar las imágenes procesadas
        const frenteImgElement = new Image();
        const dorsoImgElement = new Image();
        
        let loadedCount = 0;
        
        function checkBothLoaded() {
            loadedCount++;
            if (loadedCount === 2) {
                // Calcular dimensiones y posiciones
                const margin = 38; // 10mm en px
                const contentWidth = canvas.width - (margin * 2);
                const imageHeight = (canvas.height - (margin * 3)) / 2;
                
                // Frente
                const frenteRatio = Math.min(contentWidth / frenteImgElement.width, imageHeight / frenteImgElement.height);
                let frenteW = frenteImgElement.width * frenteRatio * frenteScaleValue;
                let frenteH = frenteImgElement.height * frenteRatio * frenteScaleValue;
                const frenteX = margin + (contentWidth - frenteW) / 2 + frenteXOffset;
                const frenteY = margin + frenteYOffset;
                
                // Dorso
                const dorsoRatio = Math.min(contentWidth / dorsoImgElement.width, imageHeight / dorsoImgElement.height);
                let dorsoW = dorsoImgElement.width * dorsoRatio * dorsoScaleValue;
                let dorsoH = dorsoImgElement.height * dorsoRatio * dorsoScaleValue;
                const dorsoX = margin + (contentWidth - dorsoW) / 2 + dorsoXOffset;
                const dorsoY = margin + imageHeight + margin + dorsoYOffset;
                
                // Dibujar en el canvas
                ctx.drawImage(frenteImgElement, frenteX, frenteY, frenteW, frenteH);
                ctx.drawImage(dorsoImgElement, dorsoX, dorsoY, dorsoW, dorsoH);
                
                // Descargar imagen
                const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
                const imageQuality = isCompressed ? 0.85 : 1.0;
                const dataURL = canvas.toDataURL(mimeType, imageQuality);
                
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                const qualityLabel = isCompressed ? '_optimizado' : '_alta_calidad';
                const filename = `carnet${qualityLabel}_${timestamp}.${format}`;
                
                // Crear link de descarga
                const link = document.createElement('a');
                link.download = filename;
                link.href = dataURL;
                link.click();
                
                // Ocultar loader y mostrar mensaje de éxito
                hideLoader();
                showStatus(`¡Imagen ${format.toUpperCase()} generada y descargada exitosamente!`, 'success');
                convertBtn.disabled = false;
            }
        }
        
        frenteImgElement.onload = checkBothLoaded;
        dorsoImgElement.onload = checkBothLoaded;
        frenteImgElement.src = frenteRounded;
        dorsoImgElement.src = dorsoRounded;
        
    } catch (error) {
        console.error('Error al generar imagen:', error);
        hideLoader();
        showStatus('Error al generar la imagen. Inténtalo de nuevo.', 'error');
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
