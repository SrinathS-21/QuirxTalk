import React, { useState } from 'react'
import Header from '../components/Header'
import { EuiFlexGroup, EuiForm, EuiSpacer } from '@elastic/eui'
import MeetingNameField from '../components/FormComponents/MeetingNameField'
import MeetingUsersField from '../components/FormComponents/MeetingUsersField'
import useAuth from '../hooks/useAuth'
import useFetchUsers from '../hooks/useFetchUsers'
import moment from 'moment'
import MeetingDateField from '../components/MeetingDateField'
import CreateMeetingButtons from '../components/FormComponents/CreateMeetingButtons'
import { meetingRef } from '../utils/FirebaseConfig'
import { addDoc } from 'firebase/firestore'
import { generateMeetingId } from '../utils/generateMeetingId'
import { useAppSelector } from '../app/hooks'
import { useNavigate } from 'react-router-dom'


function OneonOneMeeting() {
    useAuth()
    const [users] = useFetchUsers();
    const navigate = useNavigate();
    const uid = useAppSelector((quirxtalk) => quirxtalk.auth.userInfo?.uid);
    const [meetingName, setMeetingName] = useState("");
    const [startDate, setStartDate]=useState(moment());
    const [selectedUsers, setSelectedUsers] = useState([])
    const [showErrors, setShowErrors] = useState({
      meetingName: {
        show: false,
        message: [],
      },
      meetingUser: {
        show: false,
        message: [],
      },
    });
  
    const onUserChange=(selectedOptions)=>{
        setSelectedUsers(selectedOptions)
    };

    const validateForm =()=>{
      let errors =false;
      const clonedshowErrors={...showErrors}
      if(!meetingName.length){
        clonedshowErrors.meetingName.show=true;
        clonedshowErrors.meetingUser.show=["Please Enter a meeting name"];
        errors=true;
      }else{
        clonedshowErrors.meetingName.show=false;
        clonedshowErrors.meetingName.message=[];
      }
      if (!selectedUsers.length) {
        clonedshowErrors.meetingUser.show = true;
        clonedshowErrors.meetingUser.message = ["Please Select a User"];
        errors = true;
      } else {
        clonedshowErrors.meetingUser.show = false;
        clonedshowErrors.meetingUser.message = [];
      }
      setShowErrors(clonedshowErrors);
      return errors;
    };

    const createMeeting = async()=>{
      if(!validateForm()){
        const meetingId = generateMeetingId();
        await addDoc(meetingRef,{
          createdBy:uid,
          meetingId,
          meetingName,
          meetingType:"1-on-1",
          invitedUsers:[selectedUsers[0].uid],
          meetingDate: startDate.format("L"),
          maxUsers:1,
          status:true,
        });
        navigate("/");
      }
    };


  return (
    <div
    style={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
    }}>
      <Header/>
      <EuiFlexGroup justifyContent='center' alignItems='center'>
        <EuiForm>
            <MeetingNameField
            label="Meeting Name"
            placeholder="Meeting Name"
            value={meetingName}
            setMeetingName={setMeetingName}
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
            />
            <MeetingUsersField label="Invite User" options={users} onChange={onUserChange} selectedOptions={selectedUsers} singleSelection={{asPlainText: true}} isClearable={false} palceholder={"Select a User"}  isInvalid={showErrors.meetingUser.show}
            error={showErrors.meetingUser.message}/>
            <MeetingDateField selected={startDate} setStartDate={setStartDate} />
            <EuiSpacer/>
            <CreateMeetingButtons createMeeting={createMeeting}/>
        </EuiForm>
      </EuiFlexGroup>
    </div>
  )
}

export default OneonOneMeeting
