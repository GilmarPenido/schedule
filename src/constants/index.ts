function defineUrl() {
    let url = window.location.href;
    let index = url.match('_')?.index || -1;

    if(url.includes('localhost')) {
        return 'https://hom.onesuite.app/greatjobprohom2/'
    }

    return url.slice(0, index) + '/';
    
};



const CONSTANTS = {
    IP: defineUrl(),
    //IP: "https://www.onesuite.com.br/greatjobprohom/",
    PAGE_HTML5: "webpages/v1/webdebug.do?pageid=",
    PSW: 'admin',
    //url encoded
    //PSW: 'great%21%40%23%242022',
    //PSW: 'great2022dev',
    USR: 'admin',
}


export default CONSTANTS