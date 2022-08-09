import ClientModel from "../../Models/client";
import api from "../api/api";
import CONSTANTS from "../../constants";
import { AxiosResponse } from "axios";
import HttpObjectModel from "../../Models/http";

const PROCESS = 'WC_CLIENTE';

const ClientService = {

    update: (client: ClientModel, tipo: string = 'ALTERAR') => {

        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api/transaction/?processo=${PROCESS}` +
            `&opcao=${tipo}` +
            `&WC_CLIENTE_COD=${client.WC_CLIENTE_COD}` +
            `&SAS_CLI_PRONOME=${client.SAS_CLI_PRONOME}` +
            `&SAS_CLI_PRIMEIRO_NOME=${client.SAS_CLI_PRIMEIRO_NOME}` +
            `&SAS_CLI_SOBRENOME=${client.SAS_CLI_SOBRENOME}` +
            /* `&SAS_CLI_EMPRESA=${client.SAS_CLI_EMPRESA}` +
            `&SAS_CLI_NOME_COMPLETO=${client.SAS_CLI_NOME_COMPLETO}` +
            `&SAS_CLI_INDICACAO_FATURA=${client.SAS_CLI_INDICACAO_FATURA}` +
            `&SAS_CLI_NOTIFICACAO_COTAC=${client.SAS_CLI_NOTIFICACAO_COTAC}` +
            `&SAS_CLI_NOTIFICACAO_COMPR=${client.SAS_CLI_NOTIFICACAO_COMPR}` +
            `&SAS_CLI_NOTIFICACAO_TRABA=${client.SAS_CLI_NOTIFICACAO_TRABA}` + */
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

    delete: (WC_CLIENTE_COD: string) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api/transaction/?processo=${PROCESS}` +
            `&opcao=EXCLUIR` +
            `&WC_CLIENTE_COD=${WC_CLIENTE_COD}` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;
            
        return api.get(CONSTANTS.IP + url)
            .then((result: AxiosResponse<any>) => {
                return result.data
            })
    },


    getByCode: async (code:string, navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;
        let page = 'webpages/v1/webdebug.do?pageid=clients'; 
        let url = `api?type=data&processo=${PROCESS}&filbrw=WC_CLIENTE_COD=${code}&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ClientModel>}>) => {

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados
                    }
                    throw new Error("erro ao buscar dados");
                }
            ).catch( (err: any) => {
                throw new Error(err)
            })
    },

    getAll: async (navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;
        let page = 'webpages/v1/webdebug.do?pageid=clients'; 
        let url = `api?type=data&processo=${PROCESS}&filbrw=null&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ClientModel>}>) => {

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados

                    }
                    

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },

    get: async (name: string, navpage: number = 0, maxreg: number = 50) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;
        let page = 'webpages/v1/webdebug.do?pageid=clients'; 
        let url = `api?type=data&processo=${PROCESS}&filbrw=WC_GEN_RAZAO %20like%20(%25${name}%25)or SAS_CLI_SOBRENOME %20like%20(${name}%25)&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ClientModel>}>) => {

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados

                    }
                    

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    }

}


export default ClientService;