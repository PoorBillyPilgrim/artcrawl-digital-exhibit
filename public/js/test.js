const getKV = async function() {
    let response = await fetch('https://kurtvonnegutapi.com/api?title=Slaughterhouse-Five');
    return response.json();
}


let data;

getKV().then(res => data = res);


