                                                      import { useEffect } from "react";
import { useLocation } from "react-router-dom";
 
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
 
  useEffect(() => {
    // If there is a hash (like #faq), scroll to that element
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Otherwise scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);
 
  return null;
};
 
export default ScrollToTop;
