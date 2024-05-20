export const getCreateMeeetingBreadCrumbs = (navigate) =>[
    { text:"Dashboard",
        href:"#",
        onClick: () => {
            navigate("/");
        },
    },
    {
        text: "Create Meeting",
    },
];

export const getOneonOneMeeetingBreadCrumbs = (navigate) =>[
    { text:"Dashboard",
        href:"#",
        onClick: () => {
            navigate("/");
        },
    },
    {
        text: "Create Meeting",
        href:"#",
        onClick: () => {
            navigate("/create");
        },
    },{
        text: "Create One on One Meeeting",
    }
];

export const getVideoConferenceBreadCrumbs = (navigate) =>[
    { text:"Dashboard",
        href:"#",
        onClick: () => {
            navigate("/");
        },
    },
    {
        text: "Create Meeting",
        href:"#",
        onClick: () => {
            navigate("/create");
        },
    },{
        text: "Create Video Conference",
    }
];


export const getMyMeetingsBreadcrumbs = (navigate) =>[
    { text:"Dashboard",
        href:"#",
        onClick: () => {
            navigate("/");
        },
    },
    {
        text: "My Meetings",
    }
];

export const getMeetingsBreadcrumbs = (navigate) =>[
    { text:"Dashboard",
        href:"#",
        onClick: () => {
            navigate("/");
        },
    },
    {
        text: "Meetings",
    }
];