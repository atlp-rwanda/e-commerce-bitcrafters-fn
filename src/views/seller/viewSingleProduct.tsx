import { useEffect, useState } from "react";
import axiosClient from "../../hooks/AxiosInstance";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { FaStar, FaRegStar, FaShoppingCart } from "react-icons/fa";
import Modal from "react-modal";
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const addProductToCart = async (productId: string, quantity: number) => {
    try {
      await client.post(`/cart/products/${productId}`, { quantity });
      navigate('/cart');
      notify("Product added to cart successfully!");
      closeModal();
    } catch (error: any) {
      if (error.response) {
        toast(`${error.response.data.message}`);
      } else if (error.request) {
        notify("No response received from the server.");
      } else {
        notify("Error setting up request.");
      }
    }
  };

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
          {/* Additional product information or navigation can be added here */}
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
              onClick={openModal}
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Quantity"
        className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Add to Cart</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProductToCart(product.id, quantity);
          }}
          className="flex flex-col gap-4"
        >
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ViewSingleProduct;
