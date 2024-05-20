export const ToastType = {
    id: "",
    title: "",
    color: "success" | "primary" | "warning" | "danger" | undefined,
  };
  
  export const BreadCrumbsType = {
    text: "",
    href: "",
    onClick: () => {},
  };
  
  export const MeetingJoinType = "anyone-can-join" | "video-conference" | "1-on-1";
  
  export const MeetingType = {
    docId: "",
    createdBy: "",
    invitedUsers: [],
    maxUsers: 0,
    meetingDate: "",
    meetingId: "",
    meetingName: "",
    meetingType: MeetingJoinType,
    status: false,
  };
  
  export const UserType = {
    email: "",
    name: "",
    uid: "",
    label: "",
  };
  
  export const FieldErrorType = {
    show: false,
    message: [],
  };
  