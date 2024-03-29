import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import addSchedule from '../../assets/add_schedule.png';
import { FaPlus, FaRegWindowClose } from 'react-icons/fa';
import { FcCalendar } from 'react-icons/fc';
import ServiceDetailsService from '../../services/service-details';
import { v4 as uuidv4, v4 } from 'uuid';
import Select from 'react-select';
import ClientService from '../../services/client';
import PropertyService from '../../services/property';
import ScheduleService from '../../services/Schedule';
import ScheduleModel from '../../Models/Schedule';
import TeamService from '../../services/team';
import PeopleTeamService from '../../services/people-team';
import PeopleService from '../../services/people';
import QueryExec from '../../services/query-exec';
import ScheduleProcedureModel from '../../Models/schedule-procedure';
import Alerta from '../Alerta';
import Switch from 'react-switch';
import { HiCheckCircle, HiOutlineChevronDown, HiOutlineChevronUp, HiXCircle } from 'react-icons/hi';
import { ImSpinner9 } from 'react-icons/im';
import { BiPlusCircle } from 'react-icons/bi';
import OportuniService from '../../services/oportuni';
import AsyncSelect from 'react-select/async';
import { ChangeEvent } from 'react';
import ScheduleProdutoService from '../../services/schedule-produtos'
import ScheduleProduto from '../../Models/schedule-produto';

interface Iprops {
    fecharModal: any
    tipo: string
    titulo: string
    texto: string
    currentCard: any
    defaultClient: any
    oportuniId: any
}

export default function ModalViewSchedule(props: Iprops) {

    const [serviceDetails, setServiceDetails] = useState<any>([]);

    const [cliets, setClients] = useState<any>([]);

    const [properties, setProperties] = useState<any>([]);

    const [triggerAlert, setTriggerAlert] = useState(false);
    const [modalAlertaProps, setModalAlertaProps] = useState({
        tipo: "error",
        titulo: "Schedule Conflict!",
        texto: "There are conflicting times on registration.",
        fecharModal: () => { setTriggerAlert(false) }
    })

    const [date, setDate] = useState<string>();
    const [team, setTeam] = useState<any>();
    const [time, setTime] = useState<string>();
    const [selectedTeam, setSelectedTeam] = useState<any>();
    const [toggleTextarea, setToggleTextarea] = useState(true);
    const [toggleTextareaProp, setToggleTextareaProp] = useState(false);

    const [client, setClient] = useState<any>()
    const [service, setService] = useState<any>()
    const [property, setProperty] = useState<any>()
    const [selectedProperty, setSelectedProperty] = useState<any>()

    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('08:30am');
    const [endDate, setEndDate] = useState('');
    const [every, setEvery] = useState<string>('1');
    const [frequency, setFrequency] = useState<'week' | 'day' | 'month' | 'year'>('week');
    const [dayOfWeek, setDayOfWeek] = useState<number | null>();
    const [comments, setComments] = useState('');
    const [recurringDates, setRecurringDates] = useState([]);


    const [initialStartDate, setInitialStartDate] = useState('');
    const [initialEndDate, setInitialEndDate] = useState('');

    const [recurrency, setRecurrency] = useState(true);
    const [disableRecurrency, setDisableRecurrency] = useState(false);
    const [disableFields, setDisableFields] = useState(false);
    const [disableFieldCli, setdisableFieldCli] = useState(false);
    const [skip, setSkip] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [savingSchedule, setSavingSchedule] = useState(false);

    const [additionalServices, setAdditionalServices] = useState<Array<any>>();

    const daysOfWeek = [
        {
            abrev: "S",
            value: 0
        },
        {
            abrev: "M",
            value: 1
        },
        {
            abrev: "T",
            value: 2
        },
        {
            abrev: "W",
            value: 3
        },
        {
            abrev: "T",
            value: 4
        },
        {
            abrev: "F",
            value: 5
        },
        {
            abrev: "S",
            value: 6
        },
    ];


    useEffect(() => {
        if (loadingScreen) {
            return;
        }
        searchService();

    }, [startDate, startTime, endDate, every, frequency, dayOfWeek, property, service, client, selectedTeam, recurrency])

    useEffect(() => {

        if (props?.currentCard?.type === 'newschedule') {
            setRecurrency(false);
            calculateStartTime(props.currentCard.time);
            setStartDate(props.currentCard.date.toISOString().split("T")[0]);
        }

        if (!props.currentCard?.SAS_SCHEDULE_ID) {
            return;
        }


        if (props?.currentCard?.SAS_SCHEDULE_STATUS === 'Skip') {

            props.currentCard.WC_CLIENTE_COD = null;

            setSkip(true);
            return;

        }

        setLoadingScreen(true);
        setRecurrency(props.currentCard?.SAS_SINALIZADOR === "recurrency");
        setDisableRecurrency(true);
        setStartDate(props.currentCard.date.toISOString().split("T")[0]);

        if (props.currentCard?.SAS_SCHEDULE_START_DATE) {
            let startDateStr = props.currentCard.SAS_SCHEDULE_START_DATE.split('/').reverse().join('-');
            let startDate = new Date(startDateStr);
            let date = startDate.toISOString().split("T")[0];
            setStartDate(date);
            setInitialStartDate(date)
        }

        if (props.currentCard?.SAS_SCHEDULE_END_DATE) {

            let endDateStr = props.currentCard.SAS_SCHEDULE_END_DATE.split('/').reverse().join('-');
            let endDate = new Date(endDateStr);
            let date = endDate.toISOString().split("T")[0];
            setEndDate(date);
            setInitialEndDate(date)
        }


        console.log(props.currentCard?.SAS_PROP_DET);
        if (props.currentCard?.SAS_PROP_DET) {

            setComments(atob(props.currentCard?.SAS_PROP_DET) + '\n' + props.currentCard?.SAS_SCHEDULE_OBSERVA ?? '');

        }

        if (props.currentCard?.SAS_SCHEDULE_FREQUENCY) {
            setFrequency(props.currentCard.SAS_SCHEDULE_FREQUENCY);
        }

        if (props.currentCard?.SAS_SCHEDULE_EVERY) {
            setEvery(props.currentCard.SAS_SCHEDULE_EVERY);
        }

        if (props.currentCard?.SAS_SCHEDULE_WEEK_DAY) {
            let dayOfWeek: any = daysOfWeek.find(day => day.value == props.currentCard.SAS_SCHEDULE_WEEK_DAY);
            setDayOfWeek(parseInt(dayOfWeek.value));
        }

        setDisableFields(true)

        calculateStartTime(props.currentCard.SAS_SCHEDULE_HRINICIO)

    }, []);

    function calculateStartTime(initialTime: any) {


        let [hrIni, minIni] = initialTime.match(/[0-9]+/g);
        hrIni = parseInt(hrIni);
        minIni = parseInt(minIni);
        let pm = initialTime.match('pm') !== null;
        hrIni = (pm && hrIni < 12) ? hrIni + 12 : hrIni


        let hr = `${hrIni}`.padStart(2, '0')
        let min = `${minIni}`.padStart(2, '0')

        setStartTime(`${hr}:${min}`);
    }

    useEffect(() => {

        let cli: any = null;

        if (props.defaultClient) {
            cli = props.defaultClient;
        } else if (props.currentCard?.WC_CLIENTE_COD && !skip) {
            cli = props.currentCard.WC_CLIENTE_COD;
        }

        if (cli) {

            setdisableFieldCli(true);

            ClientService.getByCode(cli).then(data => {
                let client =
                    data.consulta.map(c => ({
                        value: c.WC_CLIENTE_COD,
                        label: `${c.SAS_CLI_PRIMEIRO_NOME} ${c.SAS_CLI_SOBRENOME}`
                    }))
                setClient(client[0])
                getProperties(cli);
            })


        }

        /* if (props.defaultClient) {

            let cli = client.find(c => c.value === props.defaultClient);

            setClient(cli)
            getProperties(props.defaultClient)
            
        }
        else if (props.currentCard?.WC_CLIENTE_COD && !skip) {

            let cli = client.find(c => c.value === props.currentCard?.WC_CLIENTE_COD);

            setClient(cli)
            getProperties(props.currentCard.WC_CLIENTE_COD)
        } */



        /* ClientService
            .getAll()
            .then(data => {
                let client =
                    data.consulta.map(c => ({
                        value: c.WC_CLIENTE_COD,
                        label: `${c.SAS_CLI_PRIMEIRO_NOME} ${c.SAS_CLI_SOBRENOME}`
                    }))

                if (props.defaultClient) {

                    let cli = client.find(c => c.value === props.defaultClient);

                    setClient(cli)
                    getProperties(props.defaultClient)
                    
                }
                else if (props.currentCard?.WC_CLIENTE_COD && !skip) {

                    let cli = client.find(c => c.value === props.currentCard?.WC_CLIENTE_COD);

                    setClient(cli)
                    getProperties(props.currentCard.WC_CLIENTE_COD)
                }

                setClients(client);
            }) */
    }, [])


    const handleClients = (inputValue: string) => {
        return ClientService
            .get(inputValue)
            .then(clients => {
                let client =
                    clients.consulta.map(c => ({
                        value: c.WC_CLIENTE_COD,
                        label: `${c.SAS_CLI_PRIMEIRO_NOME} ${c.SAS_CLI_SOBRENOME}`
                    }))
                return client;

            })

    }



    useEffect(() => {
        ServiceDetailsService
            .getAll()
            .then(services => {
                let serv =
                    services.consulta.map(s => ({
                        value: s.WC_PRODUTO_COD,
                        label: s.WC_PRODUTO_DESC,
                        duration: s.SAS_SERVICE_DURACAO
                    }));

                setServiceDetails(serv);

                if (props.currentCard?.WC_PRODUTO_COD && !skip) {
                    let sv = serv.find(s => s.value === props.currentCard?.WC_PRODUTO_COD);
                    let servicestoSchedule = []
                    servicestoSchedule.push(sv);
                    setAdditionalServices(servicestoSchedule);
                    setService(sv);
                }

            })
    }, [])


    useEffect(() => {
        ScheduleProdutoService
            .getAll(props.currentCard.SAS_SCHEDULE_ID)
            .then(services => {

                let servicestoSchedule: any = []

                services.map(s => {

                    servicestoSchedule.push(
                        {
                            value: s.WC_PRODUTO_COD,
                            label: s.WC_PRODUTO_DESC,
                            duration: s.SAS_SERVICE_DURACAO
                        });



                })

                if (servicestoSchedule.length > 1) {
                    setAdditionalServices(servicestoSchedule);
                }



            })
    }, [service])




    useEffect(() => {
        getTeam()
    }, [])

    function handleInputChange(value: { value: string; label: string; } | null) {
        let selectedUserId = value ? value.value : '';
        setClient(value);
        getProperties(selectedUserId);
    }

    function getProperties(selectedUserId: string) {
        PropertyService
            .getByClient(selectedUserId)
            .then(property => {

                if (property.totalreg > 0) {


                    let propertySelected = property.consulta.find(p => p.SAS_PROP_ID === props.currentCard?.SAS_PROP_ID);
                    setSelectedProperty(propertySelected);

                    let prop =
                        property.consulta.map(p => ({
                            value: p.SAS_PROP_ID,
                            label: p.SAS_PROP_ENDERECO1
                        }))
                    setProperties(prop);

                    if (props.currentCard?.SAS_PROP_ID && !skip) {
                        let property = prop.find(p => p.value === props.currentCard?.SAS_PROP_ID)
                        setProperty(property);
                        setLoadingScreen(false);
                    }
                }

            })
    }

    function calculateEndHour(initialHour: any, serviceTime: number) {

        let [hr, min] = initialHour.match(/[0-9]+/g);
        hr = parseInt(hr);
        min = parseInt(min);

        let pm = initialHour.match('pm') !== null;
        hr = (pm && hr < 12) ? hr + 12 : hr;

        let dateTimer = new Date();
        dateTimer.setHours(hr);
        dateTimer.setMinutes(min + serviceTime);
        let endHour = dateTimer.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' }).toLocaleLowerCase().replace(/\s/g, '');

        return endHour;
    }

    function save(event: any) {
        event.preventDefault();

        setSavingSchedule(true);

        updateProperty(comments);

        if (recurringDates.some((dt: any) => dt?.procedure?.DISPONIBILIDADE === 'NOK')) {
            alert('Error! Schedule Conflict.')
            return;
        }

        ScheduleService.getFilter(props.currentCard).then(schedules => {
            schedules.map(
                sche => ScheduleService.delete(sche.SAS_SCHEDULE_ID)
            )
        });

        if (recurringDates.length && selectedTeam && startTime && service && property && client) {

            recurringDates.map(async (rd: any) => {


                /* let [hr, min] = rd.time.match(/[0-9]+/g);
                hr = parseInt(hr);
                min = parseInt(min);
                let pm = rd.time.match('pm') !== null;
                hr = (pm && hr < 12) ? hr + 12 : hr;

                let dateTimer = new Date();
                dateTimer.setHours(hr);
                dateTimer.setMinutes(min + service.duration); */

                let endHour = calculateEndHour(rd.time, service.duration)


                let schedule: ScheduleModel = {
                    WC_CLIENTE_COD: client.value,
                    SAS_EQUIPE_ID: selectedTeam.value,
                    SAS_SCHEDULE_DATA: rd.date.toLocaleString('pt-BR', { dateStyle: "short" }),
                    SAS_SCHEDULE_HRFIM: endHour,
                    SAS_SCHEDULE_HRINICIO: rd.time,
                    SAS_SCHEDULE_ID: uuidv4(),
                    SAS_SCHEDULE_STATUS: 'ATIVO',
                    SAS_EQUIPE_INICIAL_ID: selectedTeam.value,
                    WC_PRODUTO_COD: service.value,
                    SAS_SINALIZADOR: recurrency ? 'recurrency' : '',
                    SAS_SCHEDULE_OBSERVA: comments,
                    SAS_PROP_ID: property.value,
                    WF_OPORTUNI_ID: props?.oportuniId || '',
                    SAS_SCHEDULE_START_DATE: recurrency ? startDate.split('-').reverse().join('/') : '',
                    SAS_SCHEDULE_END_DATE: recurrency ? endDate.split('-').reverse().join('/') : '',
                    SAS_SCHEDULE_EVERY: recurrency ? every : '',
                    SAS_SCHEDULE_FREQUENCY: recurrency ? frequency : '',
                    SAS_SCHEDULE_WEEK_DAY: recurrency ? `${dayOfWeek}` : ''
                }
                //let tipo = props.currentCard?.SAS_SCHEDULE_ID ? 'ALTERAR' : 'INCLUIR';
                let tipo = 'INCLUIR';

                ScheduleService.save(schedule, tipo).then(
                    retorno => {
                        props.fecharModal();
                    }
                )
            })


        }
    }


    function handleService(data: any) {
        setService(data)
    }

    function handleProperty(data: any) {
        setProperty(data)
    }

    function handleTeam(data: any) {
        setSelectedTeam(data)
    }

    async function getTeam() {
        let peopleTeam = await PeopleTeamService.getAll();
        let people = await PeopleService.getAll();
        let team = await TeamService.getAll()

        peopleTeam = peopleTeam.map(
            pt => {
                people.map(
                    p => {
                        if (p.WC_FORNECEDOR_COD === pt.WC_FORNECEDOR_COD) {
                            pt.pessoa = p
                        }
                    }
                )
                return pt;
            }
        )

        let teamsMap: any[] = []

        peopleTeam.sort(function (a, b) {

            if (a.SAS_EQUIPE_PESSOAS_TIPO == b.SAS_EQUIPE_PESSOAS_TIPO) {
                return 0;

            }

            return a.SAS_EQUIPE_PESSOAS_TIPO == 'Supervisor' ? -1 : 1;
        })

        team = team.map(t => {
            t.equipePessoas = []
            peopleTeam.map(
                pt => {
                    teamsMap[t.SAS_EQUIPE_ID] = t.SAS_EQUIPE_COR
                    if (pt.SAS_EQUIPE_ID === t.SAS_EQUIPE_ID) {
                        t.equipePessoas.push(pt)
                    }
                }
            )
            return t
        })

        let teams = team.map(t => ({
            value: t.SAS_EQUIPE_ID,
            label: (t.equipePessoas.map(ep => ep.pessoa.WC_GEN_RAZAO)).join(' - ')
        }))

        setTeam(teams)


        if (props.currentCard?.SAS_EQUIPE_ID) {
            let selectedTeam = teams.find(t => t.value === props.currentCard?.SAS_EQUIPE_ID)
            setSelectedTeam(selectedTeam);
        }

        if (props.currentCard?.type === 'newschedule') {
            let selectedTeam = teams.find(t => t.value === props.currentCard?.team.SAS_EQUIPE_ID)
            setSelectedTeam(selectedTeam);
        }


    }

    async function createOptionDate() {

        let dates: any = [];
        let date: Date = new Date(startDate);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())

        let lastDate: Date = new Date(endDate)
        lastDate.setMinutes(lastDate.getMinutes() + lastDate.getTimezoneOffset())

        let datetime = new Date();

        let [hrStr, minStr] = startTime.split(':');

        let hr = parseInt(hrStr);
        let min = parseInt(minStr);

        let pm = startTime.match('pm') !== null;

        hr = (pm && hr < 12) ? hr + 12 : hr;

        datetime.setHours(hr);
        datetime.setMinutes(min);
        let time = datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' }).replace(' ', '');
        time = time.toLowerCase();

        dates.push({ date: new Date(date) });

        await Promise.all(dates.map(async (dtObj: any, index: number) => {

            let scheduleStats: ScheduleProcedureModel[] = await QueryExec.exec(`EXECUTE [dbo].[scheduler_builder_tester] '${service.value}','${selectedTeam.value}','${formatDate(dtObj.date)}','${time}'`);
            if (scheduleStats.length) {
                dates[index]['procedure'] = scheduleStats[0];
            }
            dates[index]['time'] = time;
            dates[index]['key'] = v4();
        }))

        setRecurringDates(dates);

    }

    async function createArrayOptionsDate() {

        let dates: any = [];
        let date: Date = new Date(startDate);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())

        let lastDate: Date = new Date(endDate)
        lastDate.setMinutes(lastDate.getMinutes() + lastDate.getTimezoneOffset())



        let datetime = new Date();

        let [hrStr, minStr] = startTime.split(':');

        let hr = parseInt(hrStr);
        let min = parseInt(minStr);

        let pm = startTime.match('pm') !== null;
        hr = (pm && hr < 12) ? hr + 12 : hr;

        datetime.setHours(hr);
        datetime.setMinutes(min);
        let time = datetime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' }).replace(' ', '');
        time = time.toLowerCase();

        for (; date < lastDate; date = returnDaysFrequency(date)) {
            dates.push({ date: new Date(date) });
        }


        if (frequency !== 'day') {
            dates = dates.map(
                (dtArray: { date: Date }) => {

                    let dayOfWeekDt = dtArray.date.getDay();
                    if (dayOfWeekDt === dayOfWeek) {
                        return dtArray;
                    }

                    let diference = (dayOfWeek ?? dtArray.date.getDay()) - dtArray.date.getDay();

                    if (diference > 3) {
                        dtArray.date.setDate(dtArray.date.getDate() + diference - 7);
                        if (dtArray.date < new Date(startDate)) {
                            dtArray.date.setDate(dtArray.date.getDate() + 7);
                        }

                    } else if (diference < -3) {
                        dtArray.date.setDate(dtArray.date.getDate() + diference + 7);
                    } else if (diference > 3) {
                        dtArray.date.setDate(dtArray.date.getDate() + diference);

                        if (dtArray.date < new Date(startDate)) {
                            dtArray.date.setDate(dtArray.date.getDate() + 7);
                        }
                    } else {
                        dtArray.date.setDate(dtArray.date.getDate() + diference);
                    }

                    return dtArray
                })
        }


        await Promise.all(dates.map(async (dtObj: any, index: number) => {

            let scheduleStats: ScheduleProcedureModel[] = await QueryExec.exec(`EXECUTE [dbo].[scheduler_builder_tester] '${service.value}','${selectedTeam.value}','${formatDate(dtObj.date)}','${time}'`);
            if (scheduleStats.length) {
                dates[index]['procedure'] = scheduleStats[0];
            }
            dates[index]['time'] = time;
        }))

        setRecurringDates(dates);

        setLoading(false);

        if (loadingScreen) {
            do {
                if (selectedTeam) {
                    setTimeout(() => {
                        setLoadingScreen(false);
                    }, 500)
                }
            } while (selectedTeam);
        }

    }

    function formatDate(date: Date) {
        return `${date.getFullYear()}${("00" + (date.getMonth() + 1)).slice(-2)}${("00" + date.getDate()).slice(-2)}`;
    }


    function returnDaysFrequency(date: Date): Date {

        if (frequency === 'day') {
            date.setDate(date.getDate() + parseInt(every));
            return date;
        }

        if (frequency === 'week') {
            date.setDate(date.getDate() + (parseInt(every) * 7));
            return date;
        }

        if (frequency === 'month') {
            date.setMonth(date.getMonth() + parseInt(every));
            return date;
        }

        if (frequency === 'year') {
            date.setFullYear(date.getFullYear() + parseInt(every));
            return date;
        }

        return date;
    }

    function searchService() {

        setRecurringDates([]);


        if (recurrency) {
            if (!(client?.value && property?.value && selectedTeam?.value && service?.value && startDate && endDate && startTime && every && frequency && Number.isInteger(dayOfWeek))) {
                return;
            }
            setLoading(true);
            createArrayOptionsDate();
        } else {

            if (!(client?.value && property?.value && selectedTeam?.value && service?.value && startDate && startTime)) {
                return;
            }
            createOptionDate()
        }
    }

    function addYears(years: number) {

        if (startDate) {
            let dt = endDate ? new Date(endDate) : new Date(startDate);
            dt.setFullYear(dt.getFullYear() + years);
            setEndDate(dt.toISOString().split('T')[0]);
        }
    }

    function updateProperty(propDetails: string) {

        selectedProperty.SAS_PROP_DET = propDetails;

        PropertyService.save(selectedProperty.SAS_PROP_ID, selectedProperty, 'ALTERAR')

    }

    return (

        <form onSubmit={save}>
            <div className={styles.containerSchedule}>

                <div className={styles.modalSchedule}>

                    <div className={styles.corpoSchedule}>

                        <div className={styles.modalScheduleHeader}>
                            <img src={addSchedule} alt="Schedule" />
                            <b> &nbsp;&nbsp;{props.titulo}</b>
                        </div>

                    </div>

                    <div className={styles.modalFechar}>
                        <div onClick={() => props.fecharModal()}>
                            <FaRegWindowClose></FaRegWindowClose>
                        </div>
                    </div>


                    {
                        loadingScreen ?
                            <div className={styles.loadingScreen}>
                                <ImSpinner9 size={66} color='#008461'></ImSpinner9>
                            </div>
                            :
                            <>




                            <div style={{'margin': '5px 3px','padding': '5px', 'border': '1.5px solid var(--grey-menu)'}}>
                                <h3>Products</h3>

                                {
                                    additionalServices?.map((serviceToSchedule, k) => (

                                        <div key={Math.random() * k}>
                                            <Select
                                                required
                                                isDisabled={true}
                                                value={serviceToSchedule}
                                                className={styles.select}
                                                placeholder='Service'
                                                onChange={handleService}
                                                options={serviceDetails} />

                                        </div>

                                    ))

                                }
                            </div>


                                <AsyncSelect
                                    required
                                    isDisabled={true}
                                    placeholder='Client'
                                    value={client}
                                    className={styles.select}
                                    loadOptions={handleClients}
                                    onChange={handleInputChange}
                                />

                                <Select
                                    required
                                    isDisabled={true}
                                    value={property}
                                    className={styles.select}
                                    onChange={handleProperty}
                                    placeholder='Property'
                                    options={properties} />

                                <Select
                                    required
                                    value={selectedTeam}
                                    className={styles.select}
                                    onChange={handleTeam}
                                    isDisabled={true}
                                    placeholder='Team'
                                    options={team} />

                                <div className={styles.recurrencyControlContainer}>
                                    <span>Recurrency</span>
                                    <Switch checked={recurrency} onChange={(state) => { if (disableRecurrency) return; setRecurrency(state) }} />
                                </div>

                                <div className={recurrency ? styles.recurrenceItens : styles.oneDate}>
                                    <div className={styles.inputContainer}>
                                        <span>{recurrency ? 'Start Date' : 'Date'}</span>
                                        <input type="date" value={startDate} name='StartDate' disabled={true} />
                                    </div>
                                    {recurrency &&
                                        <div className={styles.inputContainer}>
                                            <span>End Date</span>
                                            <input type="date" value={endDate} name='EndDate' disabled={true} />
                                        </div>
                                    }
                                    <div className={styles.inputContainer}>
                                        <span>Start Time</span>
                                        <input type="time" value={startTime} name='StartTime' onChange={(event) => setStartTime(event.target.value)} disabled={true} />
                                    </div>
                                    {recurrency && <>
                                        <div className={styles.inputContainer}>
                                            <span>Every</span>
                                            <input type="number" value={every} name='Every' disabled={true} />
                                        </div>
                                        <div className={styles.inputContainer}>
                                            <span>Frequency</span>
                                            <select value={frequency} name='Frequency' disabled={true}>
                                                <option value="day">Day</option>
                                                <option value="week">Week</option>
                                                <option value="month">Month</option>
                                                <option value="year">Year</option>
                                            </select>
                                        </div>
                                        <div className={styles.inputContainer}>
                                            <span>Day of Week</span>
                                            <div>
                                                {
                                                    daysOfWeek.map(
                                                        (day: any) =>
                                                        (<div key={Math.random()}>
                                                            <span className={dayOfWeek == day.value ? styles.selected : ''}> {day.abrev}</span>
                                                        </div>))
                                                }
                                            </div>
                                        </div>
                                    </>
                                    }
                                </div>



                                <div className={styles.textAreaContainer}>
                                    <div className={styles.textAreaTitle}>
                                        <h3>Comments</h3>
                                    </div>
                                    {
                                        <textarea
                                            className={styles.observationTextareaProp}
                                            name="observations"
                                            rows={4}
                                            disabled={true}
                                            value={comments} />
                                    }
                                </div>

                                {/* <div className={styles.textAreaContainer}>
                                    <div className={styles.textAreaTitle}>
                                        <h3>This Schedule Comments</h3>
                                        <div onClick={()=> setToggleTextarea(!toggleTextarea)}>
                                            {toggleTextarea ? <HiOutlineChevronUp/> : < HiOutlineChevronDown/>}
                                        </div>
                                    </div>
                                    { toggleTextarea &&
                                    <textarea className={styles.observationTextarea} name="observations" rows={4} value={comments} onChange={handleTextarea} />
                                    }
                                </div> */}

                                {
                                    recurringDates?.length ?
                                        <div className={styles.tableAvailableTimeContainer}>
                                            <table className={styles.tableAvailableTime} cellSpacing="0" cellPadding="0">
                                                <thead className={styles.tableAvailableTimeHeader}>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Time</th>

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {
                                                        recurringDates.map((rd: any) => (
                                                            <tr key={rd.key}>
                                                                <td>{rd.date.toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                                                                <td>{startTime}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                        :


                                        <div className={styles.instructionSelectDate}>
                                            <p>Select the property and service to check a available date & time</p>
                                            {
                                                loading ?
                                                    <div className={styles.loadingScreen}>
                                                        <ImSpinner9 size={66} color='#008461'></ImSpinner9>
                                                    </div>
                                                    :
                                                    <FcCalendar size='72' />
                                            }
                                        </div>


                                }

                            </>
                    }

                </div>



            </div>
            {
                triggerAlert &&
                <Alerta
                    tipo={modalAlertaProps.tipo}
                    titulo={modalAlertaProps.titulo}
                    texto={modalAlertaProps.texto}
                    fecharModal={modalAlertaProps.fecharModal} />
            }
        </form>
    )

}