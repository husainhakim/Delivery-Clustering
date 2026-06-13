import ZoneOperationLog from '../models/ZoneOperationLog.js';

class OperationLogger {
  constructor() {
    this.queue = [];
    this.flushInterval = 5000; // 5 seconds
    this.timeoutId = null;
  }

  log(operation) {
    this.queue.push({ ...operation, timestamp: new Date() });
    
    if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => this.flush(), this.flushInterval);
    }
    
    // Force flush if queue is too large
    if (this.queue.length >= 50) {
      this.flush();
    }
  }

  async flush() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.queue.length === 0) return;

    const itemsToFlush = [...this.queue];
    this.queue = [];

    try {
      await ZoneOperationLog.insertMany(itemsToFlush);
      console.log(`[OperationLogger] Flushed ${itemsToFlush.length} logs to DB`);
    } catch (err) {
      console.error('[OperationLogger] Error flushing logs:', err);
      // Requeue failed logs (careful not to grow infinitely if DB is permanently down, but okay for this scope)
      this.queue = [...itemsToFlush, ...this.queue];
    }
  }
}

export const operationLogger = new OperationLogger();
