import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Item {
  'id' : bigint,
  'note' : string,
  'text' : string,
  'completed' : boolean,
}
export interface _SERVICE {
  'addItem' : ActorMethod<[string], bigint>,
  'addNoteToItem' : ActorMethod<[bigint, string], boolean>,
  'deleteItem' : ActorMethod<[bigint], boolean>,
  'getItems' : ActorMethod<[], Array<Item>>,
  'updateItem' : ActorMethod<[bigint, boolean], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
