import { StorageEngine } from '@ngxs/storage-plugin';

export class LocalstorageStorageEngine implements StorageEngine {
  length = localStorage.length;

  getItem(name) {
    return localStorage.getItem(name);
  }
  setItem(key, value) {
    localStorage.setItem(key, value);
  }
  removeItem(key) {
    localStorage.removeItem(key);
  }
  clear() {
    localStorage.clear();
  }
}
