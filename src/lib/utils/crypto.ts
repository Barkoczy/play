import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

/**
 * Encodes a string into Base64 format.
 *
 * @param {string} data - The string to be encoded.
 * @returns {string} - The Base64-encoded string.
 */
export function encodeBase64(data: string): string {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    let binary = '';
    encodedData.forEach(byte => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
}

/**
 * Decodes a Base64-encoded string.
 *
 * @param {string} data - The Base64-encoded string to be decoded.
 * @returns {string} - The decoded string.
 */
export function decodeBase64(data: string): string {
    // Decode the Base64 string
    const decodedBinaryString = atob(data);
    
    // Convert the binary string to a UTF-8 string
    const decoder = new TextDecoder();
    const decodedData = decoder.decode(new Uint8Array([...decodedBinaryString].map(char => char.charCodeAt(0))));
    
    return decodedData;
}

/**
 * Creates an HMAC signature using SHA-512.
 *
 * @param {string} data - The input data to be signed.
 * @param {string} secret - The secret key used for HMAC generation.
 * @returns {string} - The Base64-encoded HMAC signature.
 */
export function createHmacSignature(data: string, secret: string): string {
    const hash = hmacSHA512(data, secret);
    return hash.toString(Base64);
}
