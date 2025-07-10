import { useSelector } from "react-redux";
import { KeyFetch } from "../services/api";
import { useEffect } from "react";

const useGetKey = () => {
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetch();

    const fetch = async () => {
      try {
        const response = await KeyFetch(token);
        if (response === false) {
          return false;
        } else {
          return response;
        }
      } catch (error) {
        console.log("key fetch error:", error);
        return false;
      }
    };
  });
};

export default useGetKey;
