declare type KvPair = {
  key: string;
  value: string;
};

declare type KvMap<V> = {
  [key: string]: V;
};

declare type KeyOrMap<V> = {
  [key: string]: V | KvMap<V>;
};
