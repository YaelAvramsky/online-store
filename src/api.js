
export const fetchData = async () => {
    try {
        const response = await fetch('https://dummyjson.com/products/category/kitchen-accessories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.products;
    } catch (error) {
        throw error;
    }
};
