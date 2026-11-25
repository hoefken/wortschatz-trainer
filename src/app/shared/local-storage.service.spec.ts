import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  const key = 'test.key';
  let service: LocalStorageService;

  beforeEach(() => {
    service = TestBed.inject(LocalStorageService);
  });

  it('reads back what it wrote', () => {
    service.write(key, [{ id: 't1' }]);

    expect(service.read(key)).toEqual([{ id: 't1' }]);
  });

  it('reads nothing for a missing key', () => {
    expect(service.read(key)).toBeUndefined();
  });

  it('reads nothing for broken JSON instead of throwing', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    localStorage.setItem(key, '{broken');

    expect(service.read(key)).toBeUndefined();
  });

  it('keeps the app running when the storage refuses to write', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    expect(() => service.write(key, [])).not.toThrow();
  });
});
