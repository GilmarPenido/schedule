import React, { ChangeEvent, ChangeEventHandler, FormEventHandler, useState } from "react";
import { AiFillMinusCircle, AiOutlinePlus } from "react-icons/ai";
import { BsStar, BsStarFill } from "react-icons/bs";
import { FaHome, FaRegUserCircle, FaRegWindowClose } from "react-icons/fa";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import { RiMessage2Line, RiServiceLine } from "react-icons/ri";
import ServiceDetailsModel from "../../Models/service-details";
import ServiceDetailsService from "../../services/service-details";
import Header from "../Header";
import SideNav from "../SideNav";
import styles from "./styles.module.css";

export default function Services() {

    const [opened, setOpened] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');

    function handleName(event: ChangeEvent<HTMLInputElement>) {
        let { name, value } = event.target
        setName(value)
    }

    function handleDescription(event: ChangeEvent<HTMLInputElement>) {
        let { name, value } = event.target
        setDescription(value)
    }

    function handleDuration(event: ChangeEvent<HTMLInputElement>) {
        let { name, value } = event.target
        setDuration(value)
    }

    function saveAndClose() {

        const details: ServiceDetailsModel = {
            WC_PRODUTO_DESC: name,
            WC_CLI_PRODUTOS_DET_TEXT: description,
            SAS_SERVICE_DURACAO: duration,
        }

        ServiceDetailsService.save(details)
            .then(
                console.log
            )
            .catch(
                err => alert(err.message)
            )

    }


    function handleSubmit(event: ChangeEvent<HTMLFormElement>) {

        event.preventDefault();
        event.target.reset();
        saveAndClose();
    }

    return (
        <main className={opened ? "container opened" : "container close"} >

            <SideNav setOpened={setOpened} opened={opened} />
            <Header />

            <form onSubmit={handleSubmit}>
                <main className={styles.panel}>


                    <div className={styles.rowAction}>

                        <div>
                            <FaRegWindowClose />
                            <span><b>New Service</b></span>
                        </div>

                        <div>
                            <button className="btn btn-close" type="button">Close</button>
                            <button className="btn btn-save">Save</button>
                            <button className="btn btn-confirm">Confirm</button>
                        </div>

                    </div>




                    <div className={styles.cardContainer}>
                        <section className={styles.card}>

                            <div className={styles.cardTitle}>
                                <RiServiceLine /> <span>  Service Details</span>
                            </div>

                            <input className={styles.inputControl} type="text" name="name" placeholder="Service Name" required={true} onChange={handleName} />
                            <input className={styles.inputControl} type="text" name="description" placeholder="Service Description" required={true} onChange={handleDescription} />
                            <input className={styles.inputControl} type="number" name="duration" placeholder="Duration in minutes" required={true} onChange={handleDuration} />


                        </section>
                    </div>

                </main>
            </form>
        </main>
    );
}