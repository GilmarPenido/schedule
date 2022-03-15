import { MouseEventHandler } from 'react';
import './styles.css';

import  checked from '../../assets/checked.png';
import  errorAlert from '../../assets/error-alert.png';

interface Iprops{
    fecharModal: MouseEventHandler<HTMLDivElement>
    tipo: string
    titulo: string
    texto: string
}


export default function Alerta(props: Iprops) {


    return (
        <div className="container-alerta">

            <div className="modal-alerta">

                <div className="corpo-alerta">
                        {
                            props.tipo === "sucesso" ?
                            <div className="modal-sucesso">
                                <img src={checked} alt="checked"/>
                                <h1 className="">Sucesso!</h1>
                            </div>
                            :

                            <div className="modal-erro">
                                <img src={errorAlert} alt="checked"/>
                                <h1 className="">Erro!</h1>
                            </div>

                        }

                        <p><b>{props.titulo}</b></p>
                        <p>{props.texto}</p>

                </div>

                <div className="modal-fechar" onClick={props.fecharModal}>
                    <svg>
                        <path stroke="white" stroke-width="3" fill="none" d="M6.25,6.25,25,25" />
                        <path stroke="white" stroke-width="3" fill="none" d="M6.25,25,25,6.25" />
                    </svg>
                </div>
            </div>
            
        </div>
    )

}