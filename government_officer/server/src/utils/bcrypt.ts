import * as bcryptNS from 'bcryptjs';

// In ESM import * as returns an object whose default contains the functions in this environment.
// Support both shapes (namespace or default containing the functions).
const impl: any = (bcryptNS as any).hash ? bcryptNS : (bcryptNS as any).default;

export const hash = (value: string, saltRounds: number) => impl.hash(value, saltRounds);
export const compare = (value: string, hashValue: string) => impl.compare(value, hashValue);
