// import Button from "../components/Button";
import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import useAxiosClient from "../hooks/AxiosInstance";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { TbProgressCheck } from "react-icons/tb";
import moment from 'moment'


const UserOrders: React.FC = () => {

    const navigate = useNavigate()
    const client = useAxiosClient();
    const notify = (message: string) => toast(message);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<any>([])

    const fetchOrder = async () => {
        try {
          const response = await client.get(`/orders`);

          if (response.status === 200){
            setOrders(response.data.orders)
            console.log("data: ", response.data )
          }

        } catch (err: any) {
          setIsLoading(false);
          notify(err.response ? err.response.data.message : "Fetching Order failed");
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

    const PendingOrders = orders?.filter(
        (orders:any) => orders?.status === "Pending"
      );
      const CompletedOrders = orders?.filter(
        (orders:any) => orders?.status === "Completed"
      );
      const CanceledOrders = orders?.filter(
        (orders:any) => orders?.status === "Canceled"
      );

  return (
    <div className="container  m-3 tablet:m-10 flex flex-col gap-5 space-x-2 justify-start tablet:min-h-[80vh] phone:px-10 py-10 tablet:py-1">

        <div className="border border-gray rounded-md p-5">
        <SectionHeader title="Order Summary"/>

        <div className="flex flex-wrap  items-center gap-2 justify-center tablet:justify-between my-3 w-full tablet:w-[90%] mx-auto">
            <div className="flex flex-col tablet:flex-row gap-2 items-center border bg-neutral-100 p-3 rounded border-gray_100">
            <div className={"p-2 bg-green-200 rounded-full"}>
                <div className={"p-2 bg-green-400 rounded-full"}>
                    <FaCheck className="text-white text-xl"/>
                </div>
            </div>

            <div>
                   <p className=" test-sm">Orders Completed</p>
                <p className="font-medium text-lg ml-2 tablet:text-center">{CompletedOrders?.length}</p>
            </div>

            </div>
            <div className="flex flex-col tablet:flex-row gap-2 items-center border bg-neutral-100 p-3 rounded border-gray_100">
            <div className={"p-2 bg-orange-200 rounded-full"}>
                <div className={"p-2 bg-orange-300 rounded-full"}>
                    <TbProgressCheck className="text-white text-xl"/>
                </div>
            </div>

            <div>
                   <p className=" test-sm">Orders In Progress</p>
                <p className="font-medium text-lg ml-2 tablet:text-center">{PendingOrders?.length}</p>
            </div>

            </div>
            <div className="flex flex-col tablet:flex-row gap-2 items-center border bg-neutral-100 p-3 rounded border-gray_100">
            <div className={"p-2 bg-red-200 rounded-full"}>
                <div className={"p-2 bg-red-400 rounded-full"}>
                    <IoClose className="text-white text-xl"/>
                </div>
            </div>

            <div>
                   <p className=" test-sm">Orders Canceled</p>
                <p className="font-medium text-lg ml-2 tablet:text-center">{CanceledOrders?.length}</p>
            </div>

            </div> 
        </div>

        </div>

        <div className="border border-gray rounded-md p-5">
        <SectionHeader title="Recent Orders"/>


      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light rounded">
              <thead className="border-b font-medium bg-neutral-200 dark:border-neutral-500 rounded">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">#</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Order Id</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">No. Items</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Total Amount</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Payment Method</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Order Status</th>
                  <th scope="col" className="px-6 py-4 text-xs tablet:text-sm">Action</th>
                </tr>
              </thead>
        {orders?.map((item:any, index:number)=>{

            return(
                <tbody key={index}>
                <tr
                  className="border-b  transition duration-300 ease-in-out hover:bg-neutral-50 dark:border-neutral-500 dark:hover:bg-neutral-600">
                  <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm font-medium">{index + 1}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm">{item?.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm">{moment(item?.createdAt).format('DD/MMMM/YYYY') }</td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm ">{item?.totalAmount}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm">{item?.paymentInfo.method}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs tablet:text-sm font-medium " ><p className="text-center p-1 rounded-full"
                   style={{
                    background:(item?.status == "Completed")?"rgba(76, 175, 80, .2)":(item?.status == "Pending"?"rgba(249, 115 ,22, .2)":"rgba(239,68,68, .2)"),
                    color:(item?.status == "Completed")?"rgba(76, 175, 80)":(item?.status == "Pending"?"rgba(249, 115 ,22)":"rgba(239,68,68)"),

                }}
                    >{item?.status}</p></td>
                  <td className="whitespace-nowrap px-6 py-4 flex gap-1 items-center ">
                    <p className="text-blue-600 cursor-pointer font-medium" onClick={()=>{navigate(`/order/${item?.id}`, {state:{data:item}})}}>View</p>
                  </td>
                </tr>

              </tbody>
            )
        })    }
            </table>
          </div>
        </div>
      </div>
    </div>


        </div>

  );
};

export default UserOrders;