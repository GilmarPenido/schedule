import React from "react";

import { CgMenuGridR } from 'react-icons/cg';
import { BiError } from 'react-icons/bi';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { FaRegUserCircle } from  "react-icons/fa";
import styles from "./styles.module.css";

import logo from "../../assets/onSuite-logo.png";

export default function Header() {

    return(
        <header className={styles.container}>

            <div className={styles.rowTop}>
                <div className={styles.topIconsLeft}>
                    <CgMenuGridR />
                    <img src={logo} alt="OneSuite"/>
                    <span>onesuite</span>
                </div>


                <div className={styles.topIconsRight}>
                    <div className={styles.groupIcon}>
                        <BiError />
                        <span className={styles.alertNumer}>5</span>
                    </div>

                    <HiOutlineChatAlt2 style={{marginRight: "12px"}} />

                    <div className={styles.groupIcon}>
                        <FaRegUserCircle />
                        <span>Edvaldo Ferreira</span>
                    </div>
                </div>

            </div>
                

            </header>
    );

}