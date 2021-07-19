export type Context<T = unknown> = {
    id: symbol;
    set: (value: T) => void;
    get: () => T;
    update: (updater: (prev: T) => T) => void;
};

export type Container = Map<symbol, Context>;

export type Meta<T> = {
    id: symbol;
    _typeInfo: () => T;
    (container: Container): void;
};

export const createCtx = <T>(value: T): Meta<T> => {
    const id = Symbol('Context');
    let inner = value;

    const context: Context<T> = {
        id,
        set: (next) => {
            inner = next;
        },
        get: () => inner,
        update: (updater) => {
            inner = updater(inner);
        },
    };

    const setter = (container: Container) => {
        container.set(id, context as Context);
    };
    setter.id = id;
    setter._typeInfo = (): T => {
        throw new Error('Should not call a context.');
    };

    return setter;
};
