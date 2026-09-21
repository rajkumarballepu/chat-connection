import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
/**
 * useStompSocket
 *
 * Manages a single SockJS + STOMP connection and lets any number of
 * components subscribe to any number of destinations concurrently,
 * without opening a new socket per subscription.
 *
 * Usage:
 *   const { subscribe, connected, publish } = useStompSocket("/ws");
 *
 *   useEffect(() => {
 *     const unsubA = subscribe("/topic/presence.42", (msg) => { ... });
 *     const unsubB = subscribe("/topic/chat.room.7", (msg) => { ... });
 *     return () => { unsubA(); unsubB(); };
 *   }, [subscribe]);
 */
export function useStompSocket(endpoint, options = {}) {
    const clientRef = useRef(null);
    const subscriptionsRef = useRef(new Map()); // destination -> { sub, handlers: Set }
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(endpoint),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: options.connectHeaders || {},

            onConnect: () => {
                setConnected(true);

                // Re-subscribe to anything requested before the connection was ready,
                // and restore subscriptions after an auto-reconnect.
                subscriptionsRef.current.forEach((entry, destination) => {
                    entry.sub = client.subscribe(destination, (message) => {
                        const payload = safeParse(message.body);
                        entry.handlers.forEach((handler) => handler(payload));
                    });
                });
                console.log("Socket connected..")
            },
            debug: (str) => console.log(`[STOMP Debug]: ${str}`),
            onDisconnect: () => setConnected(false),
            onStompError: (frame) => {
                console.error(
                    "STOMP error:",
                    frame.headers?.message,
                    frame.body,
                );
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            subscriptionsRef.current.clear();
            setConnected(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    /**
     * Subscribe to a destination. Multiple callers can subscribe to the same
     * destination concurrently - only one underlying STOMP subscription is
     * opened per destination, and handlers are fanned out locally.
     * Returns an unsubscribe function.
     */
    const subscribe = useCallback((destination, handler) => {
        let entry = subscriptionsRef.current.get(destination);

        if (!entry) {
            entry = { sub: null, handlers: new Set() };
            subscriptionsRef.current.set(destination, entry);

            if (clientRef.current && clientRef.current.connected) {
                entry.sub = clientRef.current.subscribe(
                    destination,
                    (message) => {
                        const payload = safeParse(message.body);
                        entry.handlers.forEach((h) => h(payload));
                    },
                );
            }
        }

        entry.handlers.add(handler);

        return () => {
            entry.handlers.delete(handler);

            // Last listener for this destination left - tear down the STOMP subscription.
            if (entry.handlers.size === 0) {
                entry.sub?.unsubscribe();
                subscriptionsRef.current.delete(destination);
            }
        };
    }, []);

    const publish = useCallback((destination, body, headers = {}) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination,
                body: typeof body === "string" ? body : JSON.stringify(body),
                headers,
            });
        } else {
            console.warn(
                "Cannot publish - STOMP client not connected yet:",
                destination,
            );
        }
    }, []);

    return { subscribe, publish, connected };
}

function safeParse(raw) {
    try {
        return JSON.parse(raw);
    } catch(err) {
        return raw;
    }
}
