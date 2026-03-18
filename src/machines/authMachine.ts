import { createMachine, assign, fromPromise, createActor } from "xstate";
import { httpClient } from "../utils/httpClient";
import { User, SignInPayload, SignUpPayload } from "../models/user";

export type AuthMachineEvents =
    | { type: "LOGIN"; username: string; password: string; remember?: boolean }
    | { type: "LOGOUT" }
    | { type: "SIGNUP"; firstName: string; lastName: string; username: string; password: string };

export interface AuthMachineContext {
    user?: User;
    message?: string;
}

export const authMachine = createMachine({
    id: "authentication",
    initial: "unauthorized",
    context: {
        user: undefined,
        message: undefined,
    } as AuthMachineContext,

    states: {
        unauthorized: {
            entry: assign({
                user: undefined,
                message: undefined,
            }),
            on: {
                LOGIN: "loading",
                SIGNUP: "signup",
            },
        },
        signup: {
            invoke: {
                src: fromPromise(async ({ input }: { input: AuthMachineEvents }) => {
                    if (input.type !== "SIGNUP") throw new Error("Invalid event");

                    try {
                        const resp = await httpClient.post("/users", {
                            firstName: input.firstName,
                            lastName: input.lastName,
                            username: input.username,
                            password: input.password,
                        });
                        return resp.data;
                    } catch (error) {
                        throw new Error("Signup failed");
                    }
                }),
                input: ({ event }: { event: AuthMachineEvents }) => event,
                onDone: {
                    target: "unauthorized",
                    actions: assign({
                        message: "Account created successfully! Please sign in.",
                    }),
                },
                onError: {
                    target: "unauthorized",
                    actions: assign({
                        message: ({ event }) => (event.error as Error).message || "Signup failed",
                    }),
                },
            },
        },
        loading: {
            invoke: {
                src: fromPromise(async ({ input }: { input: AuthMachineEvents }) => {
                    if (input.type !== "LOGIN") throw new Error("Invalid event");

                    try {
                        const resp = await httpClient.post("/login", {
                            username: input.username,
                            password: input.password,
                        });
                        return resp.data;
                    } catch (error) {
                        throw new Error("Username or password is invalid");
                    }
                }),
                input: ({ event }: { event: AuthMachineEvents }) => event,
                onDone: {
                    target: "authorized",
                    actions: assign({
                        user: ({ event }) => event.output.user,
                        message: undefined,
                    }),
                },
                onError: {
                    target: "unauthorized",
                    actions: assign({
                        message: ({ event }) => (event.error as Error).message || "An error occurred",
                    }),
                },
            },
        },
        authorized: {
            on: {
                LOGOUT: "logout",
            },
        },
        logout: {
            invoke: {
                src: fromPromise(async () => {
                    await httpClient.post("/logout");
                    localStorage.removeItem("authState");
                }),
                onDone: { target: "unauthorized" },
                onError: {
                    target: "unauthorized",
                    actions: assign({
                        message: ({ event }) => (event.error as Error).message || "Logout failed",
                    }),
                },
            },
        },
    },
});

export const authService = createActor(authMachine);

authService.subscribe((state) => {
    localStorage.setItem("authState", JSON.stringify(state));
});

authService.start();
