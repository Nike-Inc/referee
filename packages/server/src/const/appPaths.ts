import path from 'path';

export const publicRoot: string = process.env.REFEREE_PUBLIC_ROOT
  ? process.env.REFEREE_PUBLIC_ROOT
  : path.join(path.dirname(require!.main!.filename), '../../client/build');
