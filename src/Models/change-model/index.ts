export default interface ChangeTeamModel {
    SAS_EQUIPE_ID: number
    SAS_EQUIPES_SUBS_ORI?: string
    SAS_EQUIPES_SUBS: string
    SAS_TROCA_EQUIPE_DTFI: string
    SAS_TROCA_EQUIPE_DTINI: string
    WC_GEN_RAZAO: string
    dateStart?: Date
    dateEnd?: Date
    selected?: boolean
}