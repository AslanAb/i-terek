import {
  MMKV,
  useMMKVNumber as libUseMMKVNumber,
  useMMKVObject as libUseMMKVObject,
  useMMKVString as libUseMMKVString,
} from "react-native-mmkv";
import { useEffect, useState } from "react";

let mmkvAvailable = true;
let storageInstance: MMKV | null = null;

try {
  storageInstance = new MMKV();
} catch (error) {
  console.warn(
    "[MMKV] Native MMKV not available, falling back to in-memory storage. This is expected when running with a remote debugger.",
    error
  );
  mmkvAvailable = false;
}

const memoryStore = new Map<string, unknown>();
const listeners = new Map<string, Set<(value: unknown) => void>>();

const subscribe = (key: string, listener: (value: unknown) => void) => {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);

  return () => {
    const current = listeners.get(key);
    if (!current) return;
    current.delete(listener);
    if (current.size === 0) {
      listeners.delete(key);
    }
  };
};

const notify = (key: string, value: unknown) => {
  const set = listeners.get(key);
  if (!set) return;
  set.forEach((listener) => listener(value));
};

export const storage = storageInstance;

export const useMMKVString = (key: string) => {
  if (mmkvAvailable) {
    return libUseMMKVString(key);
  }

  const [value, setValue] = useState<string | undefined>(() => {
    const stored = memoryStore.get(key);
    return typeof stored === "string" ? stored : undefined;
  });

  useEffect(() => {
    return subscribe(key, (next) => {
      setValue(typeof next === "string" ? next : undefined);
    });
  }, [key]);

  const set = (next?: string) => {
    if (typeof next === "undefined") {
      memoryStore.delete(key);
    } else {
      memoryStore.set(key, next);
    }
    setValue(next);
    notify(key, next);
  };

  return [value, set] as const;
};

export const useMMKVNumber = (key: string) => {
  if (mmkvAvailable) {
    return libUseMMKVNumber(key);
  }

  const [value, setValue] = useState<number | undefined>(() => {
    const stored = memoryStore.get(key);
    return typeof stored === "number" ? stored : undefined;
  });

  useEffect(() => {
    return subscribe(key, (next) => {
      setValue(typeof next === "number" ? next : undefined);
    });
  }, [key]);

  const set = (next?: number) => {
    if (typeof next === "undefined") {
      memoryStore.delete(key);
    } else {
      memoryStore.set(key, next);
    }
    setValue(next);
    notify(key, next);
  };

  return [value, set] as const;
};

export const useMMKVObject = <T = unknown>(key: string) => {
  if (mmkvAvailable) {
    return libUseMMKVObject<T>(key);
  }

  const [value, setValue] = useState<T | undefined>(() => {
    const stored = memoryStore.get(key);
    return stored as T | undefined;
  });

  useEffect(() => {
    return subscribe(key, (next) => {
      setValue(next as T | undefined);
    });
  }, [key]);

  const set = (next?: T) => {
    if (typeof next === "undefined") {
      memoryStore.delete(key);
    } else {
      memoryStore.set(key, next);
    }
    setValue(next);
    notify(key, next);
  };

  return [value, set] as const;
};


