import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from '../Directives/Header'
import S1Hero from '../Components/S1Hero'
import S2Whychoose from '../Components/S2WhyChoose'
import S3RealEstate from '../Components/S3RealEstate'
import S4HowItWork from '../Components/S4HowItWork'
import S5Tokenization from '../Components/S5Tokenization'
import S6Invest from '../Components/S6Invest'
import Tokenomics from '../Components/Tokenomics'
import S7Benefits from '../Components/S7Benefits'
import S8Faqs from '../Components/S8Faqs'
import Footer from '../Directives/Footer'



function HomePage() {

  const location1 = useLocation();
  useEffect(() => {
    const scrollToElement = () => {
      const { search } = location1;
      const params = new URLSearchParams(search);
      const scrollToId = params.get('');

      if (scrollToId) {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    scrollToElement();
  }, [location1]);

  return (
    <>
      <div className="bg-white  ">

      <Header /> 
      <S1Hero />
      <S2Whychoose />
      <S3RealEstate />
      <S4HowItWork />
      <S5Tokenization />
      <S6Invest />
      <Tokenomics />
      <S7Benefits />
      <S8Faqs />
      <Footer /> 
      </div>
    </>
  )
}

export default HomePage;
