import { AxiosResponse } from "axios";
import CONSTANTS from "../../constants";
import HttpObjectModel from "../../Models/http";
import TeamModel from "../../Models/team/intex";
import api from "../api/api";

const PROCESSO = 'SAS_EQUIPES';
const TeamService = {

    getAll: async (navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api?type=data&processo=${PROCESSO}&filbrw=null&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<TeamModel>}>) => {

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados.consulta

                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },

    releaseTeam(teamId: number, date: string) {


        api.get(CONSTANTS.IP + `/webpages/v1/webdebug.do?pageid=release-team&team-id=${teamId}&schedule-date=${date}`).then(
            (retorno: AxiosResponse<string>) => {

                if(retorno.data.trim() !== "Sucesso") {
                    throw new Error("error");
                }


            }
        ).catch( (err: any) => {

            throw new Error(err)
        })
    },

    removeReleaseTeam(teamId: number, date: string) {


        api.get(CONSTANTS.IP + `/webpages/v1/webdebug.do?pageid=remove-release-team&team-id=${teamId}&schedule-date=${date}`).then(
            (retorno: AxiosResponse<string>) => {

                if(retorno.data.trim() !== "Sucesso") {
                    throw new Error("error");
                }


            }
        ).catch( (err: any) => {

            throw new Error(err)
        })
    }


    }



export default TeamService;