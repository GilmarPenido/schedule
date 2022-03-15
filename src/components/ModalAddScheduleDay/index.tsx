import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import addSchedule from '../../assets/add_schedule.png';
import { FaPlus, FaRegWindowClose } from 'react-icons/fa';
import ServiceDetailsService from '../../services/service-details';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import ClientService from '../../services/client';
import PropertyService from '../../services/property';
import { RiUserFill, RiVipCrownFill } from 'react-icons/ri';
import ScheduleService from '../../services/Schedule';
import ScheduleModel from '../../Models/Schedule';

interface Iprops {
    fecharModal: any
    tipo: string
    titulo: string
    texto: string
    currentCard: any
}

export default function ModalAddSchedule(props: Iprops) {

    const [serviceDetails, setServiceDetails] = useState<any>([]);

    const [cliets, setClients] = useState<any>([]);

    const [properties, setProperties] = useState<any>([]);

    const [date, setDate] = useState<string>();
    const [team, setTeam] = useState<any>();
    const [time, setTime] = useState<string>();
    
    const [client, setClient] = useState<any>()
    const [service, setService] = useState<any>()
    const [property, setProperty] = useState<any>()


    useEffect(() => {
        if(props?.currentCard?.team) {
            setTeam(props.currentCard.team)
        }

        if(props?.currentCard?.date) {
            setDate(props.currentCard.formatedDate)
        } 

        if(props?.currentCard?.time) {
            setTime(props.currentCard.time)
        } 
        
    }, []);

    useEffect(() => {
        ClientService
            .getAll()
            .then(data => {
                let client =
                    data.consulta.map(c => ({
                        value: c.WC_CLIENTE_COD,
                        label: `${c.SAS_CLI_PRONOME} ${c.SAS_CLI_SOBRENOME}`
                    }))

                setClients(client);

                if(props.currentCard.sche?.WC_CLIENTE_COD) {

                    let cli = client.find( c => c.value === props.currentCard.sche?.WC_CLIENTE_COD)

                    setClient(cli)
                    getProperty(props.currentCard.sche.WC_CLIENTE_COD)
                }
            })
    }, [])

    useEffect(() => {
        ServiceDetailsService
            .getAll()
            .then(services => {
                let serv =
                    services.consulta.map(s => ({
                        value: s.WC_PRODUTO_COD,
                        label: s.WC_PRODUTO_DESC
                    }))

                setServiceDetails(serv);
                    console.log(props.currentCard.sche)

                if(props.currentCard.sche?.WC_PRODUTO_COD) {
                    let service = serv.find( s => s.value === props.currentCard.sche?.WC_PRODUTO_COD)
                    setService(service)
                }
            })
    }, [])

    function handleInputChange(value: { value: string; label: string; }| null) {
        let selectedUserId = value ? value.value : '';
        setClient(value)
        getProperty(selectedUserId)

    }

    function getProperty(selectedUserId: string){
        PropertyService
            .getByClient(selectedUserId)
            .then(property => {

                if(property.totalreg > 0) {

                    let prop =
                        property.consulta.map(p => ({
                            value: p.SAS_PROP_ID,
                            label: p.SAS_PROP_ENDERECO1
                        }))

                    setProperties(prop);


                    if(props.currentCard.sche?.SAS_PROP_ID) {
                        let property = prop.find( p => p.value === props.currentCard.sche?.SAS_PROP_ID)
                        setProperty(property)
                    }
                }

            })
    }

    function save(event: any) {
        event.preventDefault();

        if(date && team && time && service && property && client) {
            let schedule: ScheduleModel  = {
                WC_CLIENTE_COD: client.value,
                SAS_CLI_NOME_COMPLETO: client.label,
                SAS_EQUIPE_ID: team.SAS_EQUIPE_ID,
                SAS_SCHEDULE_DATA: date,
                SAS_SCHEDULE_HRFIM: '',
                SAS_SCHEDULE_HRINICIO: time,
                SAS_SCHEDULE_ID:  props.currentCard?.SAS_SCHEDULE_ID ? props.currentCard?.SAS_SCHEDULE_ID : uuidv4(),
                SAS_SCHEDULE_OBSERVA: '',
                SAS_SCHEDULE_STATUS: 'ATIVO',
                SAS_EQUIPE_INICIAL_ID: team.SAS_EQUIPE_ID,
                WC_PRODUTO_COD: service.value,
                SAS_SINALIZADOR: props.currentCard?.SAS_SINALIAZDOR? props.currentCard?.SAS_SINALIAZDOR : '',
                SAS_PROP_ID: property.value,
                WF_OPORTUNI_ID: ''
            }

            let tipo = props.currentCard?.SAS_SCHEDULE_ID ? 'ALTERAR' : 'INCLUIR';

            ScheduleService.save(schedule, tipo).then(
                retorno => {
                    props.fecharModal();
                }
            )
        }
    }


    function handleService( data: any) {
        setService(data)
    }

    function handleProperty( data: any) {
        setProperty(data)
    }

    return (
        <form onSubmit={save}>
        <div className={styles.containerSchedule}>

            <div className={styles.modalSchedule}>

                <div className={styles.corpoSchedule}>

                    <div className={styles.modalScheduleHeader}>
                        <img src={addSchedule} alt="Add Schedule" />
                        <b> &nbsp;&nbsp;Add Schedule</b>
                    </div>

                </div>

                <div className={styles.modalFechar}>
                    <div onClick={ () => props.fecharModal()}>
                        <FaRegWindowClose></FaRegWindowClose>
                    </div>
                </div>

                <Select
                    required
                    value={service}
                    className={styles.select}
                    placeholder='Service'
                    onChange={handleService}
                    options={serviceDetails}/>


                <Select
                    required
                    value={client}
                    className={styles.select}
                    placeholder='Client'
                    options={cliets} 
                    onChange={handleInputChange}/>

                <Select
                    required
                    className={styles.select}
                    onChange={handleProperty}
                    placeholder='Property'
                    options={properties} />

                    <div className={styles.tableAvailableTimeContainer}>
                        <table className={styles.tableAvailableTime} cellSpacing="0" cellPadding="0">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Team</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{props.currentCard?.date}</td>
                                    <td>{props.currentCard?.time}</td>
                                    <td>{
                                                    props.currentCard?.team.equipePessoas.map((pt: any) => {

                                                        return (

                                                            pt.SAS_EQUIPE_PESSOAS_TIPO === 'Coordenador' ?
                                                                <><RiVipCrownFill color={'#F7D82F'} /> {pt.pessoa.descricao.split(' ')[0]}&nbsp;</> :
                                                                <><RiUserFill color={'#000000'} /> {pt.pessoa.descricao.split(' ')[0]}&nbsp;</>
                                                        )

                                                    })
                                                }</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                <div className={styles.modalAction}>
                    <button className={`${styles.btnAction} btn btn-confirm`}>Add New Schedule &nbsp;<FaPlus /></button>
                </div>


            </div>
        </div>
        </form>
    )

}