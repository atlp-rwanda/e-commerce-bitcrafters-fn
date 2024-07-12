import React, { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import CartProductCard from "../components/CartProductCard";
import Button from "../components/Button";
import useAxiosClient from "../hooks/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TbBasketX } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { decrementCart, setCart, clearCart } from "../redux/cart";
import { ThreeDots } from "react-loader-spinner";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface CartResponse {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const UserCart: React.FC = () => {
  const client = useAxiosClient();
  const notify = (message: string) => toast(message);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartResponse, setCartResponse] = useState<CartResponse | null>(null);
  const { count } = useSelector((state: any) => state.cart);
  console.log("cartCount", count);

  const fetchCart = async () => {
    try {
      const response = await client.get(`/cart`);
      if (response.status === 200) {
        setCartResponse(response.data.cart);
        setCartItems(response.data.cart.items);
        dispatch(setCart(response.data.cart.items.length));
        console.log("data: ", response.data.cart.items);
      }
    } catch (err: any) {
      notify(err.response ? err.response.data.message : "Fetching cart failed");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (productId: string) => {
    try {
      const response = await client.delete(`/cart/products/${productId}`);
      if (response.status === 200) {
        notify(response.data.message);
        dispatch(decrementCart());
        fetchCart();
      }
    } catch (err: any) {
      notify(err.response ? err.response.data.message : "Failed to delete Item");
    }
  };

  const clearUserCart = async () => {
    try {
      const response = await client.delete("/cart/clear");
      if (response.status === 200) {
        notify(response.data.message);
        fetchCart();
        dispatch(clearCart());
      }
    } catch (err: any) {
      notify(err.response ? err.response.data.message : "Failed to clear cart");
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const response = await client.patch(`/cart/products/${productId}`, {
        items: [
          {
            productId,
            quantity: newQuantity,
          },
        ],
      });
      if (response.status === 200) {
        notify(response.data.message);
        fetchCart();
      }
    } catch (err: any) {
      notify(err.response ? err.response.data.message : "Failed to update quantity");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full text-black h-[60vh] mx-auto items-center justify-center flex flex-col gap-3">
        <p>Loading... </p>
        <ThreeDots visible={true} height="50" width="50" color="rgb(38 38 38)" radius="5" ariaLabel="three-dots-loading" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full h-[40vh] phone:h-[90vh] mx-auto items-center justify-center flex flex-col gap-10">
        <TbBasketX className="text-9xl text-black" />
        <p>No items in cart.</p>
        <div className="w-32">
          <Button value="Go Shopping" onClick={() => navigate("/")} />
        </div>
      </div>
    );
  }

  return (
    <div className="container m-3 tablet:m-5 flex flex-col space-x-2 items-start justify-start tablet:min-h-[100vh] tablet:px-10 w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <SectionHeader title="My Cart" />
        <div>
          <Button value="Clear Cart" icon={<MdDelete className="text-red-500" />} onClick={clearUserCart} />
        </div>
      </div>

      <div className="content w-full flex items-start my-5 justify-between gap-3 flex-wrap">
        <div className="cart-items border mx-auto tablet:m-0 w-[100%] tablet:w-[60%] p-2 rounded-md flex flex-col gap-2 border-gray_100">
          {cartItems.map((item, index) => (
            <CartProductCard
              key={index}
              image={item.images[0]}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              id={item.productId}
              deleteItem={() => deleteItem(item.productId)}
              updateQuantity={(newQuantity: number) => updateQuantity(item.productId, newQuantity)}
            />
          ))}
        </div>

        {cartResponse && (
          <div className="cart-items border mx-auto tablet:m-0 w-[100%] tablet:w-[35%] p-2 rounded-md flex flex-col gap-2 border-gray_100">
            <div className="p-2 flex flex-col gap-2">
              <p className="font-semibold">Order Summary</p>
              <div className="flex gap-3 items-center justify-between">
                <p className="text-xs font-medium">Total Quantities</p>
                <p className="text-xs">{cartResponse.totalQuantity}</p>
              </div>
              <div className="flex gap-3 items-center justify-between">
                <p className="text-xs font-medium">Subtotal</p>
                <p className="text-xs">Rwf {cartResponse.totalPrice}</p>
              </div>

              <div className="flex gap-3 items-center justify-between">
                <p className="text-xs font-medium">Discount</p>
                <p className="text-xs">0.0</p>
              </div>

              <div className="flex gap-3 items-center justify-between">
                <p className="text-xs font-medium">Delivery fee</p>
                <p className="text-xs">0.0 Rwf</p>
              </div>
              <div className="flex my-2 items-center justify-between border border-gray"></div>

              <div className="flex gap-3 items-center justify-between">
                <p className="text-xs font-semibold">Total</p>
                <p className="text-xs">{cartResponse.totalPrice}</p>
              </div>
            </div>
            <Button value="Checkout" onClick={() => navigate("/checkout")} />
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserCart;
