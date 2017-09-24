import { ExclamationPipe } from './exclamation.pipe';

describe('ExclamationPipe', () => {

  let pipe: ExclamationPipe;

  beforeEach(() => {
    pipe = pipe = new ExclamationPipe();
  })
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return a input + !', () => {
    expect(pipe.transform('a')).toEqual('a!');
  });
  it('should return ! with falshy input', () => {
    expect(pipe.transform(null)).toEqual('!');
    expect(pipe.transform(undefined)).toEqual('!');
    expect(pipe.transform(0)).toEqual('!');
    expect(pipe.transform('')).toEqual('!');
    expect(pipe.transform(false)).toEqual('!');
  });
});
