import { createContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
          const [darkMode, setDarkMode] = useState(() => {
                    const savedMode = localStorage.getItem("darkMode");
                    return savedMode ? JSON.parse(savedMode) : false;
          });

          useEffect(() => {
                    localStorage.setItem("darkMode", JSON.stringify(darkMode));
                    if (darkMode) {
                              document.body.classList.add("dark-mode");
                    } else {
                              document.body.classList.remove("dark-mode");
                    }
          }, [darkMode]);

          const toggleDarkMode = () => {
                    setDarkMode((prevMode) => !prevMode);
          };

          return (
                    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
                              {children}
                    </DarkModeContext.Provider>
          );
};

export default DarkModeContext;