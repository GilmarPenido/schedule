import React, { ChangeEvent, useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { RiUserFill, RiVipCrownFill } from "react-icons/ri";
import TeamModel from "../../Models/team/intex";
import PeopleService from "../../services/people";
import PeopleTeamService from "../../services/people-team";
import ServiceDetailsService from "../../services/service-details";
import TeamService from "../../services/team";
import styles from "./styles.module.css";

export default function Filter(
    {
        children,
        setSizeFilter,
        sizeFilter,

        filterServiceRef,
        setFilterServiceRef,

        filterClientRef,
        setFilterClientRef,

        filterTeamsRef,
        setFilterTeamsRef,

        filterDate,
        setFilterDate,
    }:
    {
        children: any
        setSizeFilter: any,
        sizeFilter: any,

        filterServiceRef: any,
        setFilterServiceRef: any,

        filterClientRef: any,
        setFilterClientRef: any,

        filterTeamsRef: any,
        setFilterTeamsRef: any,

        filterDate: string,
        setFilterDate: any,
    }) {

    const [teams, setTeams] = useState<TeamModel[]>([]);

    const [services, setServices] = useState<{
        value: string | undefined;
        label: string | undefined;
    }[]>();
    const [clients, setClients] = useState<{
        value: string | undefined;
        label: string | undefined;
    }[]>();

 /*    useEffect(() => {
        ServiceDetailsService
            .getAll()
            .then(services => {
                let serv =
                    services.consulta.map(s => ({
                        value: s.WC_PRODUTO_COD,
                        label: s.WC_PRODUTO_DESC,
                        duration: s.SAS_SERVICE_DURACAO
                    }));

                setServices(serv);
            })
    }, []) */

/*     useEffect(() => {
        ClientService
            .getAll()
            .then(data => {
                let client =
                    data.consulta.map(c => ({
                        value: c.WC_CLIENTE_COD,
                        label: `${c.SAS_CLI_PRIMEIRO_NOME} ${c.SAS_CLI_SOBRENOME}`
                    }))

                setClients(client);
            })
    }, []) */

    useEffect(() => {
        getTeam();
    }, [])

    function closeFilter() {
        setSizeFilter(300);
    }

    function handleService(value: any) {
        setFilterServiceRef(value.value);
    }

    function handleClient(value: any) {
        setFilterClientRef(value.value);
    }

    function handleTeam(event: ChangeEvent<HTMLInputElement>, team: TeamModel) {

        if (event.target.checked) {
            setFilterTeamsRef([...filterTeamsRef, team]);
        } else {
            let teams = filterTeamsRef.filter((t: TeamModel) => {
                return team.SAS_EQUIPE_ID !== t.SAS_EQUIPE_ID
            });

            setFilterTeamsRef(teams);
        }
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
        setTeams(team);

    }

    function handlefilterDate(event: ChangeEvent<HTMLInputElement>) {
        setFilterDate(event.target.value)
    }

    return (
        <aside className={styles.filterContainer} style={
            {
                right: -sizeFilter,
                boxShadow: sizeFilter === 0 ? '-5px 0px 30px rgb(138, 138, 138)' : ''
            }
        }>

            <div className={styles.filterHeader}>
                <div className={styles.filterHeaderLabel}>
                    <FaFilter size="12px" color="white"></FaFilter>
                    <span>Filter</span>
                </div>
                <div className={styles.filterHeaderClose}>
                    <IoCloseSharp onClick={closeFilter}></IoCloseSharp>
                </div>
                <div>
                </div>
            </div>

            <div className={styles.filterBody}>

                <div className={styles.inputGroup}>
                    <label>Go To</label>

                    <input type="date" className={styles.inputControl}  value={filterDate} onChange={handlefilterDate}/>

                </div>

                {/* <div className={styles.inputGroup}>
                    <label>Services</label>

                    <Select
                        required
                        options={services}
                        placeholder='Select service'
                        onChange={handleService} />

                </div>

                <div className={styles.inputGroup}>
                    <label>Persons</label>
                    <Select
                        required
                        placeholder='Select Client'
                        options={clients}
                        onChange={handleClient} />
                </div> */}

                <div className={styles.inputGroup}>
                    <label>Teams</label>
                    {
                        teams.map((t: TeamModel, key: number) => (
                            <div className={styles.teamContainer} key={`${key}`}>
                                <div className={styles.teamGroup}>
                                    <input type="checkbox" onChange={(event) => handleTeam(event, t)} />
                                    <div className={styles.serviceTeam}>
                                        {
                                            t?.equipePessoas.map(ep => (
                                                ep.SAS_EQUIPE_PESSOAS_TIPO === 'Coordenador' ?
                                                    <div key={ep.WC_FORNECEDOR_COD}><RiVipCrownFill color={'#F7D82F'} /> {ep.pessoa.WC_GEN_RAZAO.split(' ')[0]}&nbsp;</div> :
                                                    <div key={ep.WC_FORNECEDOR_COD}><RiUserFill color={'#000000'} /> {ep.pessoa.WC_GEN_RAZAO.split(' ')[0]}&nbsp;</div>
                                            ))
                                        }
                                    </div>

                                </div>
                            </div>
                        )

                        )
                    }

                </div>




            </div>

        </aside>
    )
}