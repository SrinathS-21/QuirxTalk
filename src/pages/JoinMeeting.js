import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firebaseAuth, meetingRef } from "../utils/FirebaseConfig";
import { generateMeetingId } from "../utils/generateMeetingId";


export default function JoinMeeting() {
  const params = useParams();
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(false);
  const [user, setUser] = useState(undefined);
  const [userLoaded, setUserLoaded] = useState(false);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }
    setUserLoaded(true);
  });
  useEffect(() => {
    const getMeetingData = async () => {
      if (params.id && userLoaded) {
        const firestoreQuery = query(
            meetingRef,
          where("meetingId", "==", params.id)
        );
        const fetchedMeetings = await getDocs(firestoreQuery);

        if (fetchedMeetings.docs.length) {
          const meeting = fetchedMeetings.docs[0].data();
          const isCreator = meeting.createdBy === user?.uid;
          if (meeting.meetingType === "1-on-1") {
            if (meeting.invitedUsers[0] === user?.uid || isCreator) {
              if (meeting.meetingDate === moment().format("L")) {
                setIsAllowed(true);
              } else if (
                moment(meeting.meetingDate).isBefore(moment().format("L"))
              ) {
               
                navigate(user ? "/" : "/login");
              } else if (moment(meeting.meetingDate).isAfter()) {
                
                navigate(user ? "/" : "/login");
              }
            } else navigate(user ? "/" : "/login");
          } else if (meeting.meetingType === "video-conference") {
            const index = meeting.invitedUsers.findIndex(
              (invitedUser) => invitedUser === user?.uid
            );
            if (index !== -1 || isCreator) {
              if (meeting.meetingDate === moment().format("L")) {
                setIsAllowed(true);
              } else if (
                moment(meeting.meetingDate).isBefore(moment().format("L"))
              ) {
               
                navigate(user ? "/" : "/login");
              } else if (moment(meeting.meetingDate).isAfter()) {
                
              }
            } else {
              
              navigate(user ? "/" : "/login");
            }
          } else {
            setIsAllowed(true);
          }
        }
      }
    };
    getMeetingData();
  }, [params.id, user, userLoaded, navigate]);

  const appId=;// zegocloud id
  const serverSecret= ""; // zegocloud seversecret

  const myMeeting = async (element) => {
    // Ensure the user ID is available
    if (!user?.uid) {
      console.error("User ID is not available");
      return;
    }
  
    // Log the user ID for debugging
    console.log("User ID:", user.uid);
  
    const userId = user.uid; // Ensure the user ID is correctly passed here
  
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      params.id,
      userId, 
      user.displayName? user.displayName : generateMeetingId()
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    console.log("ZegoUIKit instance created:", zp);
  
    // Ensure the ZegoUIKit instance is not null before calling joinRoom
    if (zp) {
      zp.joinRoom({
        container: element,
        maxUsers: 50,
        sharedLinks: [
          {
            name: "Personal link",
            url: window.location.origin,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    } else {
      console.error("ZegoUIKit instance is null");
    }
  };
  
  
  

  return (
    <div>
        {isAllowed && (
             <div
             style={{
               display: "flex",
               height: "100vh",
               flexDirection: "column",
             }}
           >
             <div
               className="myCallContainer"
               ref={myMeeting}
               style={{ width: "100%", height: "100vh" }}
             ></div>
           </div>
        )}
    </div>
  );
}
