import { useEffect, useRef, useState } from 'react';
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
import AsyncSelect from 'react-select/async';
import { ChangeEvent } from 'react';
import PopoverError from '../popover-error';
import ScheduleHoursValid from '../../services/shcedule-hours';


interface Iprops {
    fecharModal: any
    tipo: string
    titulo: string
    texto: string
    currentCard: any
    defaultClient: any
    oportuniId: any
}


/* const valid$ = new Subject(); */

export default function ModalAddSchedule(props: Iprops) {




    /* useEffect(() => {


        let update = valid$
        .pipe(
            debounceTime(500)
        )
        .subscribe(() => {
            createArrayOptionsDate();
        })

    }, [])
 */
    /* const updateProcedureable((observer) => {
        createArrayOptionsDate();
        observer.complete();
    }).pipe(
        debounceTime(500)
    ).subscribe(); */

    const actualRequisition = useRef<number>(0);

    const [controlRecurrency, setControlRecurrency] = useState(true);

    const [serviceDetails, setServiceDetails] = useState<any>([]);

    const [showPopoverError, setShowPopoverError] = useState(false);

    const [cliets, setClients] = useState<any>([]);

    const [properties, setProperties] = useState<any>([]);


    const [releaseConfirm, setReleaseConfirm] = useState(false);

    const [triggerAlert, setTriggerAlert] = useState(false);
    const [modalAlertaProps, setModalAlertaProps] = useState({
        tipo: "error",
        titulo: "Schedule Conflict!",
        texto: "There are conflicting times on registration.",
        fecharModal: () => { setTriggerAlert(false) }
    })

    const [popoverProps, setPopoverProps] = useState({
        tipo: "Atention",
        titulo: "Atention!",
        texto: "There are already appointments registered for this client in the selected period.",
        fecharModal: () => { setShowPopoverError(false) }
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

    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('8:30am');
    const [endDate, setEndDate] = useState('');
    const [every, setEvery] = useState<string>('1');
    const [frequency, setFrequency] = useState<'week' | 'day' | 'month' | 'year'>('week');
    const [dayOfWeek, setDayOfWeek] = useState<number | null>();
    const [comments, setComments] = useState('');
    const [propertyComments, setPropertyComments] = useState('');
    const [recurringDates, setRecurringDates] = useState([]);

    const [recurrency, setRecurrency] = useState(true);
    const [disableRecurrency, setDisableRecurrency] = useState(false);
    const [disableFields, setDisableFields] = useState(false);
    const [disableFieldCli, setdisableFieldCli] = useState(false);
    const [skip, setSkip] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [fullServices, setFullServices] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [savingSchedule, setSavingSchedule] = useState(false);

    const [jobHours, setJobHours] = useState<string[]>([]);

    const [FirstOpenning, setFirstOpenning] = useState(false);

    const [validDates, setValidDates] = useState<any>({});


    const [serviceType, setServiceType] = useState(1);

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

    async function getValidHours() {
        let validHours = await ScheduleHoursValid.getAll();
        setJobHours(validHours);
    }

    useEffect(() => {
        getValidHours();

    }, [])

    useEffect(() => {

        //console.log(loadingScreen)

        if (!loadingScreen) {
            searchService();
        }

    }, [startDate, startTime, endDate, every, frequency, dayOfWeek, property, service, client, selectedTeam, recurrency])


    function updateServices(allServices= fullServices) {
        
        let selectedServices = allServices.filter( (s: any) => {

            if(serviceType === 1) {
                return s.WC_FAMILIA_PROD_COD.toUpperCase() === "SERVICE"
            }
            
            if(serviceType === 3) {
                return s.WC_FAMILIA_PROD_COD.toUpperCase() === "EXTRA SERVICE"
            }

            return true;
            
        });

        selectedServices = selectedServices.map( (s: any) => ({
            value: s.WC_PRODUTO_COD,
            label: s.WC_PRODUTO_DESC,
            duration: s.SAS_SERVICE_DURACAO
        }));

        setServiceDetails(selectedServices);
        setLoadingScreen(false);
    }


    useEffect(() => {

        if (disableFields) {
            return;
        }


        if (serviceType == 1) {
            setDisableRecurrency(false);
            setService([]);
            setReleaseConfirm(false);
           
        }

        if (serviceType === 2) {
            
            setRecurrency(false);
            setDisableRecurrency(true);
            setService({
                value: 1569449,
                label: 'Rework',
                duration: 30,
            });
        }


        if (serviceType === 3) {
            setRecurrency(false);
            setDisableRecurrency(true);
            setService([]);
        }

        if(fullServices.length > 0) {
            updateServices();
        }

    }, [serviceType])


    useEffect(() => {

        if (props?.currentCard?.type === 'newschedule') {
            setRecurrency(false);
            calculateStartTime(props.currentCard.time);
            setStartDate(props.currentCard.date.toISOString().split("T")[0]);

            let dayWeek = props.currentCard.date.getDay();

            setDayOfWeek(dayWeek);

        }

        if (!props.currentCard?.SAS_SCHEDULE_ID) {
            return;
        }

        setComments(props?.currentCard?.SAS_SCHEDULE_OBSERVA ?? "");

        setPropertyComments(props?.currentCard?.SAS_PROP_DET ? `${atob(props?.currentCard?.SAS_PROP_DET)}` : '');

        setFirstOpenning(true);


        if (props?.currentCard?.SAS_SCHEDULE_STATUS === 'Skip') {

            props.currentCard.WC_CLIENTE_COD = null;

            //setSkip(true);
            return;

        }

        setLoadingScreen(true);
        setRecurrency(false);
        setDisableRecurrency(true);
        setStartDate(props.currentCard.date.toISOString().split("T")[0]);
        setDisableFields(true);

        calculateStartTime(props.currentCard.SAS_SCHEDULE_HRINICIO);

    }, []);

    function calculateStartTime(initialTime: string) {
        setStartTime(initialTime);
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

                setFullServices(services.consulta);
                let serv =
                    services.consulta.map(s => ({
                        value: s.WC_PRODUTO_COD,
                        label: s.WC_PRODUTO_DESC,
                        duration: s.SAS_SERVICE_DURACAO
                    }));

                //setServiceDetails(serv);


                updateServices(services.consulta);
                
                
                if (props.currentCard?.WC_PRODUTO_COD && !skip) {
                    let sv = serv.find(s => s.value === props.currentCard?.WC_PRODUTO_COD);
                    setService(sv);
                }

            })
    }, [])

    useEffect(() => {
        getTeam();
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

                    let prop =
                        property.consulta.map(p => ({
                            value: p.SAS_PROP_ID,
                            label: p.SAS_PROP_ENDERECO1,
                            comment: p.SAS_PROP_DET
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

        let conflict = false;

        //console.log(recurringDates);

        //if (recurrency) {
        //    conflict = recurringDates.some((dt: any) => dt?.procedure?.some((p: any) => p.SAS_SINALIZADOR === "recurrency"));
        //} else {
        conflict = recurringDates.some((dt: any) => dt?.procedure?.some((p: any) => p.DISPONIBILIDADE === 'NOK'));
        //}

        if (conflict && serviceType === 1) {
            alert('Error! Schedule Conflict.');
            return;
        }

        setSavingSchedule(true);

        let scheduleArray: ScheduleModel[] = [];

        if (recurringDates.length && selectedTeam && startTime && service && property && client) {

            if (recurringDates.length > 1) {

                recurringDates.map(async (rd: any) => {

                    let endHour = calculateEndHour(rd.time, service.duration)

                    let schedule: ScheduleModel = {
                        WC_CLIENTE_COD: client.value,
                        SAS_EQUIPE_ID: selectedTeam.value,
                        SAS_SCHEDULE_DATA: rd.date.toLocaleString('pt-BR', { dateStyle: "short" }).split('/').reverse().join(''),
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
                        SAS_SCHEDULE_START_DATE: recurrency ? startDate.replaceAll('-', '') : '',
                        SAS_SCHEDULE_END_DATE: recurrency ? endDate.replaceAll('-', '') : '',
                        SAS_SCHEDULE_EVERY: recurrency ? every : '',
                        SAS_SCHEDULE_FREQUENCY: recurrency ? frequency : '',
                        SAS_SCHEDULE_WEEK_DAY: recurrency ? `${dayOfWeek}` : ''
                    }

                    verifySkip(schedule);

                    scheduleArray.push(schedule);

                })

                let tipo = props.currentCard?.SAS_SCHEDULE_ID ? 'ALTERAR' : 'INCLUIR';

                ScheduleService.saveBatch(scheduleArray, tipo).then(() => {
                    let reload = true;
                    props.fecharModal(reload);
                });

                PropertyService.updateComment(property.value, propertyComments);

            } else {

                PropertyService.updateComment(property.value, propertyComments);
                recurringDates.map(async (rd: any) => {


                    /* let [hr, min] = rd.time.match(/[0-9]+/g);
                    hr = parseInt(hr);
                    min = parseInt(min);
                    let pm = rd.time.match('pm') !== null;
                    hr = (pm && hr < 12) ? hr + 12 : hr;
    
                    let dateTimer = new Date();
                    dateTimer.setHours(hr);
                    dateTimer.setMinutes(min + service.duration); */

                    let sinalizador = recurrency ? 'recurrency' : ''

                    if (props.currentCard?.SAS_SCHEDULE_ID && props.currentCard?.SAS_SCHEDULE_ID !== 'Skip') {


                        if (props.currentCard?.SAS_SINALIZADOR === "recurrency" && props.currentCard?.SAS_SCHEDULE_STATUS !== 'Skip') {

                            sinalizador = 'moved';

                            let skipedCard: any = {
                                ...props.currentCard,
                                SAS_SCHEDULE_START_DATE: '',
                                SAS_SCHEDULE_END_DATE: '',
                                SAS_SCHEDULE_EVERY: '',
                                SAS_SCHEDULE_FREQUENCY: '',
                                SAS_SCHEDULE_WEEK_DAY: '',
                                SAS_SCHEDULE_STATUS: 'Skip',
                                SAS_SCHEDULE_OBSERVA: 'Service time change',
                                SAS_SCHEDULE_ID: uuidv4(),

                            }

                            ScheduleService.save(skipedCard);
                        }

                    }

                    let endHour = calculateEndHour(rd.time, service.duration)


                    let schedule: ScheduleModel = {
                        WC_CLIENTE_COD: client.value,
                        SAS_EQUIPE_ID: selectedTeam.value,
                        SAS_SCHEDULE_DATA: rd.date.toLocaleString('pt-BR', { dateStyle: "short" }),
                        SAS_SCHEDULE_HRFIM: endHour,
                        SAS_SCHEDULE_HRINICIO: rd.time,
                        SAS_SCHEDULE_ID: props.currentCard?.SAS_SCHEDULE_ID ? props.currentCard?.SAS_SCHEDULE_ID : uuidv4(),
                        SAS_SCHEDULE_STATUS: 'ATIVO',
                        SAS_EQUIPE_INICIAL_ID: selectedTeam.value,
                        WC_PRODUTO_COD: service.value,
                        SAS_SINALIZADOR: sinalizador,
                        SAS_SCHEDULE_OBSERVA: comments,
                        SAS_PROP_ID: property.value,
                        WF_OPORTUNI_ID: props?.oportuniId || '',
                        SAS_SCHEDULE_START_DATE: recurrency ? startDate.split('-').reverse().join('/') : '',
                        SAS_SCHEDULE_END_DATE: recurrency ? endDate.split('-').reverse().join('/') : '',
                        SAS_SCHEDULE_EVERY: recurrency ? every : '',
                        SAS_SCHEDULE_FREQUENCY: recurrency ? frequency : '',
                        SAS_SCHEDULE_WEEK_DAY: recurrency ? `${dayOfWeek}` : ''
                    }
                    let tipo = props.currentCard?.SAS_SCHEDULE_ID ? 'ALTERAR' : 'INCLUIR';

                    verifySkip(schedule);

                    ScheduleService.save(schedule, tipo).then(
                        retorno => {
                            props.fecharModal(true);
                        }
                    )
                })
            }
        } else if (serviceType === 2 || serviceType === 3 ) {

            let endHour = calculateEndHour(startTime, service.duration);
            let startHour = calculateEndHour(startTime, 5);

            let schedule: ScheduleModel = {
                WC_CLIENTE_COD: client.value,
                SAS_EQUIPE_ID: selectedTeam.value,
                SAS_SCHEDULE_DATA: startDate.split('-').reverse().join('/'),
                SAS_SCHEDULE_HRFIM: endHour,
                SAS_SCHEDULE_HRINICIO: startHour,
                SAS_SCHEDULE_ID: props.currentCard?.SAS_SCHEDULE_ID ? props.currentCard?.SAS_SCHEDULE_ID : uuidv4(),
                SAS_SCHEDULE_STATUS: 'ATIVO',
                SAS_EQUIPE_INICIAL_ID: selectedTeam.value,
                WC_PRODUTO_COD: service.value,
                SAS_SINALIZADOR: serviceType === 2 ? 'rework' : 'extra cleaning',
                SAS_SCHEDULE_OBSERVA: comments,
                SAS_PROP_ID: property.value,
                WF_OPORTUNI_ID: props?.oportuniId || '',
                SAS_SCHEDULE_START_DATE: '',
                SAS_SCHEDULE_END_DATE: '',
                SAS_SCHEDULE_EVERY: '',
                SAS_SCHEDULE_FREQUENCY: '',
                SAS_SCHEDULE_WEEK_DAY: ''
            }

            let tipo = props.currentCard?.SAS_SCHEDULE_ID ? 'ALTERAR' : 'INCLUIR';

            ScheduleService.save(schedule, tipo).then(
                retorno => {
                    props.fecharModal(true);
                }
            )

        }
    }


    async function verifySkip(schedule: ScheduleModel) {

        let spot: ScheduleModel[] = await ScheduleService.getSpot(schedule);

        if (spot.length > 0 && spot[0].SAS_SCHEDULE_STATUS === 'Skip') {
            ScheduleService.delete(spot[0].SAS_SCHEDULE_ID);
        }
    }

    function handleService(data: any) {
        setService(data)
    }

    function handleProperty(data: any) {
        setProperty(data);
        setPropertyComments(atob(data.comment));
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
                dates[index]['procedure'] = scheduleStats;
            }
            dates[index]['time'] = time;
            dates[index]['key'] = v4();

        }))

        await Promise.all(dates.map(async (dtObj: any, index: number) => {

            let result = await QueryExec.exec(`SELECT TOP 1 * FROM SAS_SCHEDULE WHERE WC_CLIENTE_COD = ${client.value} AND SAS_SCHEDULE_DATA BETWEEN '${formatDate(dtObj.date)}' AND '${formatDate(dtObj.date)}' AND SAS_SCHEDULE_STATUS <> 'CANCELED'`);

            if (result.length) {
                dates[index]['note'] = "User already scheduled for this date";
            }

        }));

        if (dates.some((dt: any) => dt?.note === "User already scheduled for this date")) {

            if (FirstOpenning) {
                setFirstOpenning(false);
            } else {



                setPopoverProps({
                    tipo: "Atention",
                    titulo: "Atention!",
                    texto: "There are already appointments registered for this client in the selected period.",
                    fecharModal: () => { setShowPopoverError(false) }
                })
                setShowPopoverError(true);
            }

        }

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
            
            //console.log(scheduleStats);
            
            if (scheduleStats.length) {
                dates[index]['procedure'] = scheduleStats;
            }
            dates[index]['time'] = time;
        }))

        await Promise.all(dates.map(async (dtObj: any, index: number) => {

            let result = await QueryExec.exec(`SELECT TOP 1 * FROM SAS_SCHEDULE WHERE WC_CLIENTE_COD = ${client.value} AND SAS_SCHEDULE_DATA BETWEEN '${formatDate(dtObj.date)}' AND '${formatDate(dtObj.date)}' AND SAS_SCHEDULE_STATUS <> 'CANCELED'`);

            if (result.length) {
                dates[index]['note'] = "User already scheduled for this date";
            }

        }));

        if (dates.some((dt: any) => dt?.note === "User already scheduled for this date")) {
            setShowPopoverError(true);
        }

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



        let { SAS_SCHEDULE_VLDT_END, SAS_SCHEDULE_VLDT_INI } = validDates;

        setRecurringDates([]);


        if (recurrency) {


            if (SAS_SCHEDULE_VLDT_END && SAS_SCHEDULE_VLDT_INI) {


                let startDateStr = SAS_SCHEDULE_VLDT_INI.split('/').reverse().join('-');
                let startDateValid = new Date(startDateStr);

                let endDateStr = SAS_SCHEDULE_VLDT_END.split('/').reverse().join('-');
                let endDateValid = new Date(endDateStr);


                if (startDateValid > endDateValid) {

                    setPopoverProps({
                        tipo: "Atention",
                        titulo: "Atention!",
                        texto: "Incorrect períod, verify selected dates.",
                        fecharModal: () => { setShowPopoverError(false) }
                    })
                    setShowPopoverError(true);
                    return;
                }

                let selectedStartDate = new Date(startDate)
                let selectedEndDate = new Date(endDate)

                if (selectedStartDate < startDateValid) {
                    return;
                }

                if (selectedEndDate > endDateValid) {
                    return;
                }

            }

            if (!(client?.value && property?.value && selectedTeam?.value && service?.value && startDate && endDate && startTime && every && frequency && Number.isInteger(dayOfWeek))) {
                return;
            }
            setLoading(true);
            /* valid$.next(true); */
            createArrayOptionsDate();
        } else {


            //console.log(client?.value, property?.value, selectedTeam?.value, service?.value, startDate, startTime)

            if (!(client?.value && property?.value && selectedTeam?.value && service?.value && startDate && startTime)) {
                return;
            }

            if (serviceType === 2) {

                if(comments.trim() > '') {
                    setReleaseConfirm(true);
                }
                return;
            }

            if (serviceType === 3) {
                setReleaseConfirm(true);
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

    function handleTextarea(event: ChangeEvent<HTMLTextAreaElement>) {

        let value = event.target.value;
        
        setComments(value);

        if (serviceType === 2) {

            if(value.trim() > '') {
                setReleaseConfirm(true);
            } else {
                
                setReleaseConfirm(false);
            }
            return;
        }
    }

    function handleTextareaProperty(event: ChangeEvent<HTMLTextAreaElement>) {
        setPropertyComments(event.target.value);
    }


    function handleInputDate(date: string, type: string) {

        if (type === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date)
        }
    }

    function handleRadio(event: ChangeEvent<HTMLInputElement>) {
        setServiceType(parseInt(event.target.value));
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


                                <div className={styles.optionsRadio}>

                                    <div>
                                        <input type="radio" name="typeService" onChange={(event: any) => setServiceType(parseInt(event.target.value))} value="1" checked={serviceType === 1} />
                                        <label>Job</label>
                                    </div>
                                    <div>
                                        <input type="radio" name="typeService" onChange={(event: any) => setServiceType(parseInt(event.target.value))} value="2" checked={serviceType === 2} />
                                        <label>Rework</label>

                                    </div>
                                    <div>
                                        <input type="radio" name="typeService" onChange={(event: any) => setServiceType(parseInt(event.target.value))} value="3" checked={serviceType === 3} />
                                        <label>Extra Cleaning</label>

                                    </div>


                                </div>

                                {
                                    serviceType !== 2 &&

                                    <Select
                                        required
                                        isDisabled={disableFields}
                                        value={service}
                                        className={styles.select}
                                        placeholder='Service'
                                        onChange={handleService}
                                        options={serviceDetails} />

                                }



                                {/* <Select
                                    required
                                    isDisabled={disableFields}
                                    value={client}
                                    className={styles.select}
                                    placeholder='Client'
                                    options={cliets}
                                    onChange={handleInputChange} /> */}

                                <AsyncSelect
                                    required
                                    isDisabled={disableFields || disableFieldCli}
                                    placeholder='Client'
                                    value={client}
                                    className={styles.select}
                                    loadOptions={handleClients}
                                    onChange={handleInputChange}
                                />

                                <Select
                                    required
                                    isDisabled={disableFields}
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
                                    placeholder='Team'
                                    options={team} />

                                <div className={styles.recurrencyControlContainer}>
                                    <span>Recurrency</span>
                                    <Switch checked={recurrency} onChange={(state) => { if (disableRecurrency) return; setRecurrency(state) }} />
                                </div>

                                <div className={recurrency ? styles.recurrenceItens : styles.oneDate}>
                                    <div className={styles.inputContainer}>
                                        <span>{recurrency ? 'Start Date' : 'Date'}</span>
                                        <input type="date" value={startDate} name='StartDate' onChange={(event) => handleInputDate(event.target.value, 'start')} />
                                    </div>
                                    {recurrency &&
                                        <>
                                            <div className={styles.inputContainer}>
                                                <span>End Date</span>
                                                <input type="date" value={endDate} name='EndDate' onChange={(event) => handleInputDate(event.target.value, 'end')} />
                                            </div>
                                            <div className={styles.shortcutYers}>
                                                {
                                                    loading ?
                                                        <div className={styles.loadingScreen} style={{ display: "inline" }}>
                                                            <ImSpinner9 color='#008461' size={20}></ImSpinner9>
                                                        </div>
                                                        :
                                                        <BiPlusCircle size={20} onClick={() => addYears(1)}></BiPlusCircle>
                                                }
                                            </div>
                                        </>
                                    }
                                    <div className={styles.inputContainer}>
                                        <span>Start Time</span>
                                        <select value={startTime} name='StartTime' onChange={(event) => setStartTime(event.target.value)}>
                                            {
                                                jobHours.map((hour, i) => (
                                                    <option value={hour} key={`${i}`} >{hour}</option>
                                                ))
                                            }
                                            
                                            {/* <option value="10:00am">10:00am</option>
                                            <option value="11:30am">11:30am</option>
                                            <option value="1:00pm">1:00pm</option>
                                            <option value="2:30pm">2:30pm</option>
                                            <option value="3:30pm">3:30pm</option> */}
                                        </select>
                                        {/* <input type="time" value={startTime} name='StartTime' onChange={(event) => setStartTime(event.target.value)}/> */}
                                    </div>
                                    {recurrency && <>
                                        <div className={styles.inputContainer}>
                                            <span>Every</span>
                                            <input type="number" value={every} name='Every' onChange={(event) => setEvery(event.target.value)} />
                                        </div>
                                        <div className={styles.inputContainer}>
                                            <span>Frequency</span>
                                            <select value={frequency} name='Frequency' onChange={(event: any) => setFrequency(event.target.value)}>
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
                                                        (<div onClick={() => setDayOfWeek(day.value)} key={day.value}>
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
                                        <h3>Client and Properties Comments</h3>
                                        <div onClick={() => setToggleTextareaProp(!toggleTextareaProp)}>
                                            {toggleTextareaProp ? <HiOutlineChevronUp /> : < HiOutlineChevronDown />}
                                        </div>
                                    </div>
                                    {toggleTextareaProp &&
                                        <textarea
                                            className={styles.observationTextareaProp}
                                            required={false}
                                            name="observations"
                                            rows={4}
                                            onChange={handleTextareaProperty}
                                            value={propertyComments} />
                                    }
                                </div>

                                <div className={styles.textAreaContainer}>
                                    <div className={styles.textAreaTitle}>
                                        <h3>This Schedule Comments { serviceType === 2 && <small style={{color: '#940000', fontSize: 12}}>*required</small>}</h3>
                                        <div onClick={() => setToggleTextarea(!toggleTextarea)}>
                                            {toggleTextarea ? <HiOutlineChevronUp /> : < HiOutlineChevronDown />}
                                        </div>
                                    </div>
                                    {toggleTextarea &&
                                        <textarea 
                                            className={styles.observationTextarea} 
                                            name="observations" 
                                            rows={4} 
                                            onChange={handleTextarea}  
                                            value={comments}/>
                                    }
                                </div>

                                {
                                    recurringDates?.length ?
                                        <div className={styles.tableAvailableTimeContainer}>
                                            <table className={styles.tableAvailableTime} cellSpacing="0" cellPadding="0">
                                                <thead className={styles.tableAvailableTimeHeader}>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        {/* <th>Note</th> */}
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {
                                                        recurringDates.map((rd: any) => (
                                                            <tr className={rd?.procedure?.some((p: any) => p.DISPONIBILIDADE === 'NOK') ? styles.unavailable : ''} key={rd.key}>
                                                                <td>{rd.date.toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                                                                <td>{startTime}</td>
                                                                {/* <td>{rd?.note}</td> */}
                                                                <td>{rd?.procedure?.some((p: any) => p.DISPONIBILIDADE === 'NOK') ? <HiXCircle size="20" color="#b32f3a"></HiXCircle> : <HiCheckCircle size="20" color="#01c293"></HiCheckCircle>}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                        :

                                                
                                        serviceType === 1 &&
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


                                <div className={styles.modalAction}>
                                    <button disabled={(!recurringDates?.length || savingSchedule) && !releaseConfirm} className={`${styles.btnAction} btn btn-confirm`}>Confirm Schedule &nbsp;

                                        {savingSchedule ?

                                            <div className={styles.loadingScreen} style={{ display: "inline" }}>
                                                <ImSpinner9 color='#fff'></ImSpinner9>
                                            </div>
                                            :
                                            <FaPlus />
                                        }
                                    </button>
                                </div>
                            </>
                    }

                </div>



            </div>
            {
                showPopoverError &&
                <PopoverError
                    tipo={popoverProps.tipo}
                    titulo={popoverProps.titulo}
                    texto={popoverProps.texto}
                    fecharModal={popoverProps.fecharModal} />
            }
        </form>
    )

}