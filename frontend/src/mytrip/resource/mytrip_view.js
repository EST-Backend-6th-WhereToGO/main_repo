
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyDVGM_DH43bYB9M4bTvfR51lBjHJQ1_IMs",
    v: "weekly",
    libraries: ["places"]
});
let map;

const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
//============================== fetch  ==============================

function timeAndPlace(time, place, order) {
    return {
        time: time,
        place: place,
        order: order
    };
}

let order =1;
let timeAndPlaces=[]
let daycount = 0;

let sendRemoveList=[];

fetch('http://localhost:8080/api/searchTrip',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    //body: JSON.stringify({removeList: sendRemoveList})
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {

        console.log("data : ",data);
        let obj = JSON.parse(data.content);
        console.log(obj);


        Object.keys(obj).forEach(day => {

            const dayDiv = document.createElement('div');
            dayDiv.className = 'dayOrder';
            const daySpan = document.createElement('span');
            daySpan.textContent = `Day ${daycount+1}`;
            dayDiv.appendChild(daySpan);
            document.getElementById('trip-order').appendChild(dayDiv);
            daycount++;

            obj[day].forEach(item => {
                console.log("item : ", item);

                const planP = document.createElement('p');
                planP.className='planOrder';
                planP.textContent = `${item['시간']}`+ `\n`+` ${item['장소']}`;
                dayDiv.appendChild(planP);

                if(!item['장소'].includes("호텔")) {
                    timeAndPlaces.push(timeAndPlace(item['시간'], item['장소'],order));
                    order++;
                }
            });
        });

        // 일정 빼는 버튼 이벤트 리스너
        let removeOrderList=[];
        let removeOrderBtn = document.getElementsByClassName('planOrder');

        Array.from(removeOrderBtn).forEach(btn => {
            btn.addEventListener('click', () => {
                if (removeOrderList.includes(btn.innerText)) {
                    removeOrderList = removeOrderList.filter(item => item !== btn.innerText);
                    sendRemoveList = removeOrderList;
                    btn.style.background = 'white';
                    console.log("sendRemoveList : ", sendRemoveList);
                    return;
                }
                removeOrderList.push(btn.innerText);
                sendRemoveList = removeOrderList;
                btn.style.background = 'red';
                console.log("sendRemoveList : ", sendRemoveList);
            });
        });
        //=======

        console.log("가져온데이터:", timeAndPlaces);
        initMap();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
// ========================================================================



// ============================== google map ==============================
// initMap();

let service;
let infowindow;

async function initMap() {
    const center = { place :"서울역",lat:37.5546, lng: 126.9717}

    // The map, centered at 서울역
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 12,
        mapId: 'DEMO_MAP_ID'
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    for (var i=0; i<timeAndPlaces.length; i++) {
        let request = {
            query: timeAndPlaces[i].place,
            fields: ["name", "geometry"],
        };
        //console.log("request : ", request);
        service.findPlaceFromQuery(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                for (let i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                    console.log("results : ", results[i]);
                }
                map.setCenter(results[0].geometry.location);
            }
        });
    }
}

//============================================================

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new AdvancedMarkerElement({
        map,
        position: place.geometry.location,
    });


    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map, marker);
    });
}


let reSearchBtn = document.getElementById('re-search');

reSearchBtn.addEventListener('click', (event) => {

    const deleteDiv = Array.from(document.getElementsByClassName('dayOrder'));
    deleteDiv.forEach(element => element.remove());

    const deleteSpan = Array.from(document.getElementsByClassName('daySpan'));
    deleteSpan.forEach(element => element.remove());

    const deletePlan = Array.from(document.getElementsByClassName('planOrder'));
    deletePlan.forEach(element => element.remove());

    fetch('http://localhost:8080/api/searchTrip',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendRemoveList)

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {

            console.log("data : ",data);
            let obj = JSON.parse(data.content);
            console.log(obj);

            timeAndPlaces = [];
            daycount = 0;
            order = 1;
            Object.keys(obj).forEach(day => {

                const dayDiv = document.createElement('div');
                dayDiv.className = 'dayOrder';
                const daySpan = document.createElement('span');
                daySpan.textContent = `Day ${daycount+1}`;
                daySpan.className='daySpan';
                dayDiv.appendChild(daySpan);
                document.getElementById('trip-order').appendChild(dayDiv);
                daycount++;

                obj[day].forEach(item => {
                    console.log("item : ", item);

                    const planP = document.createElement('p');
                    planP.className='planOrder';
                    planP.textContent = `${item['시간']}`+ `\n`+` ${item['장소']}`;
                    dayDiv.appendChild(planP);

                    if(!item['장소'].includes("호텔")) {
                        timeAndPlaces.push(timeAndPlace(item['시간'], item['장소'],order));
                        order++;
                    }
                });
            });

            // 일정 빼는 버튼 이벤트 리스너
            let removeOrderList=[];
            let removeOrderBtn = document.getElementsByClassName('planOrder');

            Array.from(removeOrderBtn).forEach(btn => {
                btn.addEventListener('click', () => {
                    if (removeOrderList.includes(btn.innerText)) {
                        removeOrderList = removeOrderList.filter(item => item !== btn.innerText);
                        sendRemoveList = removeOrderList;
                        btn.style.background = 'white';
                        console.log("sendRemoveList : ", sendRemoveList);
                        return;
                    }
                    removeOrderList.push(btn.innerText);
                    sendRemoveList = removeOrderList;
                    btn.style.background = 'red';
                    console.log("sendRemoveList : ", sendRemoveList);
                });
            });
            //=======

            console.log("가져온데이터:", timeAndPlaces);
            initMap();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});