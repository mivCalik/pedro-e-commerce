import { createContext, useState, useContext } from "react";
import { getProductById } from "../data/products";

export const CartContext = createContext(null);

export default function CartProvider({children}){
    const [cartItems, setCartItems] = useState([]) // {id:6 , quantity:2}

    function addToCart(productId){
        const existing = cartItems.find(item=> productId === item.id)
        if (existing){
            const currentQuantity = existing.quantity;
            const updatedCartItems = cartItems.map(
                item => productId === item.id ? 
                { id: item.id , quantity: currentQuantity +1} 
                : item 
            );
            setCartItems(updatedCartItems)

        }else{
            setCartItems([...cartItems , {id: productId, quantity: 1}])
        }
        
    }

    function getCartItemsWithProducts(){
        return cartItems.map(item =>({
            ...item,
            product: getProductById(item.id)
        })).filter(item => item.product);
    }

    function removeFromCart(productId){
        setCartItems( cartItems.filter(item=> item.id !== productId))
    }


    function updateQuantity(productId, quantity){
        if (quantity <= 0 ){
            removeFromCart(productId)
        }else{
            setCartItems(
                cartItems.map(item=> item.id === productId ? {...item, quantity} : item)
            );
        }
        

    }

    function getCartTotal(){
        return cartItems.reduce((total, item) => {
            const product = getProductById(item.id)
            return total + (product ? product.price * item.quantity : 0)
        }, 0)
    }

    function clearCart(){
        setCartItems([])
    }

    function placeOrder(){
        alert("successful Order!");
        clearCart()
    }
    
    return <CartContext.Provider value={{placeOrder, cartItems, addToCart, getCartItemsWithProducts ,updateQuantity, removeFromCart,getCartTotal}}> {children} </CartContext.Provider>
}

    



export function useCart(){
    const context = useContext(CartContext);
    return context;
}