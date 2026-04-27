export { createLocalStorageCertificationRequestBackend } from "./persistence/local-storage";
export { createInMemoryCertificationRequestBackend } from "./persistence/memory";
export type {
  CertificationRequestBackend,
  CertificationStorageState,
} from "./persistence/core";
