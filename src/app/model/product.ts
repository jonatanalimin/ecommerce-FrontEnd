export interface Product {
    id:number;
    name: string;
    image: string;
    price: string;
    description: string;
    categoryModel: Category;
}

export interface Category {
    id:number;
    name: string;
}