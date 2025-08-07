"use client";

import { createContext, ReactNode, useContext, useState } from 'react';

interface CartContextType {
    selectedItems: ICart[];
    setSelectedItems: React.Dispatch<React.SetStateAction<ICart[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [selectedItems, setSelectedItems] = useState<ICart[]>([]);
    return (
        <CartContext.Provider value={{ selectedItems, setSelectedItems }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("Outside using context.");
    }
    return context;
};