import React, { useEffect, useState } from 'react'
import { MeetingType } from '../utils/Types'
import { meetingRef } from '../utils/FirebaseConfig'
import { useAppSelector } from '../app/hooks';
import { query} from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { EuiBadge, EuiBasicTable, EuiButtonIcon, EuiCopy, EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui';
import Header from '../components/Header';
import moment from 'moment';
import { Link } from 'react-router-dom';


export default function Meeting() {
    useAuth();
    const [meetings,setMeetings]=useState([MeetingType]);
    const userInfo = useAppSelector((quirxtalk)=>quirxtalk.auth.userInfo);
   

   
    useEffect(() => {
        if(userInfo){
            const getUserMeetings = async () => {
                const firestoreQuery = query(meetingRef);
                const fetchedMeetings = await fetch(firestoreQuery); 
                if(fetchedMeetings && fetchedMeetings.docs && fetchedMeetings.docs.length){
                    const myMeetings=[];
                    fetchedMeetings.forEach(meeting=>{
                        const data = meeting.data();
                        if(data.createdBy===userInfo?.uid) myMeetings.push(data);
                        else if(data.meetingType==="anyone-can-join") myMeetings.push(data);
                        else {
                            const index = data.invitedUsers.findIndex(user=>user===userInfo.uid);
                            if(index!== -1){
                                myMeetings.push(data);
                            }
                        }
                    });
                    setMeetings(myMeetings);
                }
            };
            getUserMeetings();
        }
    });
    
  
    
      const meetingColumns = [
        {
          field: "meetingName",
          name: "Meeting Name",
        },
        {
          field: "meetingType",
          name: "Meeting Type",
        },
        {
          field: "meetingDate",
          name: "Meeting Date",
        },
        {
          field: "",
          name: "Status",
          render: (meeting) => {
            if (meeting.status) {
              if (meeting.meetingDate === moment().format("L")) {
                return (
                  <EuiBadge color="success">
                    <Link
                      to={`/join/${meeting.meetingId}`}
                      style={{ color: "black" }}
                    >
                      Join Now
                    </Link>
                  </EuiBadge>
                );
              } else if (
                moment(meeting.meetingDate).isBefore(moment().format("L"))
              ) {
                return <EuiBadge color="default">Ended</EuiBadge>;
              } else if (moment(meeting.meetingDate).isAfter()) {
                return <EuiBadge color="primary">Upcoming</EuiBadge>;
              }
            } else return <EuiBadge color="danger">Cancelled</EuiBadge>;
          },
        },
        {
          field: "meetingId",
          name: "Copy Link",
          width: "5%",
          render: (meetingId) => {
            return (
              <EuiCopy
                textToCopy={`${process.env.REACT_APP_HOST}/join/${meetingId}`}
              >
                {(copy) => (
                  <EuiButtonIcon
                    iconType="copy"
                    onClick={copy}
                    display="base"
                    aria-label="meeting-copy"
                  />
                )}
              </EuiCopy>
            );
          },
        },
      ];
    
      return (
        <div
          style={{
            display: "flex",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <Header />
          <EuiFlexGroup justifyContent="center" style={{ margin: "1rem" }}>
            <EuiFlexItem>
              <EuiPanel>
                <EuiBasicTable items={meetings} columns={meetingColumns} />
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      );
}

