import ClientModel from "../../Models/client";
import { v4 as uuidv4 } from 'uuid';
import api from "../api/api";
import CONSTANTS from "../../constants";
import { AxiosResponse } from "axios";
import PropertyModel from "../../Models/property";
import HttpObjectModel from "../../Models/http";

const PROCESS = 'SAS_PROP';

const PropertyService = {

    save: (id: string, property: PropertyModel, tipo: string = 'INCLUIR') => {

        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api/transaction/?processo=${PROCESS}` +
            `&opcao=${tipo}` +
            `&SAS_PROP_ID=${id}` +
            `&SAS_PROP_ENDERECO1=${property.SAS_PROP_ENDERECO1}` +
            `&SAS_PROP_ENDERECO2=${property.SAS_PROP_ENDERECO2}` +
            `&SAS_PROP_CIDADE=${property.SAS_PROP_CIDADE}` +
            `&SAS_PROP_ESTADO=${property.SAS_PROP_ESTADO}` +
            `&SAS_PROP_ZIPCODE=${property.SAS_PROP_ZIPCODE}` +
            `&SAS_PROP_PAIS=${property.SAS_PROP_PAIS}` +
            `&SAS_PROP_DETALHES_ADICION	=${property.SAS_PROP_DETALHES_ADICION}` +
            `&SAS_PROP_DET=${property.SAS_PROP_DET}` +

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

    updateComment: (id: string, details: string, tipo: string = 'ALTERAR') => {

        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api/transaction/?processo=${PROCESS}` +
            `&opcao=${tipo}` +
            `&SAS_PROP_ID=${id}` +
            `&SAS_PROP_DET=${details}` +

            `&idproc=0` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;
            
        return api.get( encodeURI(CONSTANTS.IP + url) )
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


    getAll: async (navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api?type=data&processo=${PROCESS}&filbrw=null&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        console.log(CONSTANTS.IP + url)
        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<PropertyModel>}>) => {

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados

                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },

    getById: async (SAS_PROP_ID: string, navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api?type=data&processo=${PROCESS}&filbrw=SAS_PROP_ID=${SAS_PROP_ID}&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;
        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<PropertyModel>}>) => {

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados
                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },

    getByClient: async (clientId: string, navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api?type=data&processo=${PROCESS}&filbrw=SAS_CLI_ID=(${clientId})&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        console.log(CONSTANTS.IP + url)
        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<PropertyModel>}>) => {

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


export default PropertyService;