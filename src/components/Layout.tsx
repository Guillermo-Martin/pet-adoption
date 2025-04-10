import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// --------------------------------------------------------------------
//                            Interfaces
// --------------------------------------------------------------------
// "children" type:  https://stackoverflow.com/questions/55370851/how-to-fix-binding-element-children-implicitly-has-an-any-type-ts7031
interface LayoutProps {
  children: ReactNode;
};

// --------------------------------------------------------------------
//                            Component
// --------------------------------------------------------------------
function Layout({ children }: LayoutProps) {
  return (
    <div className="page-layout bg-inherit">
      <Navbar />
      <main className="main-content px-4 py-3 md:px-16 md:py-4 xl:px-20 mb-6">
        <div className="main-content-container max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Footer position="static" />
    </div>
  );
};

export default Layout;
