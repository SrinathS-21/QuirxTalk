import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useDispatch } from 'react-redux'
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiHeader, EuiText, EuiTextColor } from '@elastic/eui'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '../utils/FirebaseConfig'
import { changeTheme } from '../app/slices/AuthSlice'
import { getCreateMeeetingBreadCrumbs, getMeetingsBreadcrumbs, getMyMeetingsBreadcrumbs, getOneonOneMeeetingBreadCrumbs, getVideoConferenceBreadCrumbs } from '../utils/breadCrumbs'

function Header() {
    const navigate = useNavigate()
    const location =useLocation()
    const username = useAppSelector((quirxtalk)=>quirxtalk.auth.userInfo?.name);
    const isDarkTheme = useAppSelector((quirxtalk)=>quirxtalk.auth.isDarkTheme);
    const [breadcrumbs,setBreadcrumbs] = useState([{ text:"Dashboard",}]);
    const [isResponsive, setIsResponsive] = useState(false);
    const dispatch = useDispatch();
    const logout =() => {
        signOut(firebaseAuth);
    };

    useEffect(()=>{
        const {pathname}=location;
        if (pathname === "/create")
            setBreadcrumbs(getCreateMeeetingBreadCrumbs(navigate));
          else if (pathname === "/create1on1") setBreadcrumbs(getOneonOneMeeetingBreadCrumbs(navigate));
          else if (pathname === "/videoconference") setBreadcrumbs(getVideoConferenceBreadCrumbs(navigate));
          else if (pathname === "/mymeetings") setBreadcrumbs(getMyMeetingsBreadcrumbs(navigate));
          else if (pathname === "/meetings") setBreadcrumbs(getMeetingsBreadcrumbs(navigate));
    },[location, navigate]);

    const invertTheme=()=>{
        const theme = localStorage.getItem("quirxtalk-theme")
        localStorage.setItem("quirxtalk-theme",theme === "light"?"dark":"light")
        dispatch(changeTheme({isDarkTheme:!isDarkTheme}))
    }
    const section=[
        {
        items:[
            <Link to="/">
                <EuiText>
                    <h2 style={{padding:"01vw"}}>
                        <EuiTextColor color="white">QuirxTalk</EuiTextColor>
                    </h2>
                </EuiText>
            </Link>
            ]
        },
        {
            items:[
                <>
                {
                username ? (
                    <EuiText>
                        <h3>
                            <EuiTextColor color='gray'>Hello, </EuiTextColor>
                            <EuiTextColor color='white'>{username}</EuiTextColor>
                        </h3>
                    </EuiText>
               ):null
                }
                </>,
                ],
        },
        {
            items:[
                <EuiFlexGroup justifyContent='center' alignItems='center' direction='row' styel={{gap:"2w"}}>   

            <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            {isDarkTheme ? (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="sun"
                display="fill"
                size="s"
                color="warning"
                aria-label="theme-button-light"
              />
            ) : (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="moon"
                display="fill"
                size="s"
                color="ghost"
                aria-label="theme-button-dark"
              />
            )}
          </EuiFlexItem>
          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            <EuiButtonIcon
              onClick={logout}
              iconType="lock"
              display="fill"
              size="s"
              aria-label="logout-button"
            />
          </EuiFlexItem>

                </EuiFlexGroup>
            ]
        }
    ];
    const responsivesection = [{
        items:[
            <Link to="/">
                <EuiText>
                    <h2 style={{padding:"01vw"}}>
                        <EuiTextColor color="White">QuirxTalk</EuiTextColor>
                    </h2>
                </EuiText>
            </Link>
            ]
        },
        {
            items:[
                <EuiFlexGroup justifyContent='center' alignItems='center' direction='row' styel={{gap:"2w"}}>   

            <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            {isDarkTheme ? (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="sun"
                display="fill"
                size="s"
                color="warning"
                aria-label="theme-button-light"
              />
            ) : (
              <EuiButtonIcon
                onClick={invertTheme}
                iconType="moon"
                display="fill"
                size="s"
                color="ghost"
                aria-label="theme-button-dark"
              />
            )}
          </EuiFlexItem>
          <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
            <EuiButtonIcon
              onClick={logout}
              iconType="lock"
              display="fill"
              size="s"
              aria-label="logout-button"
            />
          </EuiFlexItem>

                </EuiFlexGroup>
            ]
        }
    ];

    useEffect(()=>{
        if(window.innerWidth<480) setIsResponsive(true);
    },[])

  return (
    <>
    <EuiHeader style={{ minHeight:"8vh"}} theme="dark" sections={isResponsive? responsivesection : section}/>
    <EuiHeader style={{minHeight:"8vh"}} sections={[{breadcrumbs: breadcrumbs}]}/>
    </>
  )
}

export default Header
