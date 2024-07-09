import Image from "../assets/images/image.svg"
import Image2 from "../assets/images/Image2.svg"
import Image3 from "../assets/images/Image3.svg"
import SectionHeader from "../components/SectionHeader";
import TeamCard from "../components/TeamCard";
import Person1 from "../assets/images/person1.svg"
import Person2 from "../assets/images/person2.svg"
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import ServicesSection from "../components/servicesSection";

const AboutPage: React.FC = () => {

  return (
    <div className="container  m-3 tablet:m-10 flex flex-col space-x-2 justify-start tablet:min-h-[80vh] phone:px-10 py-10 tablet:py-1">
        <SectionHeader title="About Us"/>
       <div className="about-section  flex flex-wrap  justify-between">
        <div className="tablet:w-[50%] p-2 flex flex-col gap-5 items-start justify-start">
            <h3 className="uppercase text-lg phone:text-3xl">
            orci ac risus lobortis aenean diam aenean
            </h3>
        <p className="description"> 
        Bit.Shop is an e-commerce website that eases the commerce structure.
        Lorem ipsum dolor sit amet consectetur.
        In eu aliquet orci ac risus lobortis aenean diam aenean. Quam sodales faucibus amet.
        </p>
        <p className="description"> 
        Bit.Shop is an e-commerce website that eases the commerce structure.
        Lorem ipsum dolor sit amet consectetur.
        </p>
        <div>
<div className="flex gap-2 items-center my-4">
    <IoCheckmarkDoneOutline className="text-green-400 text-lg"/>
    <p>100+ Dedicated Customers</p>
</div>
<div className="flex gap-2 items-center my-4">
    <IoCheckmarkDoneOutline className="text-green-400 text-lg"/>
    <p>24/7 customer support</p>
</div>
<div className="flex gap-2 items-center my-4">
    <IoCheckmarkDoneOutline className="text-green-400 text-lg"/>
    <p>100+ Customer satisfaction</p>
</div>
        </div>
        </div>

<div className="tablet:w-[40%] flex flex-wrap items-center gap-5 justify-center">
    <img src={Image} alt="image1" className="h-[200px] w-[200px] object-cover rounded-full"/>
    <img src={Image2} alt="image2" className="h-[200px] w-[200px] object-cover rounded-full"/>
    <img src={Image3} alt="image3" className="h-[200px] w-[200px] object-cover rounded-full"/>
</div>
       </div>
<ServicesSection/>

 <div className="team-section">
 <SectionHeader title="Meet the team"/>

 <div className="section-content flex flex-row gap-5 flex-wrap">
    <TeamCard
    Image={Person1}
    name="Gatete Angelo Christian"
    title="Software Developer"
    linkedin={"https://www.linkedin.com/in/gatete-ishema-angelo-christian-332196178/"}
    github="https://github.com/angeloChristian1"
    />
    <TeamCard
    Image={Person1}
    name="Eric Niyokwizerwa"
    title="Software Developer"
    linkedin={""}
    github=""
    />
    <TeamCard
    Image={Person1}
    name="Yvan David"
    title="Software Developer"
    linkedin={""}
    github=""
    />
    <TeamCard
    Image={Person1}
    name="Sosthen Bananayo"
    title="Software Developer"
    linkedin={""}
    github=""
    />
    <TeamCard
    Image={Person1}
    name="Athos Mpano"
    title="Software Developer"
    linkedin={""}
    github=""
    />
    <TeamCard
    Image={Person2}
    name="Justine Furaha"
    title="Software Developer"
    linkedin={""}
    github=""
    />

 </div>
 </div>
    </div>
  );
};

export default AboutPage;
