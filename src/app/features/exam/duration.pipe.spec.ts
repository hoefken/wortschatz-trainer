import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('pads the seconds to two digits', () => {
    expect(pipe.transform(65_000)).toBe('1:05');
  });

  it('rounds to whole seconds', () => {
    expect(pipe.transform(161_499)).toBe('2:41');
    expect(pipe.transform(59_500)).toBe('1:00');
  });

  it('shows minutes up to an hour and caps longer durations', () => {
    expect(pipe.transform(3_600_000)).toBe('60:00');
    expect(pipe.transform(3_601_000)).toBe('mehr als 60 Minuten');
  });
});
