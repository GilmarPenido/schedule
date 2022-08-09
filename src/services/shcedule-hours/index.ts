import { AxiosResponse } from "axios";
import CONSTANTS from "../../constants";
import HttpObjectModel from "../../Models/http";
import ServiceDetailsModel from "../../Models/service-details";
import api from "../api/api";


const PROCESSO = 'SAS_SCHEDULE_HRVALID';
const ScheduleHoursValid= {



    getAll: async (navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api?type=data&processo=${PROCESSO}&filbrw=&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<{SAS_SCHEDULE_HORA_VALIDA: string}>}>) => {

                    if(retorno.data && retorno.data.dados) {

                        let sortedHours = retorno.data.dados.consulta.map( retorno => retorno.SAS_SCHEDULE_HORA_VALIDA)

                        sortedHours.sort((a, b) => {

                            let isFirstAntMeridian = !!a.match('am');
                            let isSecondAntMeridian = !!b.match('am');

                            let firstHours = parseInt(a.substring(0,2));
                            let secondHours = parseInt(b.substring(0,2));

                            if( isFirstAntMeridian && !isSecondAntMeridian ) {
                                return -1;
                            }

                            if ( !isFirstAntMeridian && isSecondAntMeridian ) {
                                return 1;
                            }

                            if (firstHours < secondHours ) {
                                return -1
                            } else {
                                return 1;

                            }

                        });

                        return sortedHours;
                    }
                    throw new Error("erro ao buscar dados");
                }
            ).catch( (err: any) => {
                throw new Error(err)
            })
    }
}


export default ScheduleHoursValid 