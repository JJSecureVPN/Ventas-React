# Sistema de Gestión de Almacén

Sistema completo para gestionar almacenes de bebidas, comestibles y artículos de limpieza. Desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Dashboard**: Vista general con estadísticas y alertas de stock
- **Gestión de Productos**: CRUD completo de productos con categorías
- **Sistema de Ventas**: Proceso de venta completo con cálculo de impuestos
- **Control de Stock**: Registro de entradas, salidas y ajustes de inventario
- **Reportes**: Estadísticas y análisis de ventas por períodos

## 🎨 Diseño

- Tema oscuro moderno inspirado en ChatGPT
- Interfaz responsiva y amigable
- Iconos de Lucide React
- Componentes reutilizables

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS 3.4.0
- **Routing**: React Router DOM
- **Iconos**: Lucide React
- **Build Tool**: Vite
- **Almacenamiento**: LocalStorage (demo)

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd gestion-de-almacen
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el proyecto:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5174`

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📚 Estructura del Proyecto

```
src/
├── components/
│   └── Layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── Sales.tsx
│   ├── Stock.tsx
│   └── Reports.tsx
├── services/
│   └── storage.ts
├── types/
│   └── index.ts
├── App.tsx
├── index.css
└── main.tsx
```

## 💡 Uso

### Productos
- Agrega, edita y elimina productos
- Organiza por categorías (bebidas, comestibles, limpieza, otros)
- Control de stock mínimo con alertas automáticas

### Ventas
- Proceso de venta intuitivo
- Búsqueda de productos por nombre o código de barras
- Cálculo automático de impuestos (18% IVA)
- Múltiples métodos de pago

### Stock
- Registro de movimientos de inventario
- Entradas, salidas y ajustes
- Vista de estado actual del inventario
- Historial de movimientos

### Reportes
- Estadísticas de ventas por período
- Productos más vendidos
- Análisis por categorías
- Resumen de inventario

## 🎯 Características Técnicas

- **Responsive Design**: Adaptable a todos los dispositivos
- **TypeScript**: Tipado fuerte para mejor desarrollo
- **Componentización**: Arquitectura modular y reutilizable
- **Estado Local**: Gestión eficiente con hooks de React
- **Persistencia**: Datos guardados en LocalStorage

## 🚀 Próximas Mejoras

- [ ] Integración con base de datos real
- [ ] Sistema de usuarios y autenticación
- [ ] Exportación de reportes a PDF/Excel
- [ ] Integración con lectores de código de barras
- [ ] Sistema de notificaciones push
- [ ] Dashboard en tiempo real

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, no dudes en abrir un issue.

---

⭐ ¡No olvides dar una estrella al proyecto si te fue útil!
