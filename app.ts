import {readFileSync, appendFileSync, writeFileSync, readdirSync, statSync} from "fs"
import {gps,parse} from "exifr"
import {SingleBar,Presets} from "cli-progress"






// console.log(12345)
async function getgps(url:string ){
    
    // console.log('[loggps]',url)
    // const url = './data/tmp.heic'
    // const url = './data/do.jpg'
    const gpsdata = await gps(readFileSync(url))
    // console.log('gpsdata',gpsdata)
    
    return gpsdata
}

// loggps('./data/do.jpg')
// loggps('./data/tmp.heic')
// function loggps

async function loggps_bydir(dirpath:string, outpath:string){
    writeFileSync(outpath, 'filepath, latitude, longitude\n');

    const bar1 = new SingleBar({}, Presets.shades_classic);

    const list = readdirSync(dirpath)
    const list_ok:string[] = []
    for (const name of list){
        const path = dirpath+'\\'+name
        if(statSync(path).isDirectory()){
            // 111
        }
        else{
            list_ok.push(path)
        }
    }

    const list_ok_len = list_ok.length
    bar1.start(list_ok.length, 0);

    async function dologgps() {
        while(list_ok.length){
            const path = list_ok.pop()
            if(!path) continue
            else if ( !(path.endsWith('jpg') || path.endsWith('jpeg') || path.endsWith('heic'))) continue

            // console.clear()
            // console.log(`[dologgps] doing ${Number(100-list_ok.length/list_ok_len*100).toFixed(2)}% [${list_ok.length}/${list_ok_len}], path:${path}`)
            // console.log
            bar1.update(list_ok_len-list_ok.length)
            // bar1.log(path);
            
            try{

                const gpsdata = await getgps(path)
                if(gpsdata) appendFileSync(outpath, `"${path}", ${gpsdata.latitude}, ${gpsdata.longitude}\n`)
            }catch(e){
                console.error('err]',e,path)
                throw "!23";
            }
        }
    }
    await Promise.all(Array(8).fill(0).map(v=>dologgps()))
    // console.clear()
    // 8개로 출임.
    bar1.stop()
    
}
loggps_bydir(require('./setting.json').dirpath, require('./setting.json').outpath)

// 위 코드의 문제
// 파일을 함꺼번에 다운로드함...