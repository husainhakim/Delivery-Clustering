import { EventEmitter } from 'events';
import TrackingLog from '../models/TrackingLog.js';

class LoggerService extends EventEmitter {
  constructor() {
    super();

    // Listen to events and asynchronously write to the database
    this.on('log', async (eventType, details) => {
      try {
        await TrackingLog.create({ eventType, details });
        console.log(`[Logger] Logged event: ${eventType}`);
      } catch (error) {
        console.error(`[Logger Error] Failed to save log:`, error);
      }
    });
  }

  /**
   * Log an event asynchronously without blocking the main execution thread.
   * @param {string} eventType 
   * @param {Object} details 
   */
  logEvent(eventType, details) {
    // emit is synchronous for listeners, but since our listener is `async`, 
    // it will return a promise immediately and not block the caller.
    this.emit('log', eventType, details);
  }
}

export default new LoggerService();
