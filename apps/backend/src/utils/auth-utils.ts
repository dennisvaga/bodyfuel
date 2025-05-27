import { jwtDecrypt } from "jose";
import { hkdf } from "@panva/hkdf";

async function getDerivedEncryptionKey(
  enc: string,
  keyMaterial: Parameters<typeof hkdf>[1],
  salt: Parameters<typeof hkdf>[2]
) {
  const length = enc === "A256CBC-HS512" ? 64 : 32;
  return hkdf(
    "sha256",
    keyMaterial,
    salt,
    `Auth.js Generated Encryption Key (${salt})`,
    length
  );
}

/**
 * Decrypts session token.
 *
 * 1. Extracts the encrypted session token from the provided token string
 * 2. Decrypts the token using the application's secret key
 * 4. Returns the decoded JWT payload containing user identification data
 *
 * @param token - The encrypted session token string to decrypt
 * @param isDev
 */
export async function decryptToken(token: string, isDev: boolean) {
  if (!token) return null;

  try {
    // Extract the header to get the algorithms
    const [headerB64] = token.split(".");
    const header = JSON.parse(Buffer.from(headerB64 ?? "", "base64").toString());

    // Get the algorithms from the header
    const alg = header.alg; // e.g., 'dir' (direct encryption)
    const enc = header.enc; // e.g., 'A256CBC-HS512'

    if (!alg || !enc) {
      throw new Error("Missing algorithm information in token header");
    }

    const salt = isDev ? "authjs.session-token" : `__Secure-authjs.session-token`;
    const encryptionKey = await getDerivedEncryptionKey(enc, process.env.AUTH_SECRET!, salt);

    const { payload } = await jwtDecrypt(token, encryptionKey, {
      clockTolerance: 15,
      keyManagementAlgorithms: [alg],
      contentEncryptionAlgorithms: [enc, "A256GCM"],
    });

    return payload;
  } catch (error) {
    console.error("Error decrypting token:", error);
    return null;
  }
}
