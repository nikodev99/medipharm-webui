class LocalStorage {
    save<T>(key: string, value: T) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        }catch(err) {
            console.error("Error saving data to localStorage", err);
        }
    }

    get<T>(key: string): T | null {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue) as T;
        }catch(err) {
            console.error("Error retrieving data from localStorage", err);
            return null;
        }
    }

    update<T>(key: string, updateFunction: (currentValue: T | null) => T) {
        try {
            const currentValue = this.get<T>(key);
            const updatedValue = updateFunction(currentValue);
            this.save<T>(key, updatedValue);
        }catch(err) {
            console.error("Error updating data in localStorage", err);
        }
    }

    remove(key: string) {
        try {
            localStorage.removeItem(key);
        }catch(err) {
            console.error("Error removing data from localStorage", err);
        }
    }

    clear() {
        try {
            localStorage.clear();
        }catch(err) {
            console.error("Error clearing localStorage", err);
        }
    }
}

export const store = new LocalStorage()