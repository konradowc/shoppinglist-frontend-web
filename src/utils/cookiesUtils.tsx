import Cookies from 'js-cookie';

/* set both userid and password cookies */
export const setUserCookies = (userid: number, password: string) => {
    Cookies.set('userid', userid.toString(), 
    { 
        expires: 365 * 100, // essentially forever
        path: '/',
        secure: true,
        sameSite: 'Strict'
    });

    Cookies.set('password', password, 
    { 
        expires: 365 * 100, // essentially forever
        path: '/',
        secure: true,
        sameSite: 'Strict'
    });
};

export const getUserCookies = (): {id: number, pswrd: string} | null => {
    const userid = Cookies.get('userid');
    const password = Cookies.get('password'); 

    return (userid == undefined || password == undefined) ? 
                (null) : ({ id: Number(userid), pswrd: password });
};