import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosClient from "../../hooks/AxiosInstance";
import { format } from 'date-fns';
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

 interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    bonus: number;
    sku: string;
    quantity: number;
    expiryDate: string;
    images: [];
  }
  type newProduct = Omit<Product, 'images' | 'id'>;

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").positive("Price must be positive"),
  bonus: Yup.number().required("Bonus is required").min(0, "Bonus must be positive or zero"),
  quantity: Yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
  sku: Yup.string()
    .trim()
    .matches(/^[a-zA-Z0-9]*$/, "SKU must be alphanumeric")
    .min(5, "SKU must be at least 5 characters")
    .max(20, "SKU must be at most 20 characters")
    .required("SKU is required"),
  expiryDate: Yup.date().required("Expiry date is required"),
});

const UpdateProductForm: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [images, setImages] = React.useState<string[]>([]);
  const [product, setProduct] = React.useState<Product >();
  const { productId } = useParams<{ productId: string }>();
  const axiosClient = useAxiosClient();
  const navigate = useNavigate();

 
  const fetchProduct = async (productId:string) => {
      try {
        const response = await axiosClient.get(`/collections/product/${productId}`);
        console.log(response.data)
        setProduct(response.data.item);
      } catch (error) {
      }
    };
  useEffect(() => {
    fetchProduct(productId as string);
  }, [productId as string]);
  const date = product?.expiryDate ||'1000-01-01T00:00:00.000Z'
  const formattedDate = (format(date, 'yyyy-MM-dd') === '1000-01-01')?'loading...': format(date, 'yyyy-MM-dd')
  
  const updateImages = async (images:File[]) => {
    try {
      const formData = new FormData();
      images.forEach(image => formData.append('images', image));
      
      
      const imageResponse = await axiosClient.post(`/collections/product/${productId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return imageResponse.data;
    } catch (error) {
      toast.error("Error updating images. Please try again");
    }
  };

  const handleSubmit = async (newProduct: newProduct, images:File[]) => {
    try {
      const response = await axiosClient.put(`/collections/${productId}/product`, newProduct);
      if (response.status === 200) {
        toast.success("Product updated successfully");
        navigate(`/product-detail/${productId}`);
      }
      if(files.length > 0){
        updateImages(images);
      }
      return response.data;
    } catch (error) {
      toast.error("Error updating product. Please try again");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const onRemoveImage = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onDeleteImage = async(image: string) => {
    try{
      setImages(prevArray => [...prevArray, image]);
      const response = await axiosClient.delete(`/collections/product/${productId}/images`, {
        data: { images }
      });
      if(response.status === 200){
        toast.success("image deleted");
        fetchProduct(productId as string)
      }
    }catch(error){
      toast.error("failed to delete image");
    }
  };

  const validateImages = (value: File[]) => {
    if(value.length > 0){
      if (value.length < 4 || value.length > 8) {
        return true;
      }
    }

    return false;
  };


  return (
    <div className="flex flex-row space-x-4 bg-custom-bg">
      <div className="bg-custom-white flex-auto items-start justify-between p-5 border-b rounded-t">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Update Product</h2>
        <div className="p-6 space-y-6">
          <Formik
            initialValues={{
              name: product?.name || "",
              category: product?.category || "",
              price: product?.price || 0,
              bonus: product?.bonus || 0,
              quantity: product?.quantity || 0,
              sku: product?.sku || "",
              expiryDate: formattedDate,
              images: product?.images || [],
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const fileValidationError = validateImages(files);
              if (fileValidationError) {
                toast.error("Please upload images between 4 and 8");
                setSubmitting(false);
                return;
              }
              try {
                handleSubmit(values, files)
                setSubmitting(false);
              } catch (err) {
                setSubmitting(false);
              }
            }}
          >
            {({isSubmitting, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Product name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      className="w-[80%] h-12rem border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      name="name"
                      placeholder="Product name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                      Price
                    </label>
                    <Field
                      id="price"
                      type="number"
                      className="w-[80%] h-12rem border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      name="price"
                      placeholder="Price"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bonus">
                      Bonus
                    </label>
                    <Field
                      id="bonus"
                      type="number"
                      className="w-[80%] h-12rem border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      name="bonus"
                      placeholder="Bonus %"
                    />
                    <ErrorMessage name="bonus" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                      Quantity
                    </label>
                    <Field
                      id="quantity"
                      type="number"
                      className="w-[80%] h-12rem border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      name="quantity"
                      placeholder="Enter Quantity"
                    />
                    <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                      Description
                    </label>
                    <Field
                      id="category"
                      type="text"
                      className="w-[80%] h-rem border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      name="category"
                      placeholder="Enter Product Description"
                    />
                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiryDate">
                      Expiry Date
                    </label>
                    <Field
                      id="expiryDate"
                      type="date"
                      className="w-[80%] h-12rem border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      name="expiryDate"
                      placeholder="Enter expiry Date"
                    />
                    <ErrorMessage name="expiryDate" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sku">
                      SKU
                    </label>
                    <Field
                      id="sku"
                      type="text"
                      className="w-[80%] h-12rem border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      name="sku"
                      placeholder="SKU"
                    />
                    <ErrorMessage name="sku" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
                    <div className="flex items-center">
                      <label className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded cursor-pointer">
                        Choose Images
                        <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            onFileChange(e);
                            setFieldValue("images", e.target.files);
                          }}
                          className="hidden"
                          id="file-upload"
                        />
                      </label>
                      <ErrorMessage name="images" component="div" className="text-red-500 text-sm mt-2" />
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">new added Images</label>
                    <div className="mt-4 flex flex-col space-y-2 w-[50%]">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative border rounded p-1">
                          <div className="relative inline-block">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Thumbnail ${idx}`}
                              id="r"
                              width={50}
                              height={50}
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => onRemoveImage(idx)}
                              className="absolute top-0 right-0 bg-black-500 text-white rounded-full p-1"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Current Images</label>
                    <div className="mt-4 flex flex-col space-y-2 w-[50%]">
                        {Array.isArray(product?.images) && product.images.map((image, idx) => (
                        <div key={idx} className="relative border rounded p-1">
                          <div className="relative inline-block">
                            <img
                              src={image}
                              alt={`Thumbnail ${idx}`}
                              id="r"
                              width={50}
                              height={50}
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => onDeleteImage(image)}
                              name="Delete"
                              className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white rounded-full p-1"
                              >
                              <MdDeleteOutline />
                            </button>
                          </div>
                        </div>
                        ))}
                    </div>

                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} value="Update Product" />
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default UpdateProductForm;
