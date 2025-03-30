import { useAppStore } from "@/store";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Chat = () => {
  const {userInfo} = useAppStore();
  const navigate = useNavigate();
  const [profileSetup, setProfileSetup] = useState();    
  useEffect(() => {
    if(!userInfo.profileSetup){
      toast.error("Please setup your profile first");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  const handleProfileSetup = () => {
    navigate("/profile");
  }

  return (
    <div>Chat
      <div>Email: {userInfo.email}</div>
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleProfileSetup}>Profile Setup</button>
    </div>
  )
}

export default Chat