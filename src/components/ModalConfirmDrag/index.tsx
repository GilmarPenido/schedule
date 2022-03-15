import styles from './styles.module.css';
import addSchedule from '../../assets/add_schedule.png';
import { FaRegWindowClose } from 'react-icons/fa';

interface Iprops {
    fecharModal: any
    tipo: string
    titulo: string
    texto: string
    currentCard: any
    moveCardValues: any
    confirmAction: any
}

export default function ModalConfirmDrag(props: Iprops) {

    return (
        <div className={styles.containerSchedule}>

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

                <div className={styles.modalAction}>
                    <button className={`${styles.btnAction} btn btn-confirm`} onClick={() => { props.confirmAction() }}>Confirm &nbsp;</button>
                </div>


            </div>
        </div>
    )

}