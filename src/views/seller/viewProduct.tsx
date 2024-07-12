import { useEffect, useState } from "react";
import axiosClient from "../../hooks/AxiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  quantity: number;
  status: string;
  expiryDate: string;
}

interface Collection {
  id: string;
  name: string;
}

const ViewProducts = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notify = (message: string) => toast(message);
  const client = axiosClient();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await client.get<{ collections: Collection[] }>(
          "/collections",
        );
        setCollections(response.data.collections);
      } catch (err: any) {
        notify(
          err.response
            ? err.response.data.message
            : "Fetching collections failed",
        );
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCollection === null) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await client.get<{
          products: Product[];
          pagination: { totalPages: number };
        }>(`/collections/${selectedCollection}/products?page=${page}`);
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err: any) {
        notify(
          err.response ? err.response.data.message : "Fetching products failed",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCollection, page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleCollectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = event.target.value;
    setSelectedCollection(selectedValue === "" ? null : selectedValue);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await client.delete(`/collections/products/${id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id),
      );
      toast("Product deleted successfully");
    } catch (err: any) {
      toast(
        err.response ? err.response.data.message : "Failed to delete product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <label
          htmlFor="collectionSelect"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Collection:
        </label>
        <select
          id="collectionSelect"
          className="w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          onChange={handleCollectionChange}
          value={selectedCollection !== null ? selectedCollection : ""}
        >
          <option value="" disabled>
            Select a collection
          </option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Link
          to="/seller/addProduct"
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded text-center mb-2 sm:mb-0"
        >
          Add Product
        </Link>
      </div>
      <h2 className="text-xl font-bold">Products</h2>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          {products.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Details
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className=" divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-2 py-3">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 sm:hidden">
                              {product.price} Rwf
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${product.name}-${index}`}
                              className="h-10 w-10 object-cover rounded"
                            />
                          ))}
                          {product.images.length > 3 && (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                              +{product.images.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 hidden sm:table-cell">
                        <div className="text-sm text-gray-900">
                          {product.price} Rwf
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {product.quantity}
                        </div>
                        <div className="text-sm text-gray-500">
                          Exp:{" "}
                          {new Date(product.expiryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/product-detail/${product.id}`}
                            className="flex items-center text-indigo-600 hover:text-indigo-900"
                          >
                            <button
                              aria-label="view"
                              className="bg-green-500 text-white px-2 py-1 rounded flex items-center justify-center"
                            >
                              <FaEye className="text-lg" />
                            </button>
                          </Link>
                          <Link to= {`/seller/updateProduct/${product.id}`}>
                            <button
                              aria-label="edit"
                              className="bg-view_more text-white px-2 py-1 rounded flex items-center justify-center"
                            >
                              <FaEdit className="text-lg" />
                            </button>
                          </Link>
                          <button
                            aria-label="delete"
                            className="bg-red-500 text-white px-2 py-1 rounded flex items-center justify-center"
                            onClick={() => handleDelete(product.id)}
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center">
              No products found for this collection.
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{products.length}</span>{" "}
                of <span className="font-medium">{totalPages}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                className={`bg-blue-500 text-white px-3 py-1 rounded text-sm ${page === 1 && "opacity-50 cursor-not-allowed"}`}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-sm">Page {page}</span>
              <button
                onClick={handleNextPage}
                className={`bg-blue-500 text-white px-3 py-1 rounded text-sm ${page === totalPages && "opacity-50 cursor-not-allowed"}`}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
