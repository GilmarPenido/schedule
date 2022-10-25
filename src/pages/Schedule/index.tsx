import React, { useEffect, useRef, useState } from "react";
import { FaDotCircle, FaExchangeAlt, FaFilter, FaRegWindowClose } from "react-icons/fa";
import { IoIosCodeWorking } from "react-icons/io";
import { ImArrowLeft, ImArrowRight } from "react-icons/im";
import { RiVipCrownFill, RiUserFill } from "react-icons/ri";
import { ImSpinner9 } from "react-icons/im";
import styles from "./styles.module.css";
import PeopleService from "../../services/people";
import PeopleTeamService from "../../services/people-team";
import TeamService from "../../services/team";
import TeamModel from "../../Models/team/intex";
import addSchedule from '../../assets/add_schedule.png';
import ScheduleService from "../../services/Schedule";
import ScheduleModel from "../../Models/Schedule";
import ModalConfirmDrag from "../../components/ModalConfirmDrag";
import { IoArrowRedoSharp, IoMail } from "react-icons/io5";
import { AiFillMediumCircle, AiFillTrademarkCircle } from "react-icons/ai";
import ScheduleFullService from "../../services/ScheduleFull";
import ScheduleFullModel from "../../Models/ScheduleFull";
import Filter from "../../components/Filter";
import ScheduleProcedureModel from "../../Models/schedule-procedure";
import QueryExec from "../../services/query-exec";
import OportuniService from "../../services/oportuni";
import ModalAddSchedule from "../../components/ModalAddSchedule";
import ModalEditSchedule from "../../components/ModalEditSchedule";
import ModalConfirmSkip from "../../components/ModalConfirmSkip";
import ChangeTeamService from "../../services/change-team";
import ChangeTeamModel from "../../Models/change-team";
import { v4 as uuidv4 } from 'uuid';
import ModalViewSchedule from "../../components/ModalViewSchedule";
import ModalAddNote from "../../components/ModalAddNote";
import ModalChangeTeam from "../../components/ModalChangeTeam";
import { BsBookmarkPlus } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import ScheduleHoursValid from "../../services/shcedule-hours";
import Alerta from "../../components/Alerta";


