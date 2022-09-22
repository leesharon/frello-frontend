import React, { useState } from "react"
import { SideMenuBackgroundOptions } from "./side-menu-background-options"
import { SideMenuColors } from "./side-menu-colors"
import { SideMenuPhotos } from "./side-menu-photos"
import { SideMenuMainDisplay } from "./side-menu-main-display"
import { IoIosArrowBack } from "react-icons/io"

export const BoardSideMenu = ({ isOpen, onCloseSideMenu, changeBgColor }) => {
    const [title, setTitle] = useState('Menu')

    const onChangeTitle = (title) => {
        setTitle(title)
    }

    const getCmp = () => {
        switch (title) {
            case ('Menu'):
                return <SideMenuMainDisplay onChangeTitle={onChangeTitle} />
            case ('Change background'):
                return <SideMenuBackgroundOptions onChangeTitle={onChangeTitle} />
            case ('Colors'):
                return <SideMenuColors changeBgColor={changeBgColor} />
            case ('Photos by'):
                return <SideMenuPhotos changeBgColor={changeBgColor} />

        }
    }

    const onGoBack = () => {
        switch (title) {
            case ('Change background'):
                setTitle('Menu')
                break
            case ('Colors'):
                setTitle('Change background')
                break
        }
    }

    const cmp = getCmp()

    return <section className={`board-side-menu ${isOpen}`}>
        <section className="header">
            {title !== 'Menu' && <IoIosArrowBack className="go-back" onClick={onGoBack} />}
            <h3>{title === 'Photos by' ? 
            <React.Fragment>
                {title} <a href="https://unsplash.com/">Unsplash</a>
                </React.Fragment>
                :
                title}
                </h3>
            <section className="svg-holder" onClick={onCloseSideMenu}>
                <svg stroke="currentColor" fill="currentColor" strokeidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" strokeWidth="2" d="M3,3 L21,21 M3,21 L21,3"></path></svg>
            </section>
        </section>
        <section className="divider"></section>
        {cmp}
    </section>
}
