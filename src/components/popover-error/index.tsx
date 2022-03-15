import { MouseEventHandler } from 'react';
import styles from './styles.module.css';

import checked from '../../assets/checked.png';
import errorAlert from '../../assets/error-alert.png';

interface Iprops {
    fecharModal: MouseEventHandler<HTMLDivElement>
    tipo: string
    titulo: string
    texto: string
}


export default function PopoverError(props: Iprops) {


    return (

        <div className={styles.containerAlerta}>
            <div className={styles.modalAlerta}>

                <div className={styles.corpoAlerta}>
                    {
                        props.tipo === "sucesso" ?
                            <div className="modal-sucesso">
                                <img src={checked} alt="checked" />
                                <div>
                                    <p><b>{props.titulo}</b></p>
                                    <p>{props.texto}</p>
                                </div>
                            </div>
                            :

                            <div className={styles.modalErro}>
                                <img src={errorAlert} alt="checked" />
                                <div>
                                    <p><b>{props.titulo}</b></p>
                                    <p>{props.texto}</p>
                                </div>
                            </div>

                    }



                </div>

                <div className={styles.modalFechar} onClick={props.fecharModal}>
                    <svg>
                        <path stroke="white" stroke-width="3" fill="none" d="M6.25,6.25,25,25" />
                        <path stroke="white" stroke-width="3" fill="none" d="M6.25,25,25,6.25" />
                    </svg>
                </div>
            </div>
        </div>
    )

}