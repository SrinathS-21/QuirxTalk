import React, { useEffect, useState } from 'react'
import { MeetingType } from '../utils/Types'
import { meetingRef } from '../utils/FirebaseConfig'
import { useAppSelector } from '../app/hooks';
import { getDocs, query, where } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { EuiBadge, EuiBasicTable, EuiButtonIcon, EuiCopy, EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui';
import Header from '../components/Header';
import moment from 'moment';
import { Link } from 'react-router-dom';
import EditFlyout from '../components/EditFlyout';

export default function MyMeetings() {
    useAuth();
    const [meetings,setMeetings]=useState([MeetingType]);
    const userInfo = useAppSelector((quirxtalk)=>quirxtalk.auth.userInfo);
    const [showEditFlyout, setShowEditFlyout] = useState(false);
    const [editMeeting, setEditMeeting] = useState({MeetingType});

    const getMyMeetings = async () => {
        if (!userInfo) return;
        const firestoreQuery = query(meetingRef, where("createdBy", "==", userInfo.uid));
        const fetchedMeetings = await getDocs(firestoreQuery);
        if (fetchedMeetings.docs.length) {
            const myMeetings = [MeetingType];
            fetchedMeetings.docs.forEach((meeting) => {
                myMeetings.push({
                    docId: meeting.id,
                   ...(meeting.data()),
                });
            });
            setMeetings(myMeetings);
        }
    };

    useEffect(() => {
        getMyMeetings();
    });

    const openEditFlyout = (meeting) => {
        setShowEditFlyout(true);
        setEditMeeting(meeting);
    };

    const closeEditFlyout = (dataChanged = false) => {
        setShowEditFlyout(false);
        setEditMeeting(undefined);
        if (dataChanged) {
            getMyMeetings();
        }
    };
    
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
          field: "",
          name: "Edit",
          width: "5%",
          render: (meeting) => {
            return (
              <EuiButtonIcon
                aria-label="meeting-edit"
                iconType="indexEdit"
                color="danger"
                display="base"
                isDisabled={
                  moment(meeting.meetingDate).isBefore(moment().format("L")) ||
                  !meeting.status
                }
                onClick={() => openEditFlyout(meeting)}
              />
            );
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
          {showEditFlyout && (
            <EditFlyout closeFlyout={closeEditFlyout} meeting={editMeeting} />
          )}
        </div>
      );
}

