import ElectronStore from "electron-store";
import { safeStorage } from "electron";

interface Settings {
  check: boolean;
  secrets: {
    OPENAI_API_KEY: string;
  };
}

type DotUnionKeys<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? DotUnionKeys<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : "";
    }[keyof T]
  : "";

type SettingKey = DotUnionKeys<Settings>;

type Secret = keyof Settings["secrets"];

// TODO: Perhaps add a schema for validation
const settings = new ElectronStore<Settings>({
  defaults: {
    check: false,
    secrets: {
      OPENAI_API_KEY: "",
    },
  },
});

// isEncryptionAvailable() conditions
// On Linux, returns true if the app has emitted the ready event and the secret key is available.
// On MacOS, returns true if Keychain is available.
// On Windows, returns true once the app has emitted the ready event.
export function setSecret(key: string, value: string): void {
  if (safeStorage.isEncryptionAvailable()) {
    settings.set(`secrets.${key}`, safeStorage.encryptString(value).toString("base64"));
  }
}

export function getSecret(key: string): string {
  const value = settings.get(`secrets.${key}`);
  if (!(typeof value === "string")) return "";
  return safeStorage.decryptString(Buffer.from(value, "base64"));
}

export function clearSecret(key: string): void {
  settings.set(`secrets.${key}`, "");
}

export default settings;
