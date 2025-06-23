import { useState } from 'react'
import { isMobile } from 'mobile-device-detect';
import { redirect } from 'react-router-dom';

import '../styles/menuBar.scss';

export default function MenuBar(signedIn, SignInOut){
    const [open, setOpen] = useState(true)

    function OpenMenu(){
        setOpen(() => !open)
    }

    if (isMobile){
        return(
            <div className={open?"menuContainerOpen":"menuContainer"}>
                <div className="staticMenuBar">
                    <h1>Password Vault</h1>
                    <h2>{open?"close":"open"}</h2>
                </div>
                <div className="mobileMenu" style={{display: open? "flex":"none"}}>
                    <button onClick={() => {
                        SignInOut('out') 
                        redirect('/')
                        }}>{signedIn? "Sign out": "Sign in"}</button>
                    <h2>Create account</h2>
                </div>
            </div>
        )
    }else {
        return(
            <div className="menuContainer">
                <div className="staticMenuBar">
                    <h1>Password Vault</h1>
                    <h2>Sign in</h2>
                </div>
            </div>
        )
    }
}