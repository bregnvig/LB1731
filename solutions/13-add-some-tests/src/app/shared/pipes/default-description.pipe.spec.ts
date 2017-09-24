/* tslint:disable:no-unused-variable */

import { DefaultDescriptionPipe } from './default-description.pipe';

describe('Pipe: DefaultDescription', () => {
  let pipe: DefaultDescriptionPipe;
  beforeEach(() => {
    pipe = new DefaultDescriptionPipe();
  })
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return ingen beskrivelse, with falsy input', () => {
    expect(pipe.transform(undefined)).toEqual('Ingen beskrivelse');
    expect(pipe.transform(null)).toEqual('Ingen beskrivelse');
    expect(pipe.transform('')).toEqual('Ingen beskrivelse');
  });
  it('should return input when not falsy', () => {
    expect(pipe.transform('Hello')).toEqual('Hello');
  });
});
