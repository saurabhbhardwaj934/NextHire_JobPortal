import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const API = "https://nexthire-jobportal-1-9bnb.onrender.com/job";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        
        const res = await axios.get(
  `${JOB_API_ENDPOINT}/get?keyword=${searchedQuery}`,
  {
    withCredentials: true,
  }
);

        console.log("API Response:", res.data);

        if (res.data) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [searchedQuery, dispatch]); // ✅ FIX

  return { loading, error };
};

export default useGetAllJobs;