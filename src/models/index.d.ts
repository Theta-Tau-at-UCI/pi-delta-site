import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ClassMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BrotherMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Class {
  readonly id: string;
  readonly name: string;
  readonly BrotherInClass?: (Brother | null)[];
  readonly crossing_quarter?: string;
  readonly crossing_year?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Class, ClassMetaData>);
  static copyOf(source: Class, mutator: (draft: MutableModel<Class, ClassMetaData>) => MutableModel<Class, ClassMetaData> | void): Class;
}

export declare class Brother {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly gender: string;
  readonly active_status: boolean;
  readonly major: string;
  readonly cabby_status: boolean;
  readonly cabby_position: string;
  readonly exec_status: boolean;
  readonly exec_position: string;
  readonly casual_image?: string;
  readonly linkedin_url?: string;
  readonly classID: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Brother, BrotherMetaData>);
  static copyOf(source: Brother, mutator: (draft: MutableModel<Brother, BrotherMetaData>) => MutableModel<Brother, BrotherMetaData> | void): Brother;
}