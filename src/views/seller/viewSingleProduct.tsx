import { useEffect, useState } from "react";
import axiosClient from "../../hooks/AxiosInstance";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { FaStar, FaRegStar, FaShoppingCart } from "react-icons/fa"; 
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Review {
  id: string;
  rating: number;
  feedback: string;
  buyerId: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: string;
    username: string;
  };
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  images: string[];
  expiryDate: string;
  averageRating: number;
  seller: {
    id: string;
    username: string;
    email: string;
  };
  reviews: Review[];
}

const ViewSingleProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const notify = (message: string) => toast(message);
  const client = axiosClient();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await client.get(`/collections/product/${productId}`);
        setProduct(response.data.item);
      } catch (error) {
        notify("Error fetching product");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId, client]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen">No product found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 max-w-screen-lg">
        <div className="flex items-center m-4">
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-1/2">
            {product.images && product.images.map((image, index) => (
              <div key={index} className="h-64 w-full">
                <img
                  src={image}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <div className="m-4 md:m-20 flex-1 w-full max-w-lg">
            <h1 className="text-3xl font-bold m-6">{product.name}</h1>
            <p className="text-lg m-4">{renderStars(product.averageRating)}</p>
            <div className="text-md m-4">
              <div className="font-semibold">Price</div> Rwf{product.price}
            </div>
            <div className="text-md m-4">
              <div className="font-semibold">Description:</div>
              {product.category}
            </div>
            <button
              className="m-4 px-4 py-2 bg-white text-black border border-black rounded flex items-center hover:bg-gray-100"
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center m-4">
            <div className="border-r-8 border-black h-8 m-3 rounded-full"></div>
            <span className="pr-4 text-lg font-semibold">About Seller</span>
          </div>
          <p className="text-md ml-6">
            <span className="font-semibold">Username:</span> {product.seller.username}
          </p>
          <p className="text-md ml-6">
            <span className="font-semibold">Email:</span> {product.seller.email}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center m-4">
            <div className="border-r-8 border-black h-8 m-3 rounded-full"></div>
            <span className="pr-4 text-lg font-semibold">Reviews</span>
          </div>
          {product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-lg">
                  <span className="font-semibold">Rating:</span> {renderStars(review.rating)}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Feedback:</span> {review.feedback}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Buyer:</span> {review.buyer.username}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Reviewed on:</span> {format(parseISO(review.createdAt), 'MM/dd/yyyy')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-lg">No reviews yet</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewSingleProduct;
