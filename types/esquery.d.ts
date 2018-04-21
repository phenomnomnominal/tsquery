declare module 'esquery' {
    export function parse (selector: string): any;
    export function match (ast: any, selector: string): Array<any>;
}