const days = 7;
const daysString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Schedule(props: any) {

    const filterWidth = 300;

    const [jobHours, setJobHours] = useState([
        '8:30am',
        '10:00am',
        '11:30am',
        '1:00pm',
        '2:30pm',
        '3:30pm'
    ]);

    const [conflicstAuthorized, setConflicstAuthorized] = useState(false);

    const [oportuniID, setOportuniID] = useState(0);

    const [filterServiceRef, setFilterServiceRef] = useState<any>();
    const [filterClientRef, setFilterClientRef] = useState<any>();
    const [filterTeamsRef, setFilterTeamsRef] = useState<any>([]);
    const [filterDate, setFilterDate] = useState('')
    const [sizeFilter, setSizeFilter] = useState<any>(filterWidth);
    const [windowWidthSize, setWindowWidthSize] = useState<any>(window.innerWidth);

    const [selectedMonth, setSelectedMonth] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<number>(0);

    const [teams, setTeams] = useState<TeamModel[]>([]);
    const [dates, setDates] = useState<Date[]>([]);
    const [scheduleMap, setScheduleMap] = useState<any>([]);
    const [loadSchedule, setLoadSchedule] = useState(true);
    const [teamsMapColor, setTeamsMapColor] = useState<any[]>([]);
    const [loadScheduleCard, setLoadScheduleCard] = useState<any>([]);
    const [confirmDrag, setConfirmDrag] = useState(false);
    const [confirmSkip, setConfirmSkip] = useState(false);
    const [contextMenu, setContextMenu] = useState(false);
    const [contextTeamMenu, setContextTeamMenu] = useState(false);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [changedTeams, setChangedTeams] = useState<ChangeTeamModel[]>([]);

    const confirmAction = useRef<Function>(() => { })

    const [messagePopover, setMessagePopover] = useState('');

    const [moveCardValues, setMoveCardValues] = useState<any>()

    const [currentCard, setCurrentCard] = useState<any>();

    const [initialDate, setInitialDate] = useState(new Date().toLocaleString('en-us', { month: 'short', year: 'numeric' }));

    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalView, setOpenModalView] = useState(false);
    const [openModalAddNote, setOpenModalAddNote] = useState(false);
    const [openModalChangeTeam, setOpenModalChangeTeam] = useState(false);

    const [openAlerta, setOpenAlerta] = useState(false);

    const [modalConfirmText, setModalConfirmText] = useState('');
    const [modalConfirmTitle, setModalConfirmTitle] = useState('');

    const [weeksNavigator, setWeeksNavigator] = useState<{ endDay: number, initialDay: number, legend: string }[]>();

    const [selectedClient, setSelectedClient] = useState<any>(null);

    const [selectedTeam, setSelectedTeam] = useState(0);

    const startTimeForRework: any = {
        '8:30am': '8:35am',
        '10:00am': '10:05am',
        '11:30am': '11:35am',
        '1:00pm': '1:05pm',
        '2:30pm': '2:35pm',
        '3:30pm': '3:35pm'
    }

    const [dropNumberCaracterName, setDropNumberCaracterName] = useState(30);

    const startDrag = (e: any, sche: ScheduleFullModel) => {
        /*e.dataTransfer.setData('cliId', sche.WC_CLIENTE_COD);
        e.dataTransfer.setData('scheduleId', sche.SAS_SCHEDULE_ID);*/
        setCurrentCard({
            ...sche,
        });
    }
    const dragOver = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    }
    const drop = async (e: any, team: TeamModel, dt: Date, hr: string) => {

        /* let cliId = e.dataTransfer.getData('cliId').split('|');
        let scheduleId = e.dataTransfer.getData('scheduleId').split('|'); */
        /* e.target.appendChild(document.getElementById(id)); */

        let arr: any = [];
        arr[`${team.SAS_EQUIPE_ID}${dt.toLocaleString()}`] = true;
        setLoadScheduleCard(arr);


        let formatedDate = `${dt.getFullYear()}${("00" + (dt.getMonth() + 1)).slice(-2)}${("00" + dt.getDate()).slice(-2)}`;
        let scheduleStats: ScheduleProcedureModel[] = await QueryExec.exec(`EXECUTE [dbo].[scheduler_builder_tester] '${currentCard.WC_PRODUTO_COD}','${team.SAS_EQUIPE_ID}','${formatedDate}','${hr}'`);

        let unavailableTime = scheduleStats.some((ss) => ss.DISPONIBILIDADE === 'NOK')

        if (unavailableTime) {
            setModalConfirmText('Cannot move this card!');
            setModalConfirmTitle('Unavailable time');
            confirmAction.current = function () {
                setConfirmDrag(false);
                setCurrentCard(undefined);
                setTimeout(() => {
                    setLoadScheduleCard([]);
                }, 500);
            }


        } else {


            let endHour = calculateEndHour(hr, currentCard.SAS_SERVICE_DURACAO);

            setModalConfirmText('Are you sure you want to move this card?');
            setModalConfirmTitle('Moving Card');

            confirmAction.current = function () {

                setConfirmDrag(false);
                let flag = currentCard?.SAS_SINALIZADOR === 'recurrency' ? 'moved' : '';
                ScheduleService.update(currentCard.WC_CLIENTE_COD, team, dt, hr, currentCard, flag, endHour)
                    .then(
                        _ => {

                            if (currentCard?.SAS_SINALIZADOR === "recurrency") {

                                currentCard.SAS_SCHEDULE_START_DATE = '';
                                currentCard.SAS_SCHEDULE_END_DATE = '';
                                currentCard.SAS_SCHEDULE_EVERY = '';
                                currentCard.SAS_SCHEDULE_FREQUENCY = '';
                                currentCard.SAS_SCHEDULE_WEEK_DAY = '';
                                currentCard.SAS_SCHEDULE_STATUS = 'Skip';
                                currentCard.SAS_SCHEDULE_OBSERVA = 'Service time change';
                                currentCard.SAS_SCHEDULE_ID = uuidv4();
                                return ScheduleService.save(currentCard);
                            }
                            return Promise.resolve();

                        }

                    ).then(_ => {

                        scheduleUpdate(currentCard.SAS_EQUIPE_ID, currentCard.SAS_SCHEDULE_DATA);
                        scheduleUpdate(team, dt);
                        setCurrentCard(undefined);
                    })
                    .catch(err => {
                        alert('Error, close this window and try again!');
                        setCurrentCard(undefined);
                        setTimeout(() => {
                            setLoadScheduleCard([]);
                        }, 500);
                    })



            }
        }


        setConfirmDrag(true);
        /* ScheduleService.update(cliId, team, dt, hr, scheduleId).then(
            _ => scheduleUpdate(team, dt)
        ) */
    };


    useEffect(() => {

        if (windowWidthSize < 1500) {
            setDropNumberCaracterName(11);
        } else if (windowWidthSize < 1600) {
            setDropNumberCaracterName(13);
        } else if (windowWidthSize < 1700) {
            setDropNumberCaracterName(16);
        } else if (windowWidthSize < 1800) {
            setDropNumberCaracterName(18);
        } else if (windowWidthSize < 1900) {
            setDropNumberCaracterName(21);
        } else if (windowWidthSize < 2000) {
            setDropNumberCaracterName(25);
        } else {
            setDropNumberCaracterName(30);
        }

        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);

    }, [windowWidthSize])


    function updateSize() {
        setWindowWidthSize(window.innerWidth);
    }

    async function getValidHours() {
        let validHours = await ScheduleHoursValid.getAll();
        let authorized = await QueryExec.authorized();
        setConflicstAuthorized(authorized);
        setJobHours(validHours);
    }

    useEffect(() => {


        getValidHours();

        let oportuniPropId = props.location.search.match(/(?<=oportuniId=)\d*/i);

        if (oportuniPropId) {
            setOportuniID(oportuniPropId[0]);
            OportuniService.getByLead(oportuniPropId).then(opt => {
                let codCli = opt.consulta[0].WF_OPORTUNI_CLIPROS;
                setSelectedClient(codCli);
            });
        }

        getTeams();
        let date = new Date();
        setSelectedMonth(date.getMonth());
        //console.log(date.getMonth());
        setSelectedYear(date.getFullYear());
        browseWeek(date.getDate(), date.getMonth(), date.getFullYear());
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [openModalAdd, openModalEdit, openModalView])


    useEffect(() => {
        getTeams();
        setSubstitutesForTeams();
        scheduleUpdate();
    }, [dates]);

    useEffect(() => {

        let date = new Date();
        date.setDate(1);
        date.setMonth(selectedMonth);
        date.setFullYear(selectedYear);

        let ArrayWeeksNavigator = []

        let lastDayOfMonth = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
        do {

            let complementsDayWeek = (6 - date.getDay());
            let initialDay = date.getDate();
            let endDay = date.getDate() + complementsDayWeek;

            if (endDay > lastDayOfMonth) {
                endDay = lastDayOfMonth;
            }

            let legend = ('00' + initialDay).slice(-2) + ' - ' + ('00' + endDay).slice(-2)

            ArrayWeeksNavigator.push({
                endDay,
                initialDay,
                legend,
            })

            setWeeksNavigator(ArrayWeeksNavigator)

            date.setDate(endDay + 1)

        } while (date.getMonth() === selectedMonth);

    }, [selectedMonth]);

    useEffect(() => {
        setLoadSchedule(false);
    }, [scheduleMap])

    useEffect(() => {

        if (filterDate !== '') {
            let date = new Date(filterDate);
            setSelectedYear(date.getFullYear());
            setInitialDate(date.toLocaleString('en-us', { month: 'short', year: 'numeric' }))
            setSelectedMonth(date.getMonth());
            browseWeek(date.getDate(), date.getMonth(), date.getFullYear());
        }

    }, [filterDate])


    function setSubstitutesForTeams() {

        if (!dates.length) return;

        ChangeTeamService.getAll(dates[0])
            .then(function (substitutes: ChangeTeamModel[]) {
                if (!substitutes) {
                    setChangedTeams([]);
                    return;
                };
                substitutes.forEach(sub => {
                    sub.dateStart = convertDateSqlToDate(sub.SAS_TROCA_EQUIPE_DTINI);
                    sub.dateEnd = convertDateSqlToDate(sub.SAS_TROCA_EQUIPE_DTFI);
                })

                setChangedTeams(substitutes);
            })

    }


    function convertDateSqlToDate(dateSQL: string) {
        let date = new Date();

        date.setFullYear(parseInt(dateSQL.substring(6, 10)));

        date.setMonth(parseInt(dateSQL.substring(3, 5)) - 1);

        date.setDate(parseInt(dateSQL.substring(0, 2)));

        return date;
    }

    function releaseTeam() {

        let equipeId = currentCard.team.SAS_EQUIPE_ID;
        let data = currentCard.formatedDate;
        TeamService.releaseTeam(equipeId, data);
        scheduleUpdate();

    }

    function removeReleaseTeam() {
        let equipeId = currentCard.team.SAS_EQUIPE_ID;
        let data = currentCard.formatedDate;
        TeamService.removeReleaseTeam(equipeId, data);
        scheduleUpdate();
    }

    function extractDate(date: Date) {
        return date.toLocaleString('pt-br', { dateStyle: 'short' }).split('/').reverse().join('');
    }

    function scheduleUpdate(team: TeamModel | undefined = undefined, dt: Date | undefined = undefined) {

        if (!dates.length) {
            return;
        }

        if (team === undefined && dt === undefined) {

            setLoadSchedule(true);
        }

        let dataIni = extractDate(dates[0]);
        let dataEnd = extractDate(dates[6]);

        ScheduleFullService
            .getAll(dataIni, dataEnd)
            .then((schedule: any) => {

                let scheduleData: any = []
                if (!schedule) return;

                schedule.map((sche: ScheduleFullModel) => {

                    let reworkHours = ['8:35am', '10:05am', '11:35am', '1:05pm', '2:35pm', '3:35pm'];

                    if (!scheduleData[sche.SAS_SCHEDULE_DATA]) {
                        scheduleData[sche.SAS_SCHEDULE_DATA] = [];
                    }
                    if (!scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID]) {
                        scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID] = [];
                    }

                    if (!scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO]) {
                        scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO] = [];
                    }

                    if (reworkHours.includes(sche.SAS_SCHEDULE_HRINICIO)) {

                        if (!scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO]) {
                            scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO] = [];

                        }

                        scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO].push(sche);

                    } else {

                        if (scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO] === 'skiphour') {
                            return;
                        }


                        if (scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO]?.SAS_SCHEDULE_ID) {
                            if (sche.SAS_SCHEDULE_STATUS === 'Skip') {
                                return true;
                            }
                        }

                        scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO].push({ ...sche, 'size': 1 })
                    }

                    let length = scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO].length;



                    if (length > 1) {
                        let indice = scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO].findIndex((n: any) => n.SAS_SCHEDULE_STATUS === 'Skip')
                        console.log(indice);
                        if (indice !== -1) {
                            scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO].splice(indice, 1);
                        }
                    }


                    if (sche.SAS_SCHEDULE_STATUS === 'Skip') {
                        return true;
                    }

                    let index = jobHours.indexOf(sche.SAS_SCHEDULE_HRINICIO)
                    scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO][0]['size'] = 1

                    for (let i = index + 1; i < 6; i++) {

                        let nextHour = jobHours[i]
                        if (nextHour === undefined) {
                            break;
                        }

                        let dateIni = setTimeInDate(nextHour, 30);

                        let dateEnd = setTimeInDate(sche.SAS_SCHEDULE_HRFIM);

                        if (dateEnd <= (dateIni)) {
                            break;
                        }

                        if (reworkHours.includes(sche.SAS_SCHEDULE_HRINICIO)) {
                            i--;
                            break;
                        }

                        scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][sche.SAS_SCHEDULE_HRINICIO][0]['size']++;

                        scheduleData[sche.SAS_SCHEDULE_DATA][sche.SAS_EQUIPE_ID][nextHour] = 'skiphour';
                    }
                });

                setScheduleMap(scheduleData);

                if (team !== undefined && dt !== undefined) {
                    let arr: any = [];
                    arr[`${team.SAS_EQUIPE_ID}${dt.toLocaleString()}`] = false;
                    setLoadScheduleCard(arr);
                }
            }).catch(err => {
                setLoadSchedule(false);
                if (team !== undefined && dt !== undefined) {
                    let arr: any = [];
                    arr[`${team.SAS_EQUIPE_ID}${dt.toLocaleString()}`] = false;
                    setLoadScheduleCard(arr);
                }
            })
    }

    async function getTeams() {

        let peopleTeam = await PeopleTeamService.getAll();
        let people = await PeopleService.getAll();
        let team = await TeamService.getAll();

        peopleTeam.sort(function (a, b) {

            if (a.SAS_EQUIPE_PESSOAS_TIPO == b.SAS_EQUIPE_PESSOAS_TIPO) {
                return 0;

            }

            return a.SAS_EQUIPE_PESSOAS_TIPO == 'Supervisor' ? -1 : 1;
        })

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


        team.sort(function (a, b) {
            return a.SAS_EQUIPE_DESCRI < b.SAS_EQUIPE_DESCRI ? -1 : 1;
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

        setTeamsMapColor(teamsMap);
        setTeams(team);


        //cria array de datas com equipes


    }

    function openModalScheduleAddCurrentCard(team: any, dt: Date, time: string, sche: ScheduleModel | null) {

        setCurrentCard({
            team,
            date: dt,
            formatedDate: dt.toLocaleString('pt-BR', { dateStyle: "short" }),
            time,
            ...sche,
            type: 'newschedule'
        });

        setOpenModalAdd(true);
    }

    function browseMonth(navigationValue: -1 | 1) {

        let month = selectedMonth + navigationValue;
        let date = new Date();
        let year = selectedYear;

        if (month < 0) {
            month = 11;
            year = year - 1;
        }

        if (month > 11) {
            month = 0;
            year = year + 1;
        }

        date.setDate(1);
        date.setFullYear(year);
        date.setMonth(month);

        console.log(date);

        setSelectedYear(year);
        setSelectedMonth(month);

        console.log(month, year);

        setInitialDate(date.toLocaleString('en-us', { month: 'short', year: 'numeric' }))


        let dayOfWeek = date.getDay();
        date.setDate(date.getDate() - (dayOfWeek + 1));

        let dateArray = []

        for (let i = 0; i < days; i++) {
            date.setDate(date.getDate() + 1)
            dateArray.push(new Date(date))
        }

        setDates(dateArray)


    }

    function browseWeek(day: number, month = selectedMonth, year = selectedYear) {

        let date = new Date();
        date.setMonth(month);
        date.setDate(day)
        date.setFullYear(year);

        let dayOfWeek = date.getDay();
        date.setDate(date.getDate() - (dayOfWeek + 1));
        let dateArray = []

        for (let i = 0; i < days; i++) {
            date.setDate(date.getDate() + 1)
            dateArray.push(new Date(date))
        }


        setDates(dateArray)

    }

    function handleContextMenu(event: any, sche: ScheduleFullModel | null, team: any, dt: Date, conflict: boolean = false) {

        event.preventDefault();

        if (sche === null) return;


        if (conflict && !conflicstAuthorized) {
            setOpenAlerta(true);
            return;
        }

        setCurrentCard({
            team,
            date: dt,
            formatedDate: dt.toLocaleString('pt-BR', { dateStyle: "short" }),
            time: sche.SAS_SCHEDULE_HRINICIO,
            ...sche
        });

        event.preventDefault();

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;


        let positionX = event.clientX - 10;
        let positionY = event.clientY - 10;

        if ((screenW - positionX) < 160) {
            positionX = positionX - 150
        }

        if ((screenH - positionY) < 142) {
            positionY = positionY - 132
        }

        setPositionX(positionX)
        setPositionY(positionY)

        setContextMenu(!contextMenu);
    }

    function handleContextTeamMenu(event: any, date: Date, team: TeamModel) {


        setCurrentCard({
            team,
            date,
            formatedDate: (date.toLocaleString('pt-br', { dateStyle: "short" })).split('/').reverse().join(''),
        });

        event.preventDefault();

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;


        let positionX = event.clientX - 10;
        let positionY = event.clientY - 10;

        if ((screenW - positionX) < 160) {
            positionX = positionX - 150
        }

        if ((screenH - positionY) < 142) {
            positionY = positionY - 132
        }

        setPositionX(positionX)
        setPositionY(positionY)

        setContextTeamMenu(!contextTeamMenu);
    }

    function closeContextMenu() {
        if (contextMenu) {
            setContextMenu(false)
        }
    }

    function closeContextTeamMenu() {
        if (contextTeamMenu) {
            setContextTeamMenu(false)
        }
    }

    function openMessagePopover(event: any, text: string) {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        let positionX = event.clientX - 10;
        let positionY = event.clientY - 10;

        if ((screenW - positionX) < 160) {
            positionX = positionX - 150
        }

        if ((screenH - positionY) < 142) {
            positionY = positionY - 132
        }

        setPositionX(positionX)
        setPositionY(positionY)
        setMessagePopover(text);
    }

    function skip() {

        setModalConfirmText('Confirm this skip?');
        setModalConfirmTitle('Skip');

        confirmAction.current = function (motivation = '') {

            currentCard.SAS_SCHEDULE_STATUS = 'Skip';
            currentCard.SAS_SCHEDULE_OBSERVA = motivation;
            currentCard.SAS_SCHEDULE_HRFIM = '';
            setConfirmDrag(false);
            let arr: any = [];
            arr[`${currentCard.SAS_EQUIPE_ID}${currentCard.date.toLocaleString()}`] = true;
            setLoadScheduleCard(arr);

            ScheduleService.save(currentCard, 'ALTERAR')
                .then(() => {
                    scheduleUpdate();
                    setConfirmSkip(false);
                    setCurrentCard(undefined);
                    setTimeout(() => {
                        setLoadScheduleCard([]);
                    }, 500);
                })
                .catch(() => {
                    alert('Error, close this window and try again!');
                    setConfirmSkip(false);
                    setCurrentCard(undefined);
                    setTimeout(() => {
                        setLoadScheduleCard([]);
                    }, 500);
                })
        }

        setConfirmSkip(true);

    }


    function addNote() {

        setModalConfirmTitle('Note');


        confirmAction.current = function (motivation = '') {

            currentCard.SAS_SCHEDULE_OBSERVA = motivation;
            setConfirmDrag(false);
            let arr: any = [];
            arr[`${currentCard.SAS_EQUIPE_ID}${currentCard.date.toLocaleString()}`] = true;
            setLoadScheduleCard(arr);
            setOpenModalAddNote(false);
            ScheduleService.save(currentCard, 'ALTERAR')
                .then(() => {
                    scheduleUpdate();
                    setCurrentCard(undefined);
                    setTimeout(() => {
                        setLoadScheduleCard([]);
                    }, 500);
                })
                .catch(() => {
                    alert('Error, close this window and try again!');
                    setCurrentCard(undefined);
                    setTimeout(() => {
                        setLoadScheduleCard([]);
                    }, 500);
                })
        }

        setOpenModalAddNote(true);

    }

    function deleteSchedule() {

        setModalConfirmText('Confirm delete this service?');
        setModalConfirmTitle('Delete');


        confirmAction.current = function () {

            setConfirmDrag(false);
            let arr: any = [];
            arr[`${currentCard.SAS_EQUIPE_ID}${currentCard.date.toLocaleString()}`] = true;
            setLoadScheduleCard(arr);

            ScheduleService.delete(currentCard.SAS_SCHEDULE_ID)
                .then(() => {
                    scheduleUpdate();
                    setCurrentCard(undefined);
                    setTimeout(() => {
                        setLoadScheduleCard([]);
                    }, 500);
                })
                .catch(() => {
                    alert('Error, error to exclude service!');
                    setCurrentCard(undefined);
                    setTimeout(() => {
                        setLoadScheduleCard([]);
                    }, 500);
                })
        }

        setConfirmDrag(true);
    }


    function setTimeInDate(timer: any, tolerance = 0) {

        let date = new Date();
        let [hrIni, minIni] = timer.match(/[0-9]+/g);
        hrIni = parseInt(hrIni);
        minIni = parseInt(minIni);
        let pm = timer.match('pm') !== null;
        hrIni = (pm && hrIni < 12) ? hrIni + 12 : hrIni
        date.setHours(hrIni);
        date.setMinutes(minIni + tolerance);

        return date;

    }

    function calculateEndHour(initialHour: any, serviceTime: number) {

        console.log(initialHour);

        console.log(serviceTime);

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


    function extendCard(hourEnd: any, index: number): number {

        let nextHour = jobHours[index]

        if (nextHour === undefined) {
            return 0;
        }

        let dateIni = setTimeInDate(nextHour);

        let dateEnd = setTimeInDate(hourEnd, 30);

        if (dateEnd <= dateIni) {
            return 0;
        }

        return extendCard(hourEnd, index + 1) + 1;
    }

    function lineColor(sche: ScheduleFullModel, team: TeamModel): string {


        if (sche.SAS_SERVICE_BORDER !== '#000000') {
            return sche.SAS_SERVICE_BORDER
        } else {
            return teamsMapColor[sche.SAS_EQUIPE_INICIAL_ID] || team.SAS_EQUIPE_COR
        }

    }

    function openingEditRecurrency() {
        setOpenModalEdit(true);
    }


    function openView(event: any, sche: ScheduleModel | null, team: any, dt: Date) {

        if (sche === null) return;


        setCurrentCard({
            team,
            date: dt,
            formatedDate: dt.toLocaleString('pt-BR', { dateStyle: "short" }),
            time: sche.SAS_SCHEDULE_HRINICIO,
            ...sche
        });

        setOpenModalView(true);
    }


    function openChangeTeam() {
        setOpenModalChangeTeam(true);
    }


    return (

        <main className={styles.container}>

            <Filter
                setSizeFilter={setSizeFilter}
                sizeFilter={sizeFilter}

                setFilterServiceRef={setFilterServiceRef}
                filterServiceRef={filterServiceRef}

                setFilterClientRef={setFilterClientRef}
                filterClientRef={filterClientRef}

                setFilterTeamsRef={setFilterTeamsRef}
                filterTeamsRef={filterTeamsRef}

                filterDate={filterDate}
                setFilterDate={setFilterDate}
            >
            </Filter>

            {
                messagePopover &&

                <div className={`${styles.contextMenu} ${styles.contextMessage}`} style={{ top: positionY, left: positionX }} onMouseLeave={() => { setMessagePopover('') }} >
                    <h3>Attention!</h3>
                    <p style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: messagePopover }}></p>

                </div>
            }


            {
                contextMenu &&

                <div className={styles.contextMenu} style={{ top: positionY, left: positionX }} onMouseLeave={closeContextMenu}>


                    {
                        currentCard?.SAS_SINALIZADOR === "rework" || currentCard?.SAS_SINALIZADOR === "extra cleaning" ?
                            <div className={styles.contextMenuOption} onClick={() => deleteSchedule()} >Delete Schedule</div>
                            :
                            <>
                                <div className={styles.contextMenuOption} onClick={() => setOpenModalAdd(true)}>Move To</div>
                                <div className={styles.contextMenuOption} onClick={() => addNote()}>Add Note</div>
                                <div className={`${styles.contextMenuOption} ${currentCard?.SAS_SINALIZADOR === 'recurrency' ? '' : styles.contextMenuOptionDisabled}`} onClick={() => openingEditRecurrency()} >Edit Recurrency</div>
                                <div className={`${styles.contextMenuOption} ${currentCard?.SAS_SINALIZADOR !== 'recurrency' ? '' : styles.contextMenuOptionDisabled}`} onClick={() => deleteSchedule()} >Delete Schedule</div>
                                <div className={`${styles.contextMenuOption} ${currentCard?.SAS_SINALIZADOR === 'recurrency' ? '' : styles.contextMenuOptionDisabled}`} onClick={() => skip()}>Skip</div>
                                {/* <div className={styles.contextMenuSeparator} />
                            <div className={styles.contextMenuOption}>info</div> */}
                            </>
                    }


                </div>
            }

            {
                contextTeamMenu &&

                <div className={styles.contextMenu} style={{ top: positionY, left: positionX }} onMouseLeave={closeContextTeamMenu}>
                    <div className={`${styles.contextMenuOption} ${true ? '' : styles.contextMenuOptionDisabled}`} onClick={() => openChangeTeam()} >Change Team</div>
                </div>
            }

            {
                loadSchedule || scheduleMap.lenght === 0 || teams.length === 0 ?
                    <div className={styles.loadSChedule}>
                        <ImSpinner9 size={66} color='#008461'></ImSpinner9>
                    </div>
                    :
                    <main className={styles.panel}>
                        <div className={styles.overflow}>

                            {
                                confirmSkip &&
                                <ModalConfirmSkip
                                    tipo={'sucesso'}
                                    titulo={modalConfirmTitle}
                                    texto={modalConfirmText}
                                    moveCardValues={moveCardValues}
                                    scheduleUpdate={scheduleUpdate}
                                    confirmAction={confirmAction.current}
                                    fecharModal={
                                        () => {
                                            setConfirmSkip(false);
                                            setCurrentCard(undefined);
                                            setLoadScheduleCard([]);
                                        }}
                                    currentCard={currentCard}
                                />
                            }

                            {
                                openModalAddNote &&
                                <ModalAddNote
                                    tipo={'sucesso'}
                                    titulo={modalConfirmTitle}
                                    texto={modalConfirmText}
                                    moveCardValues={moveCardValues}
                                    scheduleUpdate={scheduleUpdate}
                                    confirmAction={confirmAction.current}
                                    fecharModal={
                                        () => {
                                            setOpenModalAddNote(false);
                                            setCurrentCard(undefined);
                                            setLoadScheduleCard([]);
                                        }}
                                    currentCard={currentCard}
                                />
                            }

                            {
                                confirmDrag &&
                                <ModalConfirmDrag
                                    tipo={'sucesso'}
                                    titulo={modalConfirmTitle}
                                    texto={modalConfirmText}
                                    moveCardValues={moveCardValues}
                                    confirmAction={confirmAction.current}
                                    fecharModal={
                                        () => {
                                            setConfirmDrag(false);
                                            setCurrentCard(undefined);
                                            setLoadScheduleCard([]);
                                        }}
                                    currentCard={currentCard}
                                />
                            }

                            {
                                openModalAdd &&
                                <ModalAddSchedule
                                    tipo={'sucesso'}
                                    titulo={'Add Schedule'}
                                    texto={'Add Schedule'}
                                    defaultClient={selectedClient}
                                    oportuniId={oportuniID}
                                    fecharModal={
                                        () => {
                                            setOpenModalAdd(false);
                                            setCurrentCard(undefined);
                                            scheduleUpdate();
                                        }}
                                    currentCard={currentCard}
                                />
                            }
                            {
                                openModalEdit &&
                                <ModalEditSchedule
                                    tipo={'Edit'}
                                    titulo={'Schedule'}
                                    texto={'Edit Schedule'}
                                    defaultClient={selectedClient}
                                    oportuniId={oportuniID}
                                    fecharModal={
                                        () => {
                                            setOpenModalEdit(false);
                                            setCurrentCard(undefined);
                                            scheduleUpdate();
                                        }}
                                    currentCard={currentCard}
                                />
                            }

                            {
                                openModalView &&
                                <ModalViewSchedule
                                    tipo={'View'}
                                    titulo={'Schedule'}
                                    texto={'View Schedule'}
                                    defaultClient={selectedClient}
                                    oportuniId={oportuniID}
                                    fecharModal={
                                        () => {
                                            setOpenModalView(false);
                                            setCurrentCard(undefined);
                                        }}
                                    currentCard={currentCard}
                                />
                            }

                            {

                                openModalChangeTeam &&

                                <ModalChangeTeam
                                    selectedTeam={currentCard?.team}
                                    data={dates[0]}
                                />
                            }

                            {/* {
                                openModal &&
                                <ModalAddScheduleDay
                                    tipo={'sucesso'}
                                    titulo={'Add Schedule'}
                                    texto={'Add Schedule'}
                                    fecharModal={
                                        () => {
                                            setOpenModal(false);
                                            setCurrentCard(undefined);
                                            scheduleUpdate();
                                        }}
                                    currentCard={currentCard}
                                />
                            } */}

                            {
                                openAlerta &&
                                <Alerta
                                    texto="This operation is not allowed for the logged user."
                                    titulo="Not Authorized!"
                                    tipo="notAuthorized"
                                    heigth="90px"
                                    width="450px"
                                    fecharModal={() => setOpenAlerta(false)}
                                ></Alerta>
                            }

                            <div className={styles.scheduleContainer}>
                                <div className={styles.fixedHeader} style={{ width: `100%` }}>
                                    <div className={styles.rowAction}>
                                        <div className={styles.navigationArrows}>
                                            <ImArrowLeft color='008461' size={22} onClick={() => browseMonth(-1)} />
                                            <ImArrowRight color='008461' size={22} onClick={() => browseMonth(1)} />
                                            <span>{initialDate}</span>
                                            <img className={styles.addSchedule} src={addSchedule} onClick={() => { setCurrentCard(undefined); setOpenModalAdd(true) }} />

                                        </div>

                                        <div onClick={() => window.history.back()}>
                                            <FaRegWindowClose />
                                            <span><b>Schedule V1.13
                                            </b></span>
                                        </div>
                                    </div>

                                    <div className={styles.scheduleHeader}>

                                        {dates.map((dt) => {
                                            
                                            if(dt.getDay() === 0) return null;
                                            
                                            return (
                                            <div key={`dt${dt.getDay()}`} className={styles.scheduleBorders} style={{ color: dt.getMonth() !== selectedMonth ? '#ddd' : '' }}>{daysString[dt.getDay()]}
                                                <span>{dt.getDate()}</span>
                                            </div>
                                        )}
                                        )}

                                    </div>

                                </div>
                                {
                                    teams.map((team: TeamModel, indexTeam: number) => {

                                        if (filterTeamsRef.length) {

                                            let selected = filterTeamsRef.filter((t: TeamModel) => t.SAS_EQUIPE_ID === team.SAS_EQUIPE_ID);

                                            if (!selected.length) {
                                                return true;
                                            }
                                        }

                                        return (
                                            <div className={styles.scheduleBody} key={team.SAS_EQUIPE_ID} >
                                                {
                                                    dates.map((dt, indexDates) => {

                                                        if(dt.getDay() === 0)
                                                            return null;

                                                        return (

                                                            <div className={styles.scheduleBorders} key={`${indexDates}${team.SAS_EQUIPE_ID}`}>

                                                                {

                                                                    loadScheduleCard[`${team.SAS_EQUIPE_ID}${dt.toLocaleString()}`] === true ?

                                                                        <div className={styles.loadSCheduleCard} id="loaderSpinner">
                                                                            <ImSpinner9 size={26} color='#008461'></ImSpinner9>
                                                                        </div> :

                                                                        <div className={styles.scheduleDay}>

                                                                            {

                                                                                jobHours.map((hr: any, indexHours) => {

                                                                                    let data = dt.toLocaleString('pt-BR', { dateStyle: 'short' })
                                                                                    let equipeId = team.SAS_EQUIPE_ID
                                                                                    let sche: ScheduleFullModel | any = null
                                                                                    let scheList: ScheduleFullModel[] = []
                                                                                    let scheReworkList: Array<ScheduleFullModel> | null = null

                                                                                    if (scheduleMap[data] &&
                                                                                        scheduleMap[data][equipeId] &&
                                                                                        scheduleMap[data][equipeId][hr]) {

                                                                                        if (scheduleMap[data][equipeId][hr] === 'skiphour') {
                                                                                            return true;
                                                                                        }

                                                                                        scheList = scheduleMap[data][equipeId][hr];
                                                                                        sche = scheduleMap[data][equipeId][hr][0];

                                                                                    }

                                                                                    if (scheduleMap[data] &&
                                                                                        scheduleMap[data][equipeId] &&
                                                                                        scheduleMap[data][equipeId][startTimeForRework[hr]]) {

                                                                                        scheReworkList = scheduleMap[data][equipeId][startTimeForRework[hr]]
                                                                                    }

                                                                                    return (

                                                                                        <div key={`${indexTeam}${indexDates}${indexHours}`}>
                                                                                            {

                                                                                                sche && sche.SAS_SCHEDULE_STATUS !== 'Skip' ?

                                                                                                    scheList.map((sche: any, k) => (
                                                                                                        <div
                                                                                                            key={`${indexTeam}${indexDates}${indexHours}${k}`}
                                                                                                            onContextMenu={(event) => handleContextMenu(event, sche, team, dt, scheList.length > 1)}
                                                                                                            onClick={(event) => {
                                                                                                                openView(event, sche, team, dt);
                                                                                                            }}
                                                                                                            draggable={(scheList.length > 1 && !conflicstAuthorized) ? false : true}
                                                                                                            onDragStart={(e) => startDrag(e, sche)}
                                                                                                            className={styles.serviceCard}
                                                                                                            style={{
                                                                                                                border: `2px solid ${lineColor(sche, team)}`,
                                                                                                                backgroundColor: teamsMapColor[sche.SAS_EQUIPE_INICIAL_ID] || team.SAS_EQUIPE_COR,
                                                                                                                textDecoration: sche.SAS_SERVICE_UNDERLINE === 'Yes' ? 'underline' : 'normal',
                                                                                                                color: scheList.length > 1 ? '#990000' : sche.SAS_SERVICE_TEXT_COLOR,
                                                                                                                height: sche.size * 20 + (sche.size - 1) * 5,
                                                                                                                paddingLeft: sche.size > 1 ? 6 : ''
                                                                                                            }} >
                                                                                                            <span>
                                                                                                                <b style={sche.size > 1 ? { borderRadius: 12, border: `1px solid ${lineColor(sche, team)}` } : {}}>{indexHours + 1}</b>{sche.SAS_CLI_NOME_COMPLETO.substr(0, dropNumberCaracterName)}
                                                                                                            </span>
                                                                                                            <div className={styles.iconsContainer}>
                                                                                                                {

                                                                                                                    sche.SAS_SERVICE_FLAG === '' ?
                                                                                                                        (
                                                                                                                            <>
                                                                                                                                {sche.SAS_SINALIZADOR === 'recurrency' &&
                                                                                                                                    <AiFillTrademarkCircle size={'14px'}></AiFillTrademarkCircle>}

                                                                                                                                {sche.SAS_SINALIZADOR === 'moved' &&
                                                                                                                                    <FaExchangeAlt size={'14px'}></FaExchangeAlt>}

                                                                                                                                {sche.SAS_SINALIZADOR === '' &&
                                                                                                                                    <AiFillMediumCircle size={'14px'}></AiFillMediumCircle>}
                                                                                                                            </>
                                                                                                                        ) : (
                                                                                                                            <span className={styles.flagCustom}>{sche.SAS_SERVICE_FLAG}</span>

                                                                                                                        )
                                                                                                                }


                                                                                                                {sche.SAS_SCHEDULE_OBSERVA !== '' &&
                                                                                                                    <IoMail size={'14px'} onMouseOver={(event) => {
                                                                                                                        let message = `${dt.toLocaleString('en-US', { dateStyle: 'short' })} <br> client ${sche.SAS_CLI_NOME_COMPLETO} <br> ${sche?.SAS_SCHEDULE_OBSERVA}`;
                                                                                                                        openMessagePopover(event, message)
                                                                                                                    }}></IoMail>
                                                                                                                }


                                                                                                                {
                                                                                                                    scheList.length > 1 &&
                                                                                                                    <CgDanger size={'14px'} color="#990000"></CgDanger>
                                                                                                                }
                                                                                                                <span>{sche.SAS_SCHEDULE_HRINICIO} </span>
                                                                                                            </div>

                                                                                                        </div>

                                                                                                    ))

                                                                                                    :
                                                                                                    <div
                                                                                                        key={`${indexTeam}${indexDates}${indexHours}`}
                                                                                                        onClick={() => openModalScheduleAddCurrentCard(team, dt, hr, sche)}
                                                                                                        onDragOver={dragOver}
                                                                                                        onDrop={(event) => drop(event, team, dt, hr)}
                                                                                                        className={`${styles.serviceCardEmpty} ${styles.serviceCard} ${sche && sche.SAS_SCHEDULE_STATUS === 'Skip' ? styles.emptyCardSkip : ''}`}
                                                                                                        style={{ border: `2px solid ${team.SAS_EQUIPE_COR}` }}>
                                                                                                        <span><b>{indexHours + 1}</b></span>

                                                                                                        <div className={styles.iconsContainer}>

                                                                                                            {sche && sche.SAS_SCHEDULE_STATUS === 'Skip' &&
                                                                                                                <IoArrowRedoSharp size={'12px'} onMouseOver={(event) => {
                                                                                                                    let message = `skiped on ${dt.toLocaleString('en-US', { dateStyle: 'short' })} <br> client ${sche.SAS_CLI_NOME_COMPLETO} <br> ${sche?.SAS_SCHEDULE_OBSERVA}`;
                                                                                                                    openMessagePopover(event, message)
                                                                                                                }}>
                                                                                                                </IoArrowRedoSharp>
                                                                                                            }
                                                                                                            <span>{hr}</span>

                                                                                                        </div>
                                                                                                    </div>

                                                                                            }

                                                                                            {
                                                                                                scheReworkList?.map((scheRework: any) => (
                                                                                                    <div
                                                                                                        key={`${indexTeam}${indexDates}${scheRework.SAS_SCHEDULE_HRINICIO}`}
                                                                                                        onContextMenu={(event) => handleContextMenu(event, scheRework, team, dt)}
                                                                                                        onClick={(event) => {
                                                                                                            openView(event, scheRework, team, dt);
                                                                                                        }}
                                                                                                        draggable="false"
                                                                                                        className={styles.serviceCard}
                                                                                                        style={{
                                                                                                            border: `2px solid ${lineColor(scheRework, team)}`,
                                                                                                            backgroundColor: team.SAS_EQUIPE_COR,
                                                                                                            textDecoration: scheRework.SAS_SERVICE_UNDERLINE === 'Yes' ? 'underline' : 'normal',
                                                                                                            color: '#FFFFFF',
                                                                                                            height: 20,
                                                                                                        }} >
                                                                                                        <span style={{ paddingLeft: '20px' }}>
                                                                                                            {scheRework.SAS_CLI_NOME_COMPLETO.substr(0, dropNumberCaracterName)}
                                                                                                        </span>
                                                                                                        <div className={styles.iconsContainer}>

                                                                                                            {
                                                                                                                scheRework.SAS_SINALIZADOR === 'rework' ?
                                                                                                                    <IoIosCodeWorking size={'14px'}></IoIosCodeWorking>
                                                                                                                    :
                                                                                                                    <BsBookmarkPlus size={'14px'}></BsBookmarkPlus>
                                                                                                            }


                                                                                                        </div>

                                                                                                    </div>
                                                                                                ))




                                                                                            }

                                                                                        </div>

                                                                                    )


                                                                                })

                                                                            }

                                                                        </div>

                                                                }

                                                                <div className={styles.serviceTeam} onContextMenu={(event) => handleContextTeamMenu(event, dt, team)}>



                                                                    {

                                                                        team.equipePessoas.map((pt) => {

                                                                            let selectedChangePerson = false;
                                                                            let nameSelectedChangePerson = "";

                                                                            changedTeams.map((changedTeam) => {
                                                                                if (changedTeam.SAS_EQUIPE_ID !== team.SAS_EQUIPE_ID) return true;

                                                                                if (pt.pessoa.WC_FORNECEDOR_COD !== changedTeam.SAS_EQUIPES_SUBS_ORI) return true;

                                                                                //console.log(changedTeam?.dateStart && dt >= changedTeam.dateStart && changedTeam?.dateEnd && dt <= changedTeam.dateEnd)
                                                                                if (changedTeam?.dateStart && dt >= changedTeam.dateStart && changedTeam?.dateEnd && dt <= changedTeam.dateEnd) {
                                                                                    /* pt.changedColor = true;
                                                                                    pt.pessoa.WC_FORNECEDOR_COD = changedTeam.SAS_EQUIPES_SUBS;
                                                                                    pt.pessoa.WC_GEN_RAZAO = changedTeam.WC_GEN_RAZAO; */
                                                                                    selectedChangePerson = true;
                                                                                    nameSelectedChangePerson = changedTeam.WC_GEN_RAZAO.split(' ')[0]
                                                                                }
                                                                            })

                                                                            return (

                                                                                pt.SAS_EQUIPE_PESSOAS_TIPO === 'Supervisor' ?
                                                                                    <div key={`${pt?.WC_FORNECEDOR_COD}`} style={{ display: "inline", color: selectedChangePerson ? '#e84b40' : 'inherit' }}><RiVipCrownFill color={'#F7D82F'} />{selectedChangePerson ? nameSelectedChangePerson : pt.pessoa?.WC_GEN_RAZAO.split(' ')[0]}&nbsp;</div>
                                                                                    :
                                                                                    <div key={`${pt?.WC_FORNECEDOR_COD}`} style={{ display: "inline", color: selectedChangePerson ? '#e84b40' : 'inherit' }}><RiUserFill color={'#000000'} /> {selectedChangePerson ? nameSelectedChangePerson : pt.pessoa?.WC_GEN_RAZAO.split(' ')[0]}&nbsp;</div>
                                                                            )

                                                                        })
                                                                    }

                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    )
                                                }

                                            </div>
                                        )
                                    })
                                }

                            </div>

                            <div className={styles.filter}>

                                <FaFilter color="#616161" size={32} onClick={() => setSizeFilter(0)} />

                                {
                                    weeksNavigator?.map((week) => (
                                        <div key={`${week.legend}`}>
                                            <span className={styles.weekLegend}>{week.legend}</span>
                                            {dates.some(d => d.getDate() === week.initialDay && d.getMonth() === selectedMonth) ?
                                                <FaDotCircle color="#01c293" size={22} />
                                                :
                                                <FaDotCircle onClick={() => browseWeek(week.initialDay)} color="#dedede" size={22} />
                                            }
                                        </div>
                                    ))
                                }
                                <div></div>

                            </div>

                        </div>
                    </main>
            }

        </main>

    );
}