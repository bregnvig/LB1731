import { Inject, Injectable, signal } from "@angular/core";

@Injectable()
export class StateListenerService {

    #state = signal<any>({});
    #listeners = signal<string[]>([]);
    constructor() {
        this.#state.set({ key: 'init' });
    }

    get listeners() {
        return this.#listeners.asReadonly();
    }

    register(listener?: string) {
        listener && this.#listeners.update(prev => [...new Set([...prev, listener]).values()]);
        return this.#state.asReadonly();
    }

    clear() {
        this.#listeners.set([]);
    }

    setState(newState: any) {
        this.#state.set(newState);
    }

}


@Injectable()
export class GlobalStateListenerService extends StateListenerService {
}

@Injectable()
export class LocalStateListenerService extends StateListenerService {
}
