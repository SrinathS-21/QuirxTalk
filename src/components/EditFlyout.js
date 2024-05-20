import React, { useEffect, useState } from "react";
import { EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiForm, EuiFormRow, EuiSpacer, EuiSwitch, EuiTitle } from "@elastic/eui";
import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import useFetchUsers from "../hooks/useFetchUsers";
import CreateMeetingButtons from "./FormComponents/CreateMeetingButtons";
import MeetingNameField from "./FormComponents/MeetingNameField";
import { firebaseDB } from "../utils/FirebaseConfig";
import MeetingDateField from "./MeetingDateField";
import MeetingMaxUserField from "./FormComponents/MeetingMaxUserField";
import MeetingUserField from "./FormComponents/MeetingUsersField";

export default function EditFlyout({ closeFlyout, meeting }) {
    const [users] = useFetchUsers();
    const [meetingName, setMeetingName] = useState(meeting.meetingName);
    const [meetingType] = useState(meeting.meetingType);
    const [selectedUser, setSelectedUser] = useState([]);
    const [startDate, setStartDate] = useState(moment(meeting.meetingDate));
    const [size, setSize] = useState(1);
    const [status, setStatus] = useState(false);
    const [showErrors] = useState({
        meetingName: {
          show: false,
          message: [],
        },
        meetingUser: {
          show: false,
          message: [],
        },
      });

    useEffect(() => {
        if (users) {
            const foundUsers = [];
            meeting.invitedUsers.forEach((user) => {
                const findUser = users.find((tempUser) => tempUser.uid === user);
                if (findUser) foundUsers.push(findUser);
            });
            setSelectedUser(foundUsers);
        }
    }, [ meeting, users]);


    
    const onUserChange=(selectedOptions)=>{
        setSelectedUser(selectedOptions)
    };

    const editMeeting = async () => {
        const editedMeeting = {
           ...meeting,
            meetingName,
            meetingType,
            invitedUsers: selectedUser.map((user) => user.uid),
            maxUsers: size,
            meetingDate: startDate.format("L"),
            status:!status,
        };
        delete editedMeeting.docId;
        const docRef = doc(firebaseDB, "meetings", meeting.docId);
        await updateDoc(docRef, editedMeeting);
        closeFlyout(true);
    };

    return (
        <EuiFlyout ownFocus onClose={() => closeFlyout()}>
            <EuiFlyoutHeader hasBorder>
                <EuiTitle size="m">
                    <h2>{meeting.meetingName}</h2>
                </EuiTitle>
            </EuiFlyoutHeader>
            <EuiFlyoutBody>
                <EuiForm>
                    <MeetingNameField
                        label="Meeting name"
                        isInvalid={showErrors.meetingName.show}
                        error={showErrors.meetingName.message}
                        placeholder="Meeting name"
                        value={meetingName}
                        setMeetingName={setMeetingName}
                    />
                    {meetingType === "anyone-can-join"? (
                        <MeetingMaxUserField value={size} setSize={setSize} />
                    ) : (
                        <MeetingUserField
                            label="Invite Users"
                            isInvalid={showErrors.meetingUser.show}
                            error={showErrors.meetingUser.message}
                            options={users}
                            onChange={onUserChange}
                            selectedOptions={selectedUser}
                            singleSelection={meetingType === "1-on-1"? { asPlainText: true } : false}
                            isClearable={false}
                            placeholder="Select a Users"
                        />
                    )}
                    <MeetingDateField selected={startDate} setStartDate={setStartDate} />
                    <EuiFormRow display="columnCompressedSwitch" label="Cancel Meeting">
                        <EuiSwitch
                            showLabel={false}
                            label="Cancel Meeting"
                            checked={status}
                            onChange={(e) => setStatus(e.target.checked)}
                        />
                    </EuiFormRow>
                    <EuiSpacer />
                    <CreateMeetingButtons
                        createMeeting={editMeeting}
                        isEdit
                        closeFlyout={closeFlyout}
                    />
                </EuiForm>
            </EuiFlyoutBody>
        </EuiFlyout>
    );
}
