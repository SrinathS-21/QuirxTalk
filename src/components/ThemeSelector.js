import React, { Suspense, useEffect, useState } from "react";
const LightTheme = React.lazy(() => import("./Themes/LightTheme"));
const DarkTheme = React.lazy(() => import("./Themes/DarkTheme"));

export default function ThemeSelector({ children}){
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const theme = localStorage.getItem("quirxtalk-theme");
    if (theme) {
      setTheme(theme);
    }
  }, []);

  return (
    <>
      <Suspense fallback={<></>}>
        {theme === "dark" ? <DarkTheme /> : <LightTheme />}
      </Suspense>
      {children}
    </>
  );
}