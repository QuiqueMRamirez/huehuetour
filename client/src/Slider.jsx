import useEmblaCarousel from "embla-carousel-react";
import Autoplay from 'embla-carousel-autoplay'


const Slider = ({ children, options }) => {
  // 2. initialize EmblaCarousel using the custom hook
  const [emblaRef] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "start",
    ...options,
  },[Autoplay()]);

  return (
    // 3. set ref as emblaRef.
    // make sure we have overflow-hidden and flex so that it displays properly
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-10">{children}</div>
    </div>
  );
};
export default Slider;