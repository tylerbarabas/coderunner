const domain = 'https://api.acme.codes';

export async function getAnimsJson(){
    let res = await fetch( domain + '/anims-json');
    return await res.json();
}
