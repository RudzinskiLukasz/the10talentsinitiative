import { useEffect, useState } from "react";
import { fetchSiteFiles, SITE_FILES_UPDATED_EVENT } from "../lib/siteFilesApi.js";

export function useSiteFiles() {
  const [files, setFiles] = useState({});

  useEffect(() => {
    let active = true;
    let request = 0;

    function load() {
      const id = ++request;
      fetchSiteFiles()
        .then((map) => {
          if (!active || id !== request) return;
          setFiles((prev) => {
            if (
              Object.keys(prev).length === 0 &&
              Object.keys(map || {}).length === 0
            ) {
              return prev;
            }
            return map || {};
          });
        })
        .catch(() => {
          if (active && id === request) setFiles({});
        });
    }

    load();
    window.addEventListener(SITE_FILES_UPDATED_EVENT, load);
    return () => {
      active = false;
      window.removeEventListener(SITE_FILES_UPDATED_EVENT, load);
    };
  }, []);

  return files;
}
