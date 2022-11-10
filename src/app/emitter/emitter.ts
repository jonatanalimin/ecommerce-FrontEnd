import { EventEmitter } from "@angular/core";

export class Emitters {
    static authenticator = new EventEmitter<boolean>()
}