import React, { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from "react";

import Switch from "react-switch";
import { BsStar, BsStarFill } from 'react-icons/bs';
import { FaRegUserCircle, FaRegWindowClose, FaHome } from 'react-icons/fa';
import { RiMessage2Line } from 'react-icons/ri';
import { AiFillMinusCircle, AiOutlinePlus } from "react-icons/ai";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import { v4 as uuidv4 } from 'uuid';

import styles from "./styles.module.css";
import ClientModel from "../../Models/client";
import ClientService from "../../services/client";
import TelephoneModel from "../../Models/telephone";
import EmailModel from "../../Models/email";
import PropertyModel from "../../Models/property";
import Alerta from "../../components/Alerta";
import TelephoneService from "../../services/telephone";
import EmailService from "../../services/Email";
import PropertyService from "../../services/property";

import { useHistory } from "react-router-dom";

export default function Client() {

    const history = useHistory();
    const [ modalAlertaProps, setModalAlertaProps] = useState({
        tipo: "",
        titulo: "",
        texto: "",
        visivel: false,
        fecharModal: () => {}
      })


    const [firstName, setFirstName] = useState('');

    const [lastName, setLastName] = useState('');

    const [pronoun, setPronoun] = useState('');

    const [company, setCompany] = useState('');

    const [firstCompany, setFirstCompany] = useState(false);

    const [phones, setPhones] = useState<any>([{
        phone: "",
        primary: true,
        type: ""
    }]);

    const [opened, setOpened] = useState(false);

    const [emails, setEmails] = useState<any>([{
        email: "",
        type: ""
    }]);

    const [automatedNotificationsOpen, seAutomatedNotificationsOpen] = useState(false)

    const [additionalDetailsOpen, setAdditionalDetailsOpen] = useState(false);


    const [notifications, setNotifications] = useState([
        {
            title: "Quote follow-up",
            text: "Follow up on an outstanding quote.",
            state: false
        },
        {
            title: "Appointment reminders",
            text: "Remind your client of an upcoming assessment or visit.",
            state: false
        },
        {
            title: "Job follow-up",
            text: "Follow up when you close a job. ",
            state: false
        },
        {
            title: "Invoice follow-up",
            text: "Follow up on an overdue invoice.",
            state: false
        },
    ]);

    const [street1, setStreet1] = useState('');
    const [street2, setStreet2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcod, setzipcod] = useState('');
    const [country, setCountry] = useState('');


    useEffect(() => {

        

    }, []);

    function addPhone() {
        setPhones([...phones, {
            phone: "",
            primary: false,
            type: ""
        }])
    }

    function addEmail() {
        setEmails([...emails, {
            email: "",
            type: ""
        }])
    }

    function addProperty() {

    }

    function selectPrimaryPhone(key: number) {
        let phonesEdit = phones.map((p: any) => {
            p.primary = false;
            return p;
        })
        phonesEdit[key].primary = true;
        setPhones([...phonesEdit])
    }

    function removePhone(key: number) {
        setPhones(phones.filter((phone: any, k: number) => k !== key));
    }

    function removeEmail(key: number) {
        setEmails(emails.filter((email: any, k: number) => k !== key));
    }

    function updateNotify(key: number, checked: boolean) {
        setNotifications(
            notifications.map(
                (ntf, k) => {
                    if (k === key) {
                        return {
                            title: ntf.title,
                            text: ntf.text,
                            state: checked
                        }
                    }

                    return ntf
                }
            )
        )
    }

    function updatePhoneType(event: ChangeEvent<HTMLSelectElement>, key: number) {

        let telephones = phones.map(
            (p: any, k: number) => {

                if (k == key) {

                    p.type = event.target.value
                    return p

                } else {
                    return p
                }

            }
        )

        setPhones(telephones)

    }

    function updatePhoneNumber(event: ChangeEvent<HTMLInputElement>, key: number) {

        let telephones = phones.map(
            (p: any, k: number) => {

                if (k == key) {

                    p.phone = event.target.value
                    return p

                } else {
                    return p
                }

            }
        )
        setPhones(telephones)

    }

    function updatePronoun(event: ChangeEvent<HTMLSelectElement>) {
        setPronoun(event.target.value)
    }

    async function save(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        let id = uuidv4();
        let client: ClientModel = {
            WC_CLIENTE_COD: `${id}`,
            /*SAS_CLI_NOME_COMPLETO: firstCompany ? company : `${firstName} ${lastName}`,*/
            SAS_CLI_PRONOME: pronoun,
            /*SAS_CLI_EMPRESA: company,
            SAS_CLI_NOTIFICACAO_COTAC: notifications[0].state ? 'SIM' : 'NAO',
            SAS_CLI_NOTIFICACAO_COMPR: notifications[1].state ? 'SIM' : 'NAO',
            SAS_CLI_NOTIFICACAO_TRABA: notifications[2].state ? 'SIM' : 'NAO',
            SAS_CLI_INDICACAO_FATURA: notifications[3].state ? 'SIM' : 'NAO',*/
            SAS_CLI_PRIMEIRO_NOME: firstName,
            SAS_CLI_SOBRENOME: lastName

        }


        await ClientService.update(client)
        .then( data => {
            setModalAlertaProps({
                texto: 'Dados de clientes salvos com sucesso!',
                tipo: 'sucesso',
                titulo: 'Sucesso!',
                visivel: true,
                fecharModal: () => { setModalAlertaProps( { ...modalAlertaProps, visivel: false }) }
            })
        })
        .catch( err => {
            setModalAlertaProps({
                texto: 'Dados de clientes não fomra salvos!',
                tipo: 'erro',
                titulo: 'Erro!',
                visivel: true,
                fecharModal: () => { setModalAlertaProps( { ...modalAlertaProps, visivel: false }) }
            })
        })


        let telephones: TelephoneModel[] = [];

        phones.map((tel: any, key: number) => {

            telephones.push({
                SAS_CLI_ID: id,
                SAS_TEL_NUMERO: tel.phone,
                SAS_TEL_SEQUENCIA: key,
                SAS_TEL_TIPO: tel.type
            })
        })

        console.log(telephones)



        Promise.all(
            telephones.map( tel => {
    
                return TelephoneService.save(id, tel);
            })
        ).then(
            console.log
        )


        let regEmails: EmailModel[] = []

        emails.map((mail: any, key: number) => {
            regEmails.push({
                SAS_CLI_ID: id,
                SAS_EMAIL_ENDERECO: mail.email,
                SAS_EMAIL_SEQUENCIA: key,
                SAS_EMAIL_TIPO: mail.type
            })
        })
        
        Promise.all(
            regEmails.map( mail => {
    
                return EmailService.save(id, mail);
            })
        ).then(
            console.log
        )

        let property: PropertyModel = {
            SAS_CLI_ID: id,
            SAS_PROP_CIDADE: city,
            SAS_PROP_DETALHES_ADICION: '',
            SAS_PROP_ENDERECO1: street1,
            SAS_PROP_ENDERECO2: street2,
            SAS_PROP_ESTADO: state,
            SAS_PROP_ID: uuidv4(),
            SAS_PROP_PAIS: country,
            SAS_PROP_ZIPCODE: zipcod
        }


        PropertyService.save(id, property);



    }

    return (
        <form onSubmit={save}>
            <main className={opened ? "container opened" : "container close"} >

                {/* <SideNav setOpened={setOpened} opened={opened} />
            <Header /> */}


                <main className={styles.panel}>

                    <div className={styles.rowAction}>

                        <div>
                            <FaRegWindowClose />
                            <span><b>New Client</b></span>
                        </div>

                        <div>
                            <button type="button"  className="btn btn-close">Close</button>
                            <button className="btn btn-save">Save</button>
                            <button className="btn btn-confirm">Confirm</button>
                        </div>

                    </div>




                    <div className={styles.cardContainer}>
                        <section className={styles.card}>

                            <div className={styles.cardTitle}>
                                <FaRegUserCircle /> <span>  Client Details</span>
                            </div>
                            <div className={styles.inputGroup}>
                                <select value={pronoun} onChange={updatePronoun}>
                                    <option value="">No title</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Miss.">Miss.</option>
                                    <option value="Dr.">Dr.</option>
                                </select>
                                <input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={(event: ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)} required/>
                            </div>
                            <input className={styles.inputControl} type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={(event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)} required/>
                            <input className={styles.inputControl} type="text" name="companyName" placeholder="Company Name" value={company} onChange={(event: ChangeEvent<HTMLInputElement>) => setCompany(event.target.value)} />
                            <div className={styles.inputGroupRadio}>
                                <input type="checkbox" checked={firstCompany} onChange={(event: ChangeEvent<HTMLInputElement>) => setFirstCompany(event.target.checked)} /> <span>Use company name as the primary name</span>
                            </div>
                            {
                                phones.map((p: any, k: any) => (

                                    <div className={styles.inputGroupPhone} key={k}>
                                        {
                                            p?.primary ? <BsStarFill className={styles.starIconSelected} onClick={() => selectPrimaryPhone(k)} />
                                                : <BsStar className={styles.starIcon} onClick={() => selectPrimaryPhone(k)} />
                                        }
                                        <div className={styles.inputGroupContainer}>
                                            <div className={styles.inputGroup} >
                                                <select name="clientDetailPhoneNumber" value={p.type} onChange={(event) => updatePhoneType(event, k)}>
                                                    <option value="Main">Main</option>
                                                    <option value="Work">Work</option>
                                                    <option value="Mobile">Mobile</option>
                                                    <option value="Home">Home</option>
                                                    <option value="Fax">Fax</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={event => updatePhoneNumber(event, k)}/>
                                            </div>

                                        </div>
                                        <div className={styles.actionsPhone}>
                                            <RiMessage2Line />
                                            <AiFillMinusCircle className={styles.trashIcon} onClick={() => removePhone(k)} />
                                        </div>
                                    </div>

                                ))
                            }
                            <button type="button" className={styles.addPhoneGroup} onClick={addPhone}> Add New Phone <AiOutlinePlus className={styles.addPhone} /></button>

                            {
                                emails.map((email: any, k: number) => (
                                    <div className={styles.inputGroupEmail}>
                                        <div className={styles.inputGroup}>
                                            <select>
                                                <option value="Main">Main</option>
                                                <option value="Work">Work</option>
                                                <option value="Personal">Personal</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <input type="email" placeholder="Email address" />
                                        </div>
                                        <div className={styles.actionsEmail}>
                                            <AiFillMinusCircle className={styles.trashIcon} onClick={() => removeEmail(k)} />
                                        </div>
                                    </div>
                                ))
                            }
                            <button className={styles.addPhoneGroup} onClick={addEmail}> Add New Email <AiOutlinePlus className={styles.addPhone} /></button>


                            {/* Notification Config */}

                            <div className={styles.notificationsContainer}>

                                <div style={{ width: "90%" }}>
                                    <div className={styles.notificationsAccordion} >
                                        <div>
                                            <span>Automated notifications</span>
                                        </div>

                                        <div>
                                            {
                                                automatedNotificationsOpen ?
                                                    <HiOutlineChevronUp onClick={() => seAutomatedNotificationsOpen(!automatedNotificationsOpen)} />
                                                    :
                                                    < HiOutlineChevronDown onClick={() => seAutomatedNotificationsOpen(!automatedNotificationsOpen)} />
                                            }
                                        </div>
                                    </div>


                                    {
                                        automatedNotificationsOpen &&
                                        <div className={styles.listOfNotifications}>

                                            {
                                                notifications.map((ntf: any, key: number) => (
                                                    <div key={`${key}`} className={styles.rowNotification}>
                                                        <div className={styles.textContainer}>
                                                            <span><b>{ntf.title}</b></span>
                                                            <span>{ntf.text}</span>
                                                        </div>
                                                        <div className="selectedAction">
                                                            <Switch checked={ntf.state} onChange={(checked: boolean) => updateNotify(key, checked)} />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                </div>

                            </div>



                            {/* Additional details */}


                            <div className={styles.additionalDetailContainer}>
                                <div style={{ width: "90%" }}>
                                    <div className={styles.additionalDetailAccordion}>
                                        <div>
                                            <span>Additional client details</span>
                                        </div>

                                        <div>
                                            {
                                                additionalDetailsOpen ?
                                                    <HiOutlineChevronUp onClick={() => setAdditionalDetailsOpen(!additionalDetailsOpen)} />
                                                    :
                                                    < HiOutlineChevronDown onClick={() => setAdditionalDetailsOpen(!additionalDetailsOpen)} />
                                            }
                                        </div>
                                    </div>


                                    {
                                        additionalDetailsOpen &&

                                        <div className={styles.additionalClientDetailsGroup}>
                                            <input type="text" className={styles.inputControl} placeholder="Referrend By" />

                                        </div>
                                    }

                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </main>
            
            {
                modalAlertaProps.visivel &&
                <Alerta
                tipo={modalAlertaProps.tipo}
                titulo={modalAlertaProps.titulo}
                texto={modalAlertaProps.texto}
                fecharModal={modalAlertaProps.fecharModal} />
            }
        </form>
    );
}