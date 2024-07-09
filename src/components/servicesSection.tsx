import React from 'react';
import ServiceCard from './ServiceCard';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import { SlTrophy } from 'react-icons/sl';
import { CiCreditCard1 } from 'react-icons/ci';

interface InputProps {
title?: string;
}

const ServicesSection: React.FC<InputProps> = () => {

  return (

    <div className="services-section flex justify-around my-10 tablet:w-[80%] mx-auto self-center flex-wrap">
    <ServiceCard 
    icon={<TfiHeadphoneAlt  className="text-white text-3xl"/>}
    heading="24/7 CUSTOMER SERVICE"
    subheading="Friendly 24/7 customer support"
    />
    <ServiceCard 
    icon={< SlTrophy  className="text-white text-3xl"/>}
    heading="24 Hours Return"
    subheading="100% money-back guarantee"
    />
    <ServiceCard 
    icon={<CiCreditCard1   className="text-white text-3xl"/>}
    heading="SECURE PAYMENT"
    subheading="Your money is safe with us"
    />

 </div>
  );
};

export default ServicesSection;