import { SHA256, enc } from 'crypto-js'

export function sha256(input: string): string {
    return SHA256(input).toString(enc.Hex);
}