export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Socket = {};

export type Node = {
  id: number;
  data?:any;
  color?:string;
  type?:string;
  createplan?:boolean;
  scenarios?:boolean;
  Actions?:boolean;
  inputSocket?: Socket;
  outputSocket?: Socket;
  initialPosition: Position;
};

export type Path = {
  from: number;
  to: number;
};
