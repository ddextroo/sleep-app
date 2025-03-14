export interface AuthLogin {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}
export interface AuthSignup {
    username: string;
    email: string;
    password: string;
    setUsername: (username: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}

export interface AuthSession {
    session: any,
    loading: boolean,
    setSession: (session: any) => void,
    setLoading: (loading: boolean) => void,
    initSession: () => Promise<void>
}