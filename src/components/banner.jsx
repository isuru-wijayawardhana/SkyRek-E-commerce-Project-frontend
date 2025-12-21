import React, { useEffect, useState } from 'react'
import image1 from '../assets/1.png'
import image2 from '../assets/2.png'
import image3 from '../assets/3.png'


import image1Mobile from '../assets/1.png'
import image2Mobile from '../assets/2.png'
import image3Mobile from '../assets/3.png'


import { TfiAngleDoubleLeft } from "react-icons/tfi";
import { TfiAngleDoubleRight } from "react-icons/tfi";

export default function Banners(){

    const [currentImage,setCurrentImage] = useState(0)

    const desktopImages = [
        image1,
        image2,
        image3
    ]
    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile
    ]
    const nextImage = () =>{
        if(desktopImages.length - 1 > currentImage){
            setCurrentImage(preve => preve + 1)
        }
        
    }
    const preveImage = () =>{
        if(currentImage !== 0){
            setCurrentImage(preve => preve - 1)
        }
        
    }

    useEffect(()=>{
        const interval = setInterval(()=>{
            if(desktopImages.length -1>currentImage){
                nextImage()
            }else{
                setCurrentImage(0)
            }
        },3000)
        return ()=>clearInterval(interval)
    },[currentImage])

  return (
    <div className='container mx-auto px-4 rounded'>
        <div className='h-56 md:h-[350px] w-full bg-slate-200 relative'>

            <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
                <div className='flex justify-between w-full text-3xl'>
                    <button className='bg-white shadow-md rounded-full p-1' onClick={preveImage}><TfiAngleDoubleLeft/></button>
                    <button className='bg-white shadow-md rounded-full p-1'onClick={nextImage}><TfiAngleDoubleRight/></button>
                </div>
            </div>

            {/** Desktop and Tablet version */}
            <div className='hidden md:flex h-full w-full overflow-hidden'>
                {
                    desktopImages.map((imageURl,index)=>{
                        return(
                        <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform : `translatex(-${currentImage * 100}%)`}}>
                            <img src={imageURl} className='w-full h-full' alt={imageURl} />
                        </div>
                        )
                    })
                }
            </div>

            {/** Mobile version */}
            <div className='flex h-full w-full overflow-hidden md:hidden'>
                {
                    mobileImages.map((imageURl,index)=>{
                        return(
                        <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform : `translatex(-${currentImage * 100}%)`}}>
                            <img src={imageURl} className='w-full h-full object-cover' alt={imageURl}/>
                        </div>
                        )
                    })
                }
            </div>
            
        </div>
    </div>
  )
}
