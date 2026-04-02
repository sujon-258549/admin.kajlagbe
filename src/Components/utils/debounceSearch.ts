const debounceSearch = (value: string, delay: number): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, delay);
    });
};

export default debounceSearch;