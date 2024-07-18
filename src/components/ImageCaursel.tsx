import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';


function Gallery(props: { Images: any }) {
    const handleDragStart = (e:any) => e.preventDefault();
    const all: any[] = []

        props.Images.map((imageLink:any, index:number)=>{
            all.push(
                <img key={index} className='border h-[30vh] tablet:h-[40vh] w-[100%] self-center bg-gray px-2 object-contain rounded border-gray_100' src={imageLink} onDragStart={handleDragStart} role="presentation"/>
            )
        })

  return (
    <AliceCarousel mouseTracking items={all} infinite={true} keyboardNavigation={true} />
  )
}


export default Gallery