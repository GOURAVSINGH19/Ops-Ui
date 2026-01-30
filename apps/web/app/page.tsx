import Svg from "@/components/svg";
import Home from "../components/home/Home";
import Footer from "@/components/footer/Footer";
import LatestComponent from "@/components/newcomponents/Newcomponent";
import { Techsection } from "@/components/footer/Tech";

const ComponentLibraryDemo = () => {
  
  return (
    <main className="w-screen h-full bg_svg">
      <Svg />
      <div className=" z-[10] max-w-screen-sm w-full md:max-w-screen-xl mx-auto md:p-[.8rem] px-[.5rem] md:px-[2rem]">
        <Home />
        <LatestComponent />
        <Techsection />
        <Footer />
      </div>
    </main>
  );
};

export default ComponentLibraryDemo;