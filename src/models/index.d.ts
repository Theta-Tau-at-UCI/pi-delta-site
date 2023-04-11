import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type ClassMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BrotherMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Class {
  readonly id: string;
  readonly name: string;
  readonly BrotherInClass?: (Brother | null)[] | null;
  readonly crossing_quarter?: string | null;
  readonly crossing_year?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
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
  readonly casual_image?: string | null;
  readonly linkedin_url?: string | null;
  readonly classID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Brother, BrotherMetaData>);
  static copyOf(source: Brother, mutator: (draft: MutableModel<Brother, BrotherMetaData>) => MutableModel<Brother, BrotherMetaData> | void): Brother;
}