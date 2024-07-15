
// import Button from "../components/Button";
import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import useAxiosClient from "../hooks/AxiosInstance";
import Button from "../components/Button";
import { ThreeDots } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { IoMdStarHalf } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { TbProgressCheck } from "react-icons/tb";
import moment from "moment";


const UserOrderTrack: React.FC = () => {

    const client = useAxiosClient();
    const notify = (message: string) => toast(message);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const { orderId } = useParams<{ orderId: string }>();
    const [response, setResponse] = useState<any>({})
    const [orderItems, setOrderItems] = useState<any>([])
    

    const fetchOrder = async () => {
        try {
          const response = await client.get(`/orders/${orderId}`);

          if (response?.status === 200){
            console.log("data fetched: ", response?.data )
            setResponse(response.data.order)
            setOrderItems(response.data.order.items)
          }

        } catch (err: any) {
          setIsLoading(false);
          notify(err.order ? err.response?.data.message : "Fetching Order failed");
          console.log("fetch failed")
        } finally {
          setIsLoading(false);
        }
      };


      useEffect(()=>{
        fetchOrder()
      },
    [])

    if (isLoading) {
      return (
        <div className="w-full text-black h-[60vh] mx-auto items-center justify-center flex flex-col gap-3">
          <p>Loading... </p>
          <ThreeDots visible={true} height="50" width="50" color="rgb(38 38 38)" radius="5" ariaLabel="three-dots-loading" />
        </div>
      );
    }

  return (
    <div className="container  m-3 tablet:m-10 flex flex-col gap-5 space-x-2 justify-start tablet:min-h-[80vh] phone:px-10 py-10 tablet:py-1">

        <div className="border border-gray rounded-md p-5">
        <SectionHeader title="Order Details"/>

        <div className="flex items-center justify-between my-2 mt-5 w-[90%] mx-auto">
            <div className="flex gap-2 items-center">
                <p className="font-semibold">Order Id</p>
                <p className="text-gray_100 text-xs">#{response?.id}</p>
            </div>

            <div className="flex gap-2 items-center">
                <p className="font-semibold">Placed On</p>
                <p className="text-gray_100">{ moment(response?.createdAt).format('DD/MMMM/YYYY')}</p>
            </div>

            <div className="flex gap-2 items-center">
                <p className="font-semibold">Order Number</p>
                <p className="text-gray_100">{response?.orderNumber}</p>
            </div>
            
        </div>

        <div className="flex justify-between items-center w-[90%] my-3 mx-auto">
            <div className="flex gap-3 items-center">
            <div className={response?.status === "Completed"?"p-2 bg-green-300 rounded-full": response?.status === "Pending" ? "p-2 bg-orange-200 rounded-full" :"p-2 bg-red-300 rounded-full"}>
                <div className={response?.status === "Completed" ?"p-2 bg-green-500 rounded-full": response?.status === "Pending" ? "p-2 bg-orange-400 rounded-full" :"p-2 bg-red-500 rounded-full"}>
                    {response?.status === "Completed" ?<FaCheck className="text-white text-xl"/> : response?.status === "Pending" ? <TbProgressCheck className="text-white text-xl"/>: <IoClose className="text-white text-xl"/>}
                </div>
            </div>
            <p>Order {response?.status}</p>
            </div>
            <div className="flex items-center gap-5 bg-black rounded p-3 py-4">
            <p className="font-medium text-gray_100 text-sm">Total Amount:</p>
            <p className="text-white text-sm">{response?.totalAmount
}</p>
            </div>
        </div>
        </div>

        <div className="border border-gray rounded-md p-5">
        <SectionHeader title="Items In Order"/>
{showReviewModal &&
    <div className="bg-[rgba(0,0,0,0.6)]  w-full h-full fixed top-0 left-0 flex items-center justify-center" >
        <div className="bg-white border border-gray rounded p-5 flex flex-col gap-3 tablet:w-[50%]">
         <div className="flex items-center justify-center w-full my-5 relative">
            <p>Rate Product</p>
                  <div className="absolute  right-5 top-[-10px] bg-black align-left items-center  justify-center flex p-2 rounded-full self-end" onClick={()=>{setShowReviewModal(false)}}>
                <IoClose className="text-white text-xl"/>
            </div>
         </div>
            
                <form action="" className="flex flex-col gap-3">
                    <div className=" flex gap-3 w-[50%] items-center justify-between">
                        <label htmlFor="feedback">Feedback</label>
                        <input type="text" name="feedback" id="feedback" className="border border-gray_100 rounded-sm p-2 px-3 "/>
                    </div>
                    <div className=" flex gap-3 w-[50%] items-center justify-between">
                        <label htmlFor="name">Rating</label>
                        <input type="text" name="name" id="name" className="border border-gray_100 p-2 px-3 rounded-sm"/>
                    </div>
                    <Button 
                    value="Add Review"
                    onClick = {()=>{}}
                    />
                </form>
           
        </div>
    </div>
}

        <div className="overflow-y-scroll mt-5">

        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light rounded-full border border-neutral-100">
              <thead className="border-b font-medium bg-neutral-200 dark:border-neutral-500 rounded border-red-500">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">#</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Image</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Product</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Price</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Quantity</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm"></th>
                </tr>
              </thead>

              {orderItems.map((item:any, index:number)=>{
 return(
  <tbody key={index}>
  <tr
    className="border-b  transition duration-300 ease-in-out hover:bg-neutral-50 dark:border-neutral-500 dark:hover:bg-neutral-600">
    <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm font-medium">{index + 1}</td>
    <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm">
    <img src={item.images[0]} alt="" className="w-20 h-20 object-cover rounded-sm" />
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm ">
    <p>{item.name}</p>
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm"><p>{item.price}</p></td>
    <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm font-medium " ><p className="text-start p-1 rounded-full"
      >{item.quantity}</p></td>
    <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm ">
    <button type="button"
onClick={()=>{setShowReviewModal(true)}}
className=" bg-orange-50  p-2 px-3 rounded-sm border border-gray_100 flex gap-2 items-center m-auto self-start">
  <IoMdStarHalf className="text-orange-500 text-lg"/>
  <p className="text-orange-500">Review Product</p>

</button>
    </td>
  </tr>
 
</tbody>
)
})  


}
            </table>
          </div>
        </div>
      </div>

        </div>
        </div>
      
    </div>
  );
};

export default UserOrderTrack;
