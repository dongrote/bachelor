
const day = require('dayjs');

class SystemHealth {
  constructor() {
    this.startedAt = new day();
    this.websocketClients = [];
  }

  websocketClientConnect(client) {
    this.websocketClients.push(client.id);
  }

  websocketClientDisconnect(client) {
    this.websocketClients = this.websocketClients.filter(id => id !== client.id);
  }

  uptime() {
    const now = new day();
    return now.diff(this.startedAt);
  }

  report() {
    return {
      websockets: this.websocketClients,
      uptime: this.uptime(),
    };
  }
}

exports = module.exports = SystemHealth;