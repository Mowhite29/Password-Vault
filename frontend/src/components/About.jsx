import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import '../assets/styles/About.scss'
import githubDark50w from '../assets/images/dark/Github-dark-50w.webp'
import githubDark100w from '../assets/images/dark/Github-dark-100w.webp'
import githubDark140w from '../assets/images/dark/Github-dark-140w.webp'
import githubLight50w from '../assets/images/light/Github-light-50w.webp'
import githubLight100w from '../assets/images/light/Github-light-100w.webp'
import githubLight140w from '../assets/images/light/Github-light-140w.webp'

export default function About() {
    const theme = useSelector((state) => state.appearance.theme)
    const [about, setAbout] = useState(true)
    const [legal, setLegal] = useState(false)
    const [credits, setCredits] = useState(false)

    function inputHandler(input) {
        if (input === 'about') {
            setAbout(true)
            setLegal(false)
            setCredits(false)
        } else if (input === 'legal') {
            setAbout(false)
            setLegal(true)
            setCredits(false)
        } else if (input === 'credits') {
            setAbout(false)
            setLegal(false)
            setCredits(true)
        }
    }

    return (
        <div className="aboutContainer">
            <div className="buttons">
                <button onClick={() => inputHandler('about')}>About</button>
                <button onClick={() => inputHandler('legal')}>Legal</button>
                <button onClick={() => inputHandler('credits')}>Credits</button>
            </div>
            {about && (
                <div className="about">
                    <h2>About</h2>
                    <p>
                        This application is a personal portfolio project created
                        to demonstrate front-end and back-end development
                        skills. It is not a production-ready system and is not
                        intended for real-world use.
                    </p>

                    <a
                        href="https://github.com/Mowhite29/Password-Vault"
                        target="_blank"
                    >
                        <img
                                                        srcSet={theme === 'dark' ? `${githubDark50w} 50w, ${githubDark100w} 100w, ${githubDark140w} 140w` : `${githubLight50w} 50w, ${githubLight100w} 100w, ${githubLight140w} 140w`}
                                                        src={
                                                            theme === 'dark' ? githubDark140w : githubLight140w
                                                        }
                                                    />
                    </a>
                </div>
            )}
            {legal && (
                <div className="legal">
                    <h2>Legal Disclaimer</h2>
                    <p>
                        This application is a non-commercial portfolio project
                        created by Moses White for the purposes of demonstrating
                        application development skills.
                    </p>
                    <p>
                        The application is provided "as is", with no warranties
                        of any kind, express or implied, including but not
                        limited to any warranties of merchantability, fitness
                        for a particular purpose, or non-infringement
                    </p>
                    <p>
                        **Do not store real passwords, sensitive data, or
                        personal information within this application. It is not
                        a production hardened system***
                    </p>
                    <p>
                        The authior accepts no liability for any loss, damage,
                        or misuse resulting from the use of this project. By
                        accessing or interacting with this demo, you agree to
                        these terms.
                    </p>
                </div>
            )}
            {credits && (
                <div className="credits">
                    <a
                        href="https://www.flaticon.com/free-animated-icons"
                        title="animated icons"
                    >
                        Animated icons created by Freepik - Flaticon
                    </a>
                    <br></br>
                    <a
                        href="https://www.flaticon.com/free-icons/dropdown"
                        title="dropdown icons"
                    >
                        Dropdown icons created by HideMaru - Flaticon
                    </a>
                    <br></br>
                    <a
                        href="https://www.flaticon.com/authors/graphicmall"
                        title="door icons"
                    >
                        Door icons created by graphicmall - Flaticon
                    </a>
                    <br></br>
                    <a
                        href="https://www.flaticon.com/free-icons/recycle-bin"
                        title="recycle bin icons"
                    >
                        Recycle bin icons created by lakonicon - Flaticon
                    </a>
                    <br></br>
                    <a
                        href="https://www.flaticon.com/free-icons/edit"
                        title="edit icons"
                    >
                        Edit icons created by Kiranshastry - Flaticon
                    </a>
                    <br></br>
                    <a
                        href="https://www.flaticon.com/free-icons/close"
                        title="close icons"
                    >
                        Close icons created by Pixel perfect - Flaticon
                    </a>
                    <br></br>
                    <a
                        href="https://www.flaticon.com/free-icons/close"
                        title="close icons"
                    >
                        Close icons created by joalfa - Flaticon
                    </a>
                    <a
                        href="https://www.flaticon.com/free-icons/user"
                        title="user icons"
                    >
                        User icons created by Freepik - Flaticon
                    </a>
                    <a
                        href="https://www.flaticon.com/free-icons/dark-mode"
                        title="dark mode icons"
                    >
                        Dark mode icons created by Anggara - Flaticon
                    </a>
                    <a
                        href="https://www.flaticon.com/authors/aswell-studio"
                        title="Aswell Studio"
                    >
                        Icons made by Aswell Studio - Flaticon
                    </a>
                    <a
                        href="https://www.flaticon.com/authors/smashicons"
                        title="Smashicons"
                    >
                        Icons made by Smashicons - Flaticon
                    </a>
                </div>
            )}
        </div>
    )
}
