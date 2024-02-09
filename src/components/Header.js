import React from "react";
import { GiBee } from "react-icons/gi";
import { BsSpellcheck } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";

const Header = () => {
  return (
    <div className="w-full max-w-xl mb-4 flex justify-between items-center">
      <div className="flex items-center gap-1">
        <GradientIcon
          IconComponent={GiBee}
          svgClassName="w-7 h-7 relative md:bottom-[1.1rem] bottom-[0.9rem] animate-wiggle"
          viewBox={"0 0 16 16"}
        />
        <div className="md:text-5xl text-4xl font-josefin font-bold ml-[-1rem]">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500">
            spel
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-500/80 to-black">
            lol
          </span>
        </div>
      </div>
      <button className="flex items-center justify-center py-1 pl-4 pr-2 bg-gradient-to-t from-lime-400 via-lime-400/80 to-lime-300/50 text-white rounded-full">
        {/* <BsSpellcheck className="w-7 h-7 md:h-8 md:w-8 mr-2" /> */}
        <span className="md:text-2xl text-lg font-semibold tracking-wider mr-1">
          menu
        </span>
        <IoMdArrowDropdown className="w-5 h-5 md:w-7 md:h-7" />
      </button>
    </div>
  );
};

export default Header;

const GradientIcon = ({
  IconComponent,
  gradientId = "icon-gradient",
  svgClassName,
  viewBox,
}) => {
  return (
    <svg className={svgClassName} viewBox={viewBox}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" /> {/* Amber color */}
          <stop offset="100%" stopColor="#111827" /> {/* Black color */}
        </linearGradient>
      </defs>
      <IconComponent fill={`url(#${gradientId})`} />
    </svg>
  );
};
