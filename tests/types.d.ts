declare module 'chai' {
    import { Agent } from 'chai-http';
    export interface ChaiStatic {
        request: (app: any) => Agent;
    }
}
