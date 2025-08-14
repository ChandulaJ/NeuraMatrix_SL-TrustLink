import { Request, Response } from 'express';
import { EventEmitter } from 'events';

class SSEManager extends EventEmitter {
  private clients: Map<string, Response> = new Map();

  addClient(clientId: string, response: Response): void {
    this.clients.set(clientId, response);

    // Remove client when connection closes
    response.on('close', () => {
      this.clients.delete(clientId);
      console.log(`SSE client ${clientId} disconnected`);
    });
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  broadcast(event: string, data: any): void {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

    this.clients.forEach((response, clientId) => {
      try {
        response.write(message);
      } catch (error) {
        console.error(`Failed to send SSE to client ${clientId}:`, error);
        this.clients.delete(clientId);
      }
    });
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export const sseManager = new SSEManager();

export class SSEController {
  // Admin endpoint for appointment events
  adminAppointmentEvents(req: Request, res: Response): void {
    const clientId = `admin-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    // Send initial connection message
    res.write(
      `event: connected\ndata: ${JSON.stringify({
        message: 'Connected to appointment events',
        clientId,
        timestamp: new Date().toISOString(),
      })}\n\n`
    );

    // Add client to manager
    sseManager.addClient(clientId, res);

    console.log(`Admin SSE client ${clientId} connected`);

    // Send heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      try {
        res.write(
          `event: heartbeat\ndata: ${JSON.stringify({
            timestamp: new Date().toISOString(),
          })}\n\n`
        );
      } catch (error) {
        clearInterval(heartbeat);
        sseManager.removeClient(clientId);
      }
    }, 30000);

    // Clean up on disconnect
    res.on('close', () => {
      clearInterval(heartbeat);
      sseManager.removeClient(clientId);
    });
  }

  // Get SSE connection stats
  getStats(req: Request, res: Response): void {
    res.json({
      success: true,
      data: {
        connectedClients: sseManager.getClientCount(),
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    });
  }
}
