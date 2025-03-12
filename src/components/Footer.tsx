interface FooterProps {
  position: string;
}

function Footer({ position }: FooterProps) {
  return (
    // <div className="footer border-t-[6px] px-4 py-3 md:px-16 md:py-4 xl:px-20">
    <div className={`${position} footer border-t-[6px] px-4 py-3 md:px-16 md:py-4 xl:px-20 w-full`}>
      <div className="footer-inner-container max-w-7xl mx-auto bg-sky-900">
        <p className="text-center text-xs">Made using Next.js, Typescript, React, and TailwindCSS.  Designed in Figma.
          Icons by <a href="https://www.freepik.com/author/aomam-ss/icons" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#4369fc]">AomAm.</a> © Copyright 2025.
        </p>
      </div>
    </div>
  );
};

export default Footer;
