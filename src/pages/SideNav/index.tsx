import React from "react";
import { useState } from "react";

import { FaPowerOff } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi";
import { IoMenuSharp } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { GiGearHammer } from "react-icons/gi"


import { useHistory } from "react-router-dom";

import styles from "./styles.module.css";

export default function SideNav(props: any) {

    const history = useHistory();

    function togleNav () {
        props.setOpened(!props.opened)
    }

    const urlPath = window.location.pathname


    return (
        <nav className={styles.container}>

            {/* <img  className="menu-logo" src={oneSuite} alt="OneSuite"/> */}


            <div className={styles.topLinks}>

                <div className={styles.hamburguer}>
                    <IoMenuSharp onClick={togleNav} />
                </div>

                <div className={  urlPath === "/" ?  `${styles.sidNavLinks} ${styles.selected}` : `${styles.sidNavLinks}` }>
                    <HiUsers onClick={() => history.push("/")} />
                    {/* <span>Clients</span> */}
                </div>

                {/* <div className="sidNavLinks">
                    <a href="" className="active">People</a>
                    <a href="">Properties</a>
                </div> */}

                <div className={  urlPath.includes("property") ?  `${styles.sidNavLinks} ${styles.selected}` : `${styles.sidNavLinks}` }>
                    <GoHome onClick={() => history.push("property")} />
                    {/* <span>Work</span> */}
                </div>


                <div className={  urlPath.includes("service") ?  `${styles.sidNavLinks} ${styles.selected}` : `${styles.sidNavLinks}` }>
                    <GiGearHammer onClick={() => history.push("service")} />
                    {/* <span>Work</span> */}
                </div>

                {/* <div className="sidNavLinks">
                    <a href="">People</a>
                    <a href="">Properties</a>
                </div> */}

            </div>

            <div className={styles.bottomLinks}>

                <FaPowerOff />

            </div>




        </nav>
    )
}