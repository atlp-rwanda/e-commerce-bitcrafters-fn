import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import useAxiosClient from "../hooks/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TbBasketX } from "react-icons/tb";
import { decrementCart, setCart } from "../redux/wishListSlice";
import { ThreeDots } from "react-loader-spinner";
import WishListProductCard from "../components/WishListProductCard";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  images: string[];
}


const UserCart: React.FC = () => {
  const client = useAxiosClient();
  const notify = (message: string) => toast(message);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const count = useSelector((state: any) => state.wishList?.count ?? 0);
  console.log("cartCount", count);

  const fetchCart = async () => {
    try {
      const response = await client.get(`/wishList/products?page=1`);
      console.log(response)
      console.log(response.data.wishlist[0].products)
      if (response.status === 200) {
        setCartItems(response.data.wishlist[0].products);
        dispatch(setCart(response.data.wishlist[0].products.length));
        console.log("data: ", response.data.wishlist.products);
      }
    } catch (err: any) {
        console.log(err)
      notify(err.response ? err.response.data.message : "Fetching wishList failed");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (productId: string) => {
    try {
      const response = await client.delete(`/wishList/products/${productId}`);
      if (response.status === 200) {
        notify(response.data.message);
        dispatch(decrementCart());
        fetchCart();
      }
    } catch (err: any) {
      notify(err.response ? err.response.data.message : "Failed to delete Item");
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

  if (Array.isArray(cartItems) && cartItems.length === 0) {
    return (
      <div className="w-full h-[40vh] phone:h-[90vh] mx-auto items-center justify-center flex flex-col gap-10">
        <TbBasketX className="text-9xl text-black" />
        <p>No items in your WishList.</p>
        <div className="w-32">
          <Button value="Go Shopping" onClick={() => navigate("/")} />
        </div>
      </div>
    );
  }

  return (
    <div className="container m-3 tablet:m-5 flex flex-col space-x-2 items-start justify-start tablet:min-h-[100vh] tablet:px-10 w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <SectionHeader title="My WishList" />
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-center gap-5 tablet:gap-10 my-5">
          {Array.isArray(cartItems) && cartItems.map((item, index) => (
            <WishListProductCard
              key={index}
              Image={item.images[0]}
              name={item.name}
              price={item.price}
              id={item.productId}
              deleteItem={() => deleteItem(item.productId)}
            />
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserCart;
