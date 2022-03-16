import React from 'react';
import styles from './styles.module.css';

export default function ModalChangeTeam() {

    return (
        <div className={styles.modalContent}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Change Team</h3>
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
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );


}