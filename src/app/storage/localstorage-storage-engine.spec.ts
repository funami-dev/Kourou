import { LocalstorageStorageEngine } from './localstorage-storage-engine';
import { StorageEngine } from '@ngxs/storage-plugin';

describe('LocalstorageStorageEngine', () => {
  let storageEngine: StorageEngine;

  beforeEach(() => {
    storageEngine = new LocalstorageStorageEngine();
  });

  it('should delegate getItem', () => {
    const key = 'test';
    storageEngine.getItem(key);
    expect(localStorage.getItem).toBeCalledWith(key);
  });

  it('should delegate removeItem', () => {
    const key = 'test';
    storageEngine.removeItem(key);
    expect(localStorage.removeItem).toBeCalledWith(key);
  });

  it('should delegate clear', () => {
    storageEngine.clear();
    expect(localStorage.removeItem).toBeCalled();
  });

  it('should delegate setItem', () => {
    const key = 'test';
    const val = 'val';
    storageEngine.setItem(key, val);
    expect(localStorage.setItem).toBeCalledWith(key, val);
  });
});
