import React, { useState } from "react";

import { FaRegWindowClose, FaHome } from 'react-icons/fa';
import { AiOutlinePlus } from "react-icons/ai";

import SideNav from "../SideNav";
import Header from "../Header";

import styles from "./styles.module.css";

export default function Property () {

    const [opened, setOpened] = useState(false);

    const [taxRate, setTaxRate] = useState(
        {
            value: 3,
            label: "tax (3.0%) (Default)",
            key: 1
        }
    );


    function addProperty() {

    }


    return (
        <main className={opened ? "container opened" : "container close"} >

            <SideNav setOpened={setOpened} opened={opened} />
            <Header />

            <main className={styles.panel}>

                <div className={styles.rowAction}>

                    <div>
                        <FaRegWindowClose />
                        <span><b>New Property</b></span>
                    </div>

                    <div>
                        <button className="btn btn-close">Close</button>
                        <button className="btn btn-save">Save</button>
                        <button className="btn btn-confirm">Confirm</button>
                    </div>

                </div>




                <div className={styles.cardContainer}>
                    <section className={styles.card}>

                        <div className={styles.cardTitle}>
                            <FaHome /> <span>  Property Details</span>
                        </div>
                        <input className={styles.inputControl} type="text" name="street1" placeholder="Street 1" />
                        <input className={styles.inputControl} type="text" name="street2" placeholder="Street 2" />

                        <div className={styles.inputGroupProperties}>
                            <input className={styles.inputControl} type="text" name="city" placeholder="City" />
                            <input className={styles.inputControl} type="text" name="state" placeholder="State" />
                        </div>

                        <div className={styles.inputGroupProperties}>
                            <input className={styles.inputControl} type="text" name="zipcode" placeholder="Zip code" />
                            <input className={styles.inputControl} type="text" name="country" placeholder="Country" />
                        </div>

                        <div className={styles.taxRateContainer}>
                            <p> Taxes <span>{taxRate?.label}</span></p>
                        </div>

                        <button className={styles.addPhoneGroup} onClick={addProperty}> Add New Property <AiOutlinePlus className={styles.addProperty} /></button>

                    </section>
                </div>
            </main>
        </main>
    );
}