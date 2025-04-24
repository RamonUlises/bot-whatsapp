import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message_create", async (msg) => {
  if (!msg.fromMe) return; // Solo reaccionar si el mensaje lo mandaste tú

  if (msg.body.toLowerCase() === "@everyone") {
    const chat = await msg.getChat();

    if (!chat.isGroup) {
      return console.log("Este comando solo funciona en grupos.");
    }

    let text = '';
    let mentions = [];

    for (let participant of chat.participants) {
        mentions.push(`${participant.id.user}@c.us`);
        text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  }
});

client.initialize();
