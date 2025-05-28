export interface User {
    id: number;
    username: string;
    passwordHash: string;
    role: 'parent' | 'child';
    children?: string[]; //Bara för parent  
    parent?: string; //Bara för child
}