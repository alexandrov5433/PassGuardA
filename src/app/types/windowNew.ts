import { Preloads } from "./preloads";

export interface WindowNew extends Window {
    preloads: Preloads
}