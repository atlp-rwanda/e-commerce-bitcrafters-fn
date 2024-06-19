import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import SelectCollection from "./SelectCollection";
import Button from "../../components/Button";
import CreateColletion from "./CreateColletion";
import {  ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosClient from "../../hooks/AxiosInstance";

export interface Product {
  name: string;
  price: number;
  category: string;
  bonus: number;
  sku: string;
  quantity: number;
  expiryDate?: string;
  images?: File[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required").positive("Price must be positive"),
  bonus: Yup.number().required("Bonus is required").min(0, "Bonus must be positive or zero"),
  quantity: Yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
  sku: Yup.string()
  .trim()
  .matches(/^[a-zA-Z0-9]*$/, 'SKU must be alphanumeric')
  .min(5, 'SKU must be at least 5 characters')
  .max(20, 'SKU must be at most 20 characters')
  .required('SKU is required'),
  expiryDate: Yup.date().required("Expiry date is required"),
});

const AddProductForm = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const axiosClient = useAxiosClient();
  
  const handleSubmit = async(product: Product)=>{
    try{
      const formData = new FormData();
      Object.keys(product).forEach(key => {
        if (key === 'images' && product.images) {
          product.images.forEach(image => formData.append('images', image));
        } else {
          formData.append(key, product[key as keyof Product] as string);
        }
      });
      const collectionId = localStorage.getItem("collectionId")
      if(!collectionId){
        toast.error("Error adding Product Choose Collection and Try again");
        return "no collection chosen"
      }
      
      const response = await axiosClient.post(`/collections/${collectionId}/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.message === "Product added successfully") {
        toast.success("Product added successfully");
      } else {
        toast.error("Error adding Product Choose Collection and Try again");
      }
      localStorage.removeItem("collectionId")
      return response.data
    }catch(error){
      toast.error("Error adding Product Try again");
    }
  }

  const handleAddOption = () => {
    setIsModalOpen(false);
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

  const validateImages = (value: File[]) => {
    if (value.length < 4 || value.length > 8) {
        return true;
    }
    return false;
  };

  return (
    <div className="flex flex-row space-x-4 bg-custom-bg">
      <div className="bg-custom-white flex-auto items-start justify-between p-5 border-b rounded-t">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Product</h2>
        <div className="p-6 space-y-6">
          <Formik
            initialValues={{
              name: "",
              category: "",
              price: 0,
              bonus: 0,
              quantity: 0,
              sku: "",
              expiryDate: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting,  resetForm}) => {
            const fileValidationError = validateImages(files);
            if (fileValidationError) {
                toast.error("Please upload images between 4 and 8");
                setSubmitting(false);
                return;
            }
              try {
                handleSubmit({
                  ...values,
                  images: files,
                })
                setFiles([]);
                setSubmitting(false);
                resetForm();
              } catch (err) {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name" >
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
                    <h2 className="block text-gray-700 text-sm font-bold mb-2">Collections</h2>
                    <SelectCollection />
                    <div className="mt-2 relative inline-block col-span-4 sm:col-span-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-600"
                      >
                        Add new Collection
                      </button>
                    </div>
                  </div>
                  <CreateColletion
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddOption}
                  />
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
                    <label className="block text-gray-700 text-sm font-bold mb-2">Added Images</label>
                    <div className="mt-4 flex space-x-2 w-[100]">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative border rounded p-1">
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
                      ))}
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} value="Add Product" />
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddProductForm;
