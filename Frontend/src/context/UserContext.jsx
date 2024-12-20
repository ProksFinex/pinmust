import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PinData } from "./PinContext";

const userContext = createContext();

//wrapper for main file
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  

  async function registerUser(name, email, password, navigate,fetchPins ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password, navigate,fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", { email, password });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchPins()
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  const [loading, setLoading] = useState(true);
  //as we know that after login our isAuth is going to get false so we'll fetch our profile by the help of cookie

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function followUser(id,fetchUser){
    try {
      const {data}= await axios.post("/api/user/follow/"+id)
      toast.success(data.message)
      followUser();
    } catch (error) {
      toast.error(error.response.data.message);

    }
  }


  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <userContext.Provider
      value={{ registerUser,loginUser, btnLoading, isAuth, user, loading, setIsAuth,setUser,followUser }}
    >
      
      {children}
      <Toaster />
    </userContext.Provider>
  );
};

export const UserData = () => useContext(userContext);
