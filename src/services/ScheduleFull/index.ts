import { AxiosResponse } from "axios";
import { GiConsoleController } from "react-icons/gi";
import CONSTANTS from "../../constants";
import HttpObjectModel from "../../Models/http";
import ScheduleFullModel from "../../Models/ScheduleFull";
import TeamModel from "../../Models/team/intex";
import api from "../api/api";

const PROCESSO = 'SAS_SCHEDULE_FULL';
const PAGE_ID = 'SCHEDULE_FULL';

const ScheduleFullService= {

    getAllOld: async (dataIni: string, dataEnd: string, navpage: number = 0, maxreg: number = 1000) => {
        let usr = 'admin';
        let psw = 'admin';

        let url = `api?type=data&processo=${PROCESSO}&filbrw=SAS_SCHEDULE_DATA between (${dataIni}) and (${dataEnd})&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;
        
        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ScheduleFullModel>}>) => {

                    if(retorno.data && retorno.data.dados) {

                        return retorno.data.dados.totalreg === 0 ? [] : retorno.data.dados.consulta

                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },

    getAll: async (dataIni: string, dataEnd: string, navpage: number = 0, maxreg: number = 1000) => {

        let variables = `&dataIni=${dataIni}&dataFim=${dataEnd}`;
        let url = `${CONSTANTS.IP}${CONSTANTS.PAGE_HTML5}${PAGE_ID}${variables}`;

        return api.get(url)
        .then(
            (retorno: AxiosResponse<ScheduleFullModel[]>) => { 
                
                let scheduleFull = retorno.data.map( (schedule: any) => {


                    //schedule.SAS_CLI_ID = schedule.SAS_CLI_ID == 'null' ? '' :  schedule.SAS_CLI_ID;
                    

                    schedule.SAS_SERVICE_DURACAO = parseInt(schedule.SAS_SERVICE_DURACAO);
                    schedule.SAS_EQUIPE_ID =  parseInt(schedule.SAS_EQUIPE_ID);
                    schedule.WC_CLIENTE_COD = parseInt(schedule.WC_CLIENTE_COD);
                    schedule.WC_PRODUTO_COD = parseInt(schedule.WC_PRODUTO_COD);
                    schedule.SAS_PROP_ID = parseInt(schedule.SAS_PROP_ID);
                    schedule.SAS_EQUIPE_ID = parseInt(schedule.SAS_EQUIPE_ID);
                    schedule.SAS_EQUIPE_INICIAL_ID = parseInt(schedule.SAS_EQUIPE_INICIAL_ID);


                    let year  = schedule.SAS_SCHEDULE_DATA.substring(0,4);
                    let month  = schedule.SAS_SCHEDULE_DATA.substring(4,6);
                    let day  = schedule.SAS_SCHEDULE_DATA.substring(6,8);
                    schedule.SAS_SCHEDULE_DATA = `${day}/${month}/${year}`;

                    if(schedule?.SAS_SCHEDULE_END_DATE) {
                        let year  = schedule.SAS_SCHEDULE_END_DATE.substring(0,4);
                        let month  = schedule.SAS_SCHEDULE_END_DATE.substring(4,6);
                        let day  = schedule.SAS_SCHEDULE_END_DATE.substring(6,8);
                        schedule.SAS_SCHEDULE_END_DATE = `${day}/${month}/${year}`;
                    }

                    if(schedule?.SAS_SCHEDULE_START_DATE) {
                        let year  = schedule.SAS_SCHEDULE_START_DATE.substring(0,4);
                        let month  = schedule.SAS_SCHEDULE_START_DATE.substring(4,6);
                        let day  = schedule.SAS_SCHEDULE_START_DATE.substring(6,8);
                        schedule.SAS_SCHEDULE_START_DATE = `${day}/${month}/${year}`;
                    }

                    return schedule;
                })

                return scheduleFull;
                
            })
        .catch( err => {
            console.log(err);
            return [];
        })
    },
}


export default ScheduleFullService;