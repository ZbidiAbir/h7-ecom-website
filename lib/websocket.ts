import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });
let clients: { [userId: string]: any[] } = {};

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams(req.url?.split("?")[1]);
  const userId = params.get("userId");
  if (!userId) return;

  if (!clients[userId]) clients[userId] = [];
  clients[userId].push(ws);

  ws.on("close", () => {
    clients[userId] = clients[userId].filter((c) => c !== ws);
  });
});

console.log("WS server running on port 3001");

// Fonction pour notifier un utilisateur depuis n’importe quel code
export function sendNotification(notification: any) {
  const { userId } = notification;
  if (!clients[userId]) return;
  clients[userId].forEach((ws) => ws.send(JSON.stringify(notification)));
}
