# Solution Tech Chat App

Aplicativo tipo chat para consultas autónomas sobre la empresa SOLUTION TECH.

## Instalación y Deploy

1. Clona el repositorio.
2. 
```bash
pnpm install
pnpm run dev
```

## Stack Técnico
- **Framework:** Next.js 15
- **Estilos:** Tailwind CSS
- **Componentes UI:** ShadCN UI
- **Cliente de datos:** React Query
- **Mock de APIs:** MSW (Mock Service Worker)
- **Gestión de paquetes:** pnpm

## Funcionalidades
- **Chat interactivo:**
	- Inicia nuevos chats y realiza consultas libres.
	- Respuestas automáticas simuladas por MSW.
	- Adjunta imágenes (JPG, PNG), videos (MP4) y PDFs.
- **Historial de chats:**
	- Visualiza y accede a conversaciones anteriores.
	- Continúa cualquier chat desde donde lo dejaste.
- **Búsqueda en historial:**
	- Filtra chats por contenido de mensajes.
- **Gestión de conversaciones:**
	- Elimina cualquier chat del historial.



## Arquitectura
- **src/app/page.tsx:** Lógica principal y composición de la app.
- **src/components/chat/**: Componentes de UI y lógica de chat.
- **src/mocks/handlers.ts:** Mock de endpoints y lógica de negocio con MSW.



---

