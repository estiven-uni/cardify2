# 🎴 Cardify

**Convertidor profesional de carnets a PDF/JPG/PNG con previsualización en tiempo real**

![Cardify Banner](icon.svg)

## 🌟 Características

- 📱 **Interfaz moderna e intuitiva** - Diseño limpio con gradientes y sombras profesionales
- 👁️ **Vista previa en tiempo real** - Ve exactamente cómo quedará tu archivo antes de descargarlo
- 🎨 **Esquinas redondeadas** - Diseño moderno con bordes suavizados
- 📊 **Múltiples formatos de salida**:
  - PDF (formato A4)
  - JPG (imagen única)
  - PNG (imagen única)
- ⚡ **Dos modos de calidad**:
  - Alta calidad sin comprimir
  - Optimizada (reduce hasta 80% el peso del archivo)
- 🎛️ **Controles avanzados**:
  - Ajuste de tamaño (50% - 150%)
  - Posición horizontal y vertical
  - Inputs numéricos y sliders sincronizados
- 📐 **Formato A4 perfecto** - Ideal para imprimir
- 🚀 **100% cliente** - No requiere backend, todo se procesa en el navegador

## 🖼️ Capturas de Pantalla

### Interfaz Principal
La aplicación cuenta con una interfaz dividida en dos columnas:
- **Izquierda**: Controles de carga, opciones de exportación y ajustes
- **Derecha**: Vista previa en tiempo real

## 🚀 Uso

1. **Sube las imágenes**:
   - Haz clic o arrastra y suelta el frente del carnet
   - Haz clic o arrastra y suelta el dorso del carnet

2. **Personaliza** (opcional):
   - Ajusta el tamaño de cada imagen
   - Modifica la posición horizontal y vertical
   - Selecciona el formato de salida (PDF, JPG o PNG)
   - Elige la calidad (Alta o Optimizada)

3. **Previsualiza**:
   - Observa en tiempo real cómo quedará tu archivo
   - La previsualización se actualiza automáticamente

4. **Descarga**:
   - Haz clic en "Generar y Descargar"
   - El archivo se descargará automáticamente

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **Tailwind CSS** - Diseño moderno y responsivo
- **JavaScript (ES6+)** - Lógica de la aplicación
- **Canvas API** - Manipulación de imágenes y vista previa
- **jsPDF** - Generación de archivos PDF
- **File API** - Manejo de archivos del usuario

## 📦 Instalación

No requiere instalación. Simplemente:

1. Clona el repositorio:
```bash
git clone https://github.com/estiven-uni/cardify2.git
```

2. Abre el archivo `index.html` en tu navegador

¡Eso es todo! No requiere servidor ni dependencias adicionales.

## 🌐 Demo en Vivo

Puedes usar la aplicación directamente abriendo el archivo `index.html` en tu navegador o desplegándola en cualquier servicio de hosting estático como:
- GitHub Pages
- Netlify
- Vercel

## 📝 Estructura del Proyecto

```
cardify2/
├── index.html          # Estructura principal de la aplicación
├── script.js           # Lógica y funcionalidad
├── icon.svg            # Ícono de la aplicación
├── README.md           # Documentación
└── recursos/           # Imágenes de ejemplo
```

## ⚙️ Configuración Predeterminada

- **Tamaño**: 70%
- **Posición Vertical Frente**: 45mm
- **Posición Vertical Dorso**: 5mm
- **Formato**: PDF
- **Calidad**: Optimizada

## 🎨 Características del Diseño

- **Gradientes suaves** de azul a púrpura
- **Esquinas redondeadas** en todos los elementos
- **Sombras sutiles** para profundidad
- **Iconos SVG** descriptivos
- **Responsive design** para móviles y tablets
- **Animaciones suaves** en transiciones

## 🔧 Personalización

Puedes personalizar fácilmente:

1. **Colores**: Modifica los gradientes en el CSS
2. **Valores por defecto**: Ajusta los valores en `script.js`
3. **Límites**: Cambia los min/max de los sliders en `index.html`
4. **Radio de esquinas**: Modifica el parámetro `borderRadius` en las funciones de imagen

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

## 👨‍💻 Autor

**Estiven Meneses**
- GitHub: [@estiven-uni](https://github.com/estiven-uni)

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Si tienes alguna idea o mejora:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes alguna sugerencia, por favor abre un [issue](https://github.com/estiven-uni/cardify2/issues).

## ⭐ Dale una estrella

Si este proyecto te ha sido útil, considera darle una estrella ⭐ en GitHub!

---

Hecho con ❤️ por Estiven Meneses
