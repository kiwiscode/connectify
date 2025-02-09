import { createContext, useState } from "react";

export const StateRefreshTriggersContext = createContext({
  triggerRefreshWhoToFollow: 0,
  setTriggerRefreshWhoToFollow: () => {},
});

export const StateRefreshTriggersContextProvider = ({ children }) => {
  const [triggerRefreshWhoToFollow, setTriggerRefreshWhoToFollow] = useState(0);

  return (
    <StateRefreshTriggersContext.Provider
      value={{
        triggerRefreshWhoToFollow,
        setTriggerRefreshWhoToFollow,
      }}
    >
      {children}
    </StateRefreshTriggersContext.Provider>
  );
};
