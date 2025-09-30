# Cardify - Convertidor de Carnets a PDF

Una aplicación web simple que permite convertir el frente y dorso de un carnet en un PDF de una sola página en formato A4 vertical.

## Características

- ✅ Interfaz intuitiva con Tailwind CSS
- ✅ Subida de imágenes por clic o drag & drop
- ✅ Validación de archivos (solo imágenes, máximo 10MB)
- ✅ Generación de PDF en formato A4 vertical
- ✅ Las imágenes se redimensionan automáticamente para ajustarse al formato
- ✅ Descarga automática del PDF generado

## Cómo usar

1. Abre `index.html` en tu navegador web
2. Sube la imagen del **frente** del carnet
3. Sube la imagen del **dorso** del carnet
4. Haz clic en "Convertir a PDF"
5. El PDF se descargará automáticamente

## Formato del PDF

- **Orientación**: Vertical (portrait)
- **Formato**: A4 (210 x 297 mm)
- **Distribución**: Frente arriba, dorso abajo
- **Márgenes**: 10mm en todos los lados
- **Redimensionado**: Las imágenes se ajustan automáticamente manteniendo sus proporciones

## Tecnologías utilizadas

- HTML5
- Tailwind CSS (CDN)
- JavaScript vanilla
- jsPDF (CDN)

## Requisitos

- Navegador web moderno
- Conexión a internet (para cargar las librerías CSS y JS)

## Instalación

No requiere instalación. Simplemente abre el archivo `index.html` en tu navegador.
