import http from 'http';
import WebSocket from 'ws';
import { startServer, waitForSocketState, resultTemplate } from '../utils/webSocketTestUtils';
import { WebsocketAPI } from '../../../src/websocketAPI';

describe('Stop User Data Stream', () => {
    let responseMessage: WebSocket.Data = '';
    let server: http.Server;
    const callbacks = {
        open: (client: WebsocketAPI) => client.stopUserDataStream('xs0mRXdAKlIPDRFrlPcw0qI41Eh3ixNntmymGyhrhgqo7L6FuLaWArTD7RLP'),
        close: () => console.log('Disconnected with Websocket server'),
        message: (data: string) => responseMessage = data.toString()
    };

    beforeAll(async () => server = await startServer(3000));

    afterAll(() => server.close());

    it('should stop and close the user data stream', async () => {
        const test = new WebsocketAPI('', '', { callbacks, wsURL: 'ws://localhost:3000'});
        if(test.wsConnection.ws) await waitForSocketState(test.wsConnection.ws, test.wsConnection.ws.OPEN);
        setTimeout(() => test.disconnect(), 100);
        if(test.wsConnection.ws) await waitForSocketState(test.wsConnection.ws, test.wsConnection.ws.CLOSED);
        expect(responseMessage).toBe(JSON.stringify(resultTemplate));
    });
});