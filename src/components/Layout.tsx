import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// "children" type:  https://stackoverflow.com/questions/55370851/how-to-fix-binding-element-children-implicitly-has-an-any-type-ts7031
interface LayoutProps {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
