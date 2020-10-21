
const day = require('dayjs');

class SystemHealth {
  constructor() {
    this.startedAt = new day();
    this.websocketClients = [];
    this.db = {
      connected: false,
      location: null,
    };
  }

  websocketClientConnect(client) {
    this.websocketClients.push(client.id);
  }

  websocketClientDisconnect(client) {
    this.websocketClients = this.websocketClients.filter(id => id !== client.id);
  }

  databaseConnect(details) {
    this.db.connected = true;
    this.db.location = details;
  }

  databaseDisconnect() {
    this.db.connected = false;
    this.db.location = null;
  }

  uptime() {
    const now = new day();
    return now.diff(this.startedAt);
  }

  report() {
    return {
      websockets: this.websocketClients,
      uptime: this.uptime(),
      database: this.db,
    };
  }
}

exports = module.exports = SystemHealth;