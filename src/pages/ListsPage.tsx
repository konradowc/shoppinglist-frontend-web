import { useEffect, useState } from "react";
import { ListView } from "../components/ListView";

import Cookies from 'js-cookie';


export const ListsPage = () => {

    const [userId, setUserId] = useState(1);

    useEffect(() => {

    }, []);

    const setUserIdCookie = () => {
        Cookies.set('userid', "1", 
            { 
                expires: 7,  // 7 days
                path: '/',
                secure: true,
                sameSite: 'Strict'
            });
    }

    return (
        <div style={{ margin:"auto" }}>
            <ListView userId={userId}/>
        </div>
    );
};
