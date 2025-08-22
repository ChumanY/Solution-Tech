import { http } from 'msw';

const LS_CHATS = 'solutiontech_chats';
const LS_MESSAGES = 'solutiontech_messages';

function loadChats() {
    const raw = window.localStorage.getItem(LS_CHATS);
    if (raw) return JSON.parse(raw);
    const defaultChats = [
        { id: 1, name: 'Nuevo Chat' }
    ];
    window.localStorage.setItem(LS_CHATS, JSON.stringify(defaultChats));
    return defaultChats;
}

function saveChats(chats: any) {
    window.localStorage.setItem(LS_CHATS, JSON.stringify(chats));
}

function loadMessages() {
    const raw = window.localStorage.getItem(LS_MESSAGES);
    if (raw) return JSON.parse(raw);
    const defaultMessages = {
        '1': [
            { id: 1, text: '¡Hola! ¿En qué puedo ayudarte?', sender: 'bot' },
        ]
    };
    window.localStorage.setItem(LS_MESSAGES, JSON.stringify(defaultMessages));
    return defaultMessages;
}

function saveMessages(messages: any) {
    window.localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
}

export const handlers = [
    http.delete('/api/chats/:chatId', ({ params }) => {
        const chatId = String(params.chatId);
        let chats = loadChats();
        let messages = loadMessages();
        chats = chats.filter((c: any) => String(c.id) !== chatId);
        delete messages[chatId];
        saveChats(chats);
        saveMessages(messages);
        return Response.json({ success: true }, { status: 200 });
    }),
    http.patch('/api/chats/:chatId', async ({ params, request }) => {
        const chatId = String(params.chatId);
        const body = await request.json();
        let name = '';
        if (body && typeof body === 'object' && 'name' in body) {
            name = (body as Record<string, any>).name;
        }
        const chats = loadChats();
        const idx = chats.findIndex((c: any) => String(c.id) === chatId);
        if (idx !== -1 && name.trim()) {
            chats[idx].name = name;
            saveChats(chats);
            return Response.json(chats[idx], { status: 200 });
        }
        return Response.json({ error: 'Chat not found or invalid name' }, { status: 400 });
    }),
    http.get('/api/chats', () => {
        const chats = loadChats();
        return Response.json(chats);
    }),

    http.get('/api/chats/:chatId/messages', ({ params }) => {
        const chatId = String(params.chatId);
        const messages = loadMessages();
        return Response.json(messages[chatId] || []);
    }),

    http.post('/api/chats', async ({ request }) => {
        const body = await request.json();
        let name = 'Nuevo Chat';
        if (body && typeof body === 'object' && 'name' in body && body.name.trim() !== '') {
            name = (body as Record<string, any>).name;
        }
        const chats = loadChats();
        const messages = loadMessages();
        const maxId = chats.length > 0 ? Math.max(...chats.map((c: any) => Number(c.id))) : 0;
        const newId = (maxId + 1).toString();
        chats.push({ id: Number(newId), name });
        messages[newId] = [
            { id: 1, text: '¡Hola! ¿En qué puedo ayudarte?', sender: 'bot' }
        ];
        saveChats(chats);
        saveMessages(messages);
        return Response.json({ id: Number(newId), name }, { status: 201 });
    }),


    http.post('/api/chats/:chatId/messages', async ({ params, request }) => {
        const chatId = String(params.chatId);
        const body = await request.json();
        let text = '';
        let sender = '';
        if (body && typeof body === 'object') {
            if ('text' in body) text = (body as Record<string, any>).text;
            if ('sender' in body) sender = (body as Record<string, any>).sender;
        }
        const messages = loadMessages();
        const msgList = messages[chatId] || [];
        const newMsg = { id: msgList.length + 1, text, sender };
        msgList.push(newMsg);
        let botText = 'Esta es una respuesta automática.';
        const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const normText = normalize(text);
        if (normText.includes('organigrama')) {
            botText = 'El organigrama de SOLUTION TECH está compuesto por Dirección General, Desarrollo, Soporte y Ventas.';
        } else if (normText.includes('mision')) {
            botText = 'Nuestra misión es ofrecer soluciones tecnológicas innovadoras y de calidad.';
        } else if (normText.includes('vision')) {
            botText = 'Nuestra visión es ser líderes en desarrollo de software en Latinoamérica.';
        } else if (normText.includes('proyecto')) {
            botText = 'Actualmente desarrollamos proyectos de inteligencia artificial, web y mobile para diversos sectores.';
        }
        const botMsg = { id: msgList.length + 1, text: botText, sender: 'bot' };
        msgList.push(botMsg);
        messages[chatId] = msgList;
        saveMessages(messages);
        return Response.json(newMsg, { status: 201 });
    })
];
