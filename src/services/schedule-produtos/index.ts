import { AxiosResponse } from "axios";
import CONSTANTS from "../../constants";
import HttpObjectModel from "../../Models/http";

import ScheduleProduto from "../../Models/schedule-produto";

import api from "../api/api";

const PROCESSO = 'SAS_SCHEDULE_PROD';


const ScheduleProdutoService= {

    save: async (schedule: ScheduleProduto, tipo: string = 'INCLUIR') => {

        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api/transaction/?processo=${PROCESSO}` +
            `&opcao=${tipo}` +
            `&SAS_SCHEDULE_ID=${schedule.SAS_SCHEDULE_ID}` +
            `&WC_PRODUTO_COD=${schedule.WC_PRODUTO_COD}` +
            `&WC_PRODUTO_DESC=${schedule.WC_PRODUTO_DESC}` +
            `&SAS_SERVICE_DURACAO=${schedule.SAS_SERVICE_DURACAO}` +
            `&SAS_SCHEDULE_PROD_ID=${schedule.SAS_SCHEDULE_PROD_ID}` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;


        return api.get(encodeURI(CONSTANTS.IP + url))
            .then((result: AxiosResponse<any>) => {
                console.log(result.data)
            })

    },



    getAll: async (ScheduleId: string, navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api?type=data&processo=${PROCESSO}&filbrw=SAS_SCHEDULE_ID=(${ScheduleId})&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;
        
        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ScheduleProduto>}>) => {

                    if(retorno.data && retorno.data.dados) {

                        return retorno.data.dados.totalreg === 0 ? [] : retorno.data.dados.consulta

                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },





}


export default ScheduleProdutoService; 