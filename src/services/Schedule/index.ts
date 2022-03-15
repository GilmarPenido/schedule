import { AxiosResponse } from "axios";
import CONSTANTS from "../../constants";
import HttpObjectModel from "../../Models/http";
import ScheduleModel from "../../Models/Schedule";
import ScheduleFullModel from "../../Models/ScheduleFull";
import TeamModel from "../../Models/team/intex";
import api from "../api/api";

const PROCESSO = 'SAS_SCHEDULE';
const PAGE_ID = 'SCHEDULE_ACTIONS';
const PAGE_ID_DEL_BATCH = 'SCHEDULE_DEL_RECURRE';

const ScheduleService= {

    update: async (id: string, team: TeamModel, dt: Date, hr:string, card: ScheduleFullModel, sinalizador: string = '', endHour: string) => {
        let usr = 'admin';
        let psw = 'admin';


        let data = dt.toLocaleString('pt-br', {dateStyle:'short'});

        let url = `api/transaction/?processo=${PROCESSO}` +
            `&opcao=ALTERAR` +
            `&WC_CLIENTE_COD=${id}` +
            `&SAS_SCHEDULE_ID=${card.SAS_SCHEDULE_ID}` +
            `&SAS_EQUIPE_ID=${team.SAS_EQUIPE_ID}` +
            `&SAS_SCHEDULE_DATA=${data}` +
            `&SAS_SCHEDULE_HRINICIO=${hr}` +
            `&SAS_SCHEDULE_HRFIM=${endHour ? endHour : card.SAS_SCHEDULE_HRFIM}` +
            `&idproc=0` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;
            
            url = sinalizador !== '' ?  url + `&SAS_SINALIZADOR=${sinalizador}` : url;

        return api.get(CONSTANTS.IP + url)
            .then((result: AxiosResponse<any>) => {
                //console.log(result.data)
            })
    },


    saveBatch: async (schedules: ScheduleModel[], tipo: string = 'INCLUIR') => {


        schedules = schedules.map(s => {

            s.SAS_SERVICE_NOME = s.SAS_SERVICE_NOME ?? '';
            s.SAS_CLI_NOME_COMPLETO = s.SAS_CLI_NOME_COMPLETO ?? '';
            s.COD_USUARIO = s.COD_USUARIO ?? '';
            s.SAS_SCHEDULE_INICIO_SERV = s.SAS_SCHEDULE_INICIO_SERV ??  '';
            s.SAS_SCHEDULE_FIM_SERV = s.SAS_SCHEDULE_FIM_SERV ?? '';
            s.SAS_SCHEDULE_LOCG_INI = s.SAS_SCHEDULE_LOCG_INI ?? '';
            s.SAS_SCHEDULE_LOCG_FIM = s.SAS_SCHEDULE_LOCG_FIM ?? '';
            s.SAS_SCHEDULE_CHKOUT_COM = s.SAS_SCHEDULE_CHKOUT_COM ?? '';
            s.SAS_SCHEDULE_CHKOUT_COM_TEXT = s.SAS_SCHEDULE_CHKOUT_COM_TEXT ?? '';
            s.SAS_SCHEDULE_HORA_CHK_INF = s.SAS_SCHEDULE_HORA_CHK_INF ?? '';
            s.SAS_SCHEDULE_HORA_CHO_IN = s.SAS_SCHEDULE_HORA_CHO_IN ?? '';

            return s
        })


        let variables = `tipo=${tipo}`;
        schedules.forEach((schedule: ScheduleModel) => {
            variables = variables + `&schedules[]=${JSON.stringify(schedule)}`;
        })

        let url = `${CONSTANTS.IP}${CONSTANTS.PAGE_HTML5}${PAGE_ID}`;

        return api.post(url, variables)
        .then(console.log);
    },

    save: async (schedule: ScheduleModel, tipo: string = 'INCLUIR') => {

        let usr = 'admin';
        let psw = 'admin';

        let url = `api/transaction/?processo=${PROCESSO}` +
            `&opcao=${tipo}` +
            `&SAS_SCHEDULE_ID=${schedule.SAS_SCHEDULE_ID}` +
            `&WC_CLIENTE_COD=${schedule.WC_CLIENTE_COD}` +
            //`&SAS_CLI_NOME_COMPLETO=${schedule.SAS_CLI_NOME_COMPLETO}` +
            `&SAS_EQUIPE_ID=${schedule.SAS_EQUIPE_ID}` +
            `&SAS_SCHEDULE_DATA=${schedule.SAS_SCHEDULE_DATA}` +
            `&SAS_SCHEDULE_HRINICIO=${schedule.SAS_SCHEDULE_HRINICIO}` +
            `&SAS_SCHEDULE_HRFIM=${schedule.SAS_SCHEDULE_HRFIM}` +
            `&SAS_SCHEDULE_OBSERVA=${schedule.SAS_SCHEDULE_OBSERVA}` +
            `&SAS_SCHEDULE_STATUS=${schedule.SAS_SCHEDULE_STATUS}` +
            `&SAS_EQUIPE_INICIAL_ID=${schedule.SAS_EQUIPE_ID}` +
            `&WC_PRODUTO_COD=${schedule.WC_PRODUTO_COD}` +
            `&SAS_PROP_ID=${schedule.SAS_PROP_ID}` +
            `&SAS_SINALIZADOR=${schedule.SAS_SINALIZADOR}` +
            `&idproc=0` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;

        if(tipo === 'INCLUIR') {

            url = url + 
            `&WF_OPORTUNI_ID=${schedule.WF_OPORTUNI_ID}`+
            `&SAS_SCHEDULE_START_DATE=${schedule.SAS_SCHEDULE_START_DATE}`+
            `&SAS_SCHEDULE_END_DATE=${schedule.SAS_SCHEDULE_END_DATE}`+
            `&SAS_SCHEDULE_EVERY=${schedule.SAS_SCHEDULE_EVERY}`+
            `&SAS_SCHEDULE_FREQUENCY=${schedule.SAS_SCHEDULE_FREQUENCY}`+
            `&SAS_SCHEDULE_WEEK_DAY=${schedule.SAS_SCHEDULE_WEEK_DAY}`;

        }

        return api.get(CONSTANTS.IP + url)
            .then((result: AxiosResponse<any>) => {
                console.log(result.data)
            })

    },


    getFilter: async (schedule: ScheduleModel, navpage: number = 0, maxreg: number = 1) => {

        let usr = 'admin';
        let psw = 'admin';

        let url = `api?type=data&processo=${PROCESSO}&filbrw=SAS_PROP_ID=(${schedule.SAS_PROP_ID}) AND WC_CLIENTE_COD=(${schedule.WC_CLIENTE_COD}) AND SAS_SCHEDULE_HRINICIO=(${schedule.SAS_SCHEDULE_HRINICIO}) AND WC_PRODUTO_COD=(${schedule.WC_PRODUTO_COD}) AND SAS_EQUIPE_ID=(${schedule.SAS_EQUIPE_ID}) AND SAS_SCHEDULE_START_DATE=${schedule.SAS_SCHEDULE_START_DATE?.split('/').reverse().join('')} AND SAS_SCHEDULE_END_DATE=${schedule.SAS_SCHEDULE_END_DATE?.split('/').reverse().join('')}&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url)
            .then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ScheduleModel>}>) => {

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
        let usr = 'admin';
        let psw = 'admin';

        let url = `api?type=data&processo=${PROCESSO}&filbrw=SAS_SCHEDULE_DATA between (${dataIni}) and (${dataEnd})&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;
        
        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ScheduleModel>}>) => {

                    if(retorno.data && retorno.data.dados) {

                        return retorno.data.dados.totalreg === 0 ? [] : retorno.data.dados.consulta

                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },

    async delete(scheduleId: string){

        let usr = 'admin';
        let psw = 'admin';

        let url = `api/transaction/?processo=${PROCESSO}` +
            `&opcao=ALTERAR` +
            `&SAS_SCHEDULE_ID=${scheduleId}` +
            `&SAS_SCHEDULE_STATUS=Canceled` +
            `&VALIDA_INI=true` +
            `&idproc=` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;
            
            return api.get(CONSTANTS.IP + url)
            .then((result: AxiosResponse<any>) => {
                return result.data
            })

    },


    async deleteAll(schedule: ScheduleModel){

        let startDate = schedule.SAS_SCHEDULE_START_DATE?.split('/').reverse().join('');
        let endDate = schedule.SAS_SCHEDULE_END_DATE?.split('/').reverse().join('');

        let variables = `&clientCod=${schedule.WC_CLIENTE_COD}&equipeId=${schedule.SAS_EQUIPE_ID}&status=${schedule.SAS_SCHEDULE_STATUS}&produtoCod=${schedule.WC_PRODUTO_COD}&startDate=${startDate}&endDate=${endDate}&propId=${schedule.SAS_PROP_ID}`;
        let url = `${CONSTANTS.IP}${CONSTANTS.PAGE_HTML5}${PAGE_ID_DEL_BATCH}${variables}`;
        api.get(url)
        .then(console.log);
    }
}


export default ScheduleService 