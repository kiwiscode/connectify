import { createContext, useState } from "react";

export const ModalVisibilityContext = createContext();

export const ModalVisibilityProvider = ({ children }) => {
  const [isPostModalVisible, setIsPostModalVisible] = useState(null);

  const togglePostModalVisibility = () => {
    setIsPostModalVisible(!isPostModalVisible);
  };

  return (
    <ModalVisibilityContext.Provider
      value={{
        isPostModalVisible,
        togglePostModalVisibility,
      }}
    >
      {children}
    </ModalVisibilityContext.Provider>
  );
};
