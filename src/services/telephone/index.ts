import ClientModel from "../../Models/client";
import { v4 as uuidv4 } from 'uuid';
import api from "../api/api";
import CONSTANTS from "../../constants";
import { AxiosResponse } from "axios";
import TelephoneModel from "../../Models/telephone";

const PROCESS = 'SAS_TEL';

const TelephoneService = {

    save: (id: string, telephone: TelephoneModel ,tipo: string = 'INCLUIR') => {

        let usr = 'admin';
        let psw = 'admin';

        let url = `api/transaction/?processo=${PROCESS}` +
            `&opcao=${tipo}` +
            `&SAS_CLI_ID=${id}` +
            `&SAS_TEL_SEQUENCIA=${telephone.SAS_TEL_SEQUENCIA}` +
            `&SAS_TEL_NUMERO=${telephone.SAS_TEL_NUMERO}` +
            `&SAS_TEL_TIPO=${telephone.SAS_TEL_TIPO}` +
            `&idproc=0` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;

            console.log(CONSTANTS.IP + url)
            
        return api.get(CONSTANTS.IP + url)
            .then((result: AxiosResponse<any>) => {
                return result.data
            })
    },

    delete: (SAS_CLI_ID: string) => {
        let usr = 'admin';
        let psw = 'admin';

        let url = `api/transaction/?processo=${PROCESS}` +
            `&opcao=EXCLUIR` +
            `&SAS_CLI_ID=${SAS_CLI_ID}` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;
            
        return api.get(CONSTANTS.IP + url)
            .then((result: AxiosResponse<any>) => {
                return result.data
            })
    },

}


export default TelephoneService;