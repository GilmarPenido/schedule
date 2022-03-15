import styles from './styles.module.css';
import addSchedule from '../../assets/add_schedule.png';
import { FaRegWindowClose } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface Iprops {
    fecharModal: any
    tipo: string
    titulo: string
    texto: string
    currentCard: any
    moveCardValues: any
    scheduleUpdate: any
    confirmAction: any
}

export default function ModalAddNote(props: Iprops) {

    const [text, setText ] = useState('');

    useEffect(() => {
        setText(props.currentCard?.SAS_SCHEDULE_OBSERVA);
    }, [])

    return (
        <div className={styles.containerSchedule}>


            <div style={{position: 'relative', width: '100%', height: '100%'}}>

                <div className={styles.modalSchedule}>
 
                    <div className={styles.corpoSchedule}>

                        <div className={styles.modalScheduleHeader}>
                            <img src={addSchedule} alt="Add Schedule" />
                            <b> &nbsp;&nbsp;{props.titulo}</b>
                        </div>
                    </div>

                    <div className={styles.modalFechar}>
                        <div onClick={() => props.fecharModal()}>
                            <FaRegWindowClose></FaRegWindowClose>
                        </div>
                    </div>

                    <p>{props.texto}</p>

                    <p>Add Note</p>
                    <textarea  
                        onChange={(event) => {setText(event.target.value);}} rows={3} 
                        value={text} 
                        name="motivationSkip" 
                        maxLength={150} 
                        style={{width: '100%', resize: 'none', padding: '10px', borderRadius: '15px'}} 
                    ></textarea>

                    <div className={styles.modalAction}>
                        <button className={`${styles.btnAction} btn btn-confirm`} onClick={() => { props.confirmAction(text) }}>Confirm &nbsp;</button>
                    </div>


                </div>

            </div>

        </div>
    )

}