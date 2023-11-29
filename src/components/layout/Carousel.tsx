"use client";

import { Carousel } from "flowbite-react";
import Image from "next/image";

// const imgs = [
//   {
//     src: "https://flowbite.com/docs/images/carousel/carousel-1.svg",
//     alt: "img1",
//   },
//   {
//     src: "https://flowbite.com/docs/images/carousel/carousel-2.svg",
//     alt: "img2",
//   },
//   {
//     src: "https://flowbite.com/docs/images/carousel/carousel-3.svg",
//     alt: "img3",
//   },
//   {
//     src: "https://flowbite.com/docs/images/carousel/carousel-4.svg",
//     alt: "img4",
//   },
//   {
//     src: "https://flowbite.com/docs/images/carousel/carousel-5.svg",
//     alt: "img5",
//   },
// ];

const imgs = [
  {
    src: "/images/banners/7f7f5d98ef6a1a130759ca9df9d26465.webp",
    alt: "img1",
  },
  {
    src: "/images/banners/916daf1d85a1ed4636ae61bd9fd97e5f.webp",
    alt: "img2",
  },
  {
    src: "/images/banners/e447c65801443986740ca9a149aeb1bb.webp",
    alt: "img3",
  },
  {
    src: "/images/banners/eef48066af194498473b515a6a7bc5d1.png",
    alt: "img4",
  },
];

export default function DefaultCarousel() {
  return (
    <Carousel>
      {imgs.map((img, idx) => (
        <div key={idx} className="w-full h-full">
          <Image src={img.src} alt={img.alt} fill className="object-cover" />
        </div>
      ))}
    </Carousel>
  );
}
