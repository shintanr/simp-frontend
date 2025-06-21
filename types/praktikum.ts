import { LabType } from "./lab";
import { Module } from "./modules";

export type Praktikum = {
  id_praktikum: number;
  name: string;
  modul: string;
  code: string;
  lab_id: number;
  lab?: LabType;
  modules?: Module[];
};