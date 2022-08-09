import ClientModel from "../../Models/client";
import { v4 as uuidv4 } from 'uuid';
import api from "../api/api";
import CONSTANTS from "../../constants";
import { AxiosResponse } from "axios";
import EmailModel from "../../Models/email";

const PROCESS = 'SAS_EMAIL';

const EmailService = {

    save: (id: string, email: EmailModel , tipo: string = 'INCLUIR') => {

        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api/transaction/?processo=${PROCESS}` +
            `&opcao=${tipo}` +
            `&SAS_CLI_ID=${id}` +
            `&SAS_EMAIL_TIPO=${email.SAS_EMAIL_TIPO}` +
            `&SAS_EMAIL_SEQUENCIA=${email.SAS_EMAIL_SEQUENCIA}` +
            `&SAS_EMAIL_ENDERECO=${email.SAS_EMAIL_ENDERECO}` +
            `&idproc=0` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;
            
        return api.get(CONSTANTS.IP + url)
            .then((result: AxiosResponse<any>) => {
                return result.data
            })
    },

    delete: (SAS_CLI_ID: string) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

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


export default EmailService;