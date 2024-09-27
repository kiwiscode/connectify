import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const SubcsriptionStatusContext = createContext();

const API_URL = import.meta.env.VITE_APP_API_URL;

export const SubscriptionStatusProvider = ({ children }) => {
  const { getToken } = useContext(UserContext);
  const [subscription, setSubscription] = useState(null);

  const [remainingTimeSubscriptions, setRemainingTimeSubscriptions] = useState(
    []
  );
  const [
    remainingTimeSubscriptionsOwnerIds,
    setRemainingTimeSubscriptionsOwnerIds,
  ] = useState([]);
  const getSubscription = async () => {
    try {
      const response = await axios.get(`${API_URL}/subscription`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setSubscription(
        response.data.activeSubscription[0]
          ? response.data.activeSubscription[0]
          : response.data.activeCancelledSubscription[0]
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getRemainingTimeSubscriptions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/remaining_time_subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setRemainingTimeSubscriptions(response.data.remainingTimeSubscriptions);

      setRemainingTimeSubscriptionsOwnerIds(
        response.data.remainingTimeSubscriptions.map((eachSub) => {
          return eachSub.owner;
        })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getSubscription();
    getRemainingTimeSubscriptions();
  }, []);
  return (
    <SubcsriptionStatusContext.Provider
      value={{
        subscription,
        remainingTimeSubscriptions,
        remainingTimeSubscriptionsOwnerIds,
      }}
    >
      {children}
    </SubcsriptionStatusContext.Provider>
  );
};
