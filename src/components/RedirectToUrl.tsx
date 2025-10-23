import { useEffect } from "react";

const RedirectToUrl = ({ url }: { url: string }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return null; // Nothing is rendered
};

export default RedirectToUrl;
