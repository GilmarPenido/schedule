import React, { useEffect, useState } from 'react';
import ChangeTeamModel from '../../Models/change-team';
import ChangeTeamService from '../../services/change-team';
import styles from './styles.module.css';

interface ModalChangeTeamProps {
    selectedTeam: any
    data: Date
};

export default function ModalChangeTeam(props : ModalChangeTeamProps) {

    const [changedTeams, setChangedTeams] = useState<ChangeTeamModel[]>([]);


    useEffect(() => {

        console.log(props.selectedTeam);

        ChangeTeamService.getAll(props.data, props.selectedTeam.SAS_EQUIPE_ID)
            .then(response => {
                setChangedTeams(response);
            })

    }, []);

    return (
        <div className={styles.modalContent}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Change Team - {props.selectedTeam.SAS_EQUIPE_DESCRI}</h3>
                    <h4>{props.selectedTeam.equipePessoas.map( (p: any, index: number) => (<span  key={`${index}p`}>{p?.descWC_FORNECEDOR_COD}</span>))}</h4>
                </div>
                <div className={styles.modalBody}>

                    <table>
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Players</th>
                            </tr>
                        </thead>
                        <tbody>
                            {changedTeams.map( (team , index)=> (
                            <tr key={`${index}`}>
                                <td>{team.SAS_EQUIPES_SUBS}</td>
                                <td></td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );


}