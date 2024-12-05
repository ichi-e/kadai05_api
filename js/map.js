import { app, db, dbRef } from "./firebaseConfig.js";
import { getDatabase, ref, push, set, onChildAdded, update, remove, onChildChanged, onChildRemoved }
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const target = document.getElementById('google_map');

let map;
const markers = [];
const { ColorScheme } = await google.maps.importLibrary("core")

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(target, {
        zoom: 5,
        center: { lat: 35.6895, lng: 139.6917 },
        mapTypeId: 'roadmap',
        colorScheme: ColorScheme.DARK
    });
}

async function addMarker(address, name) {
    try {
        const { InfoWindow } = await google.maps.importLibrary("maps");
        const { Geocoder } = await google.maps.importLibrary("geocoding");
        const geocoder = new Geocoder();

        geocoder.geocode({ address: address }, function (results, status) {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                console.log(location)
                
                // マーカーの作成

                const marker = new google.maps.Marker({
                    position: location,
                    map: map,
                      icon: {
                            url: '../img/star.png', // お好みの画像までのパスを指定
                            scaledSize: new google.maps.Size(15, 15) //👈追記
                        }

                });

                // 情報ウィンドウの作成
                const infoContent = `<div class="info"><p>${name}</p></div>`;
                const infowindow = new InfoWindow({ content: infoContent });

                // マーカークリック時に情報ウィンドウを再表示
                marker.addListener('click', () => {
                    infowindow.open(map, marker);
                });

            } else {
                console.error("Geocoding failed for:", address, status);
            }
        });
    } catch (error) {
        console.error("Error adding marker:", error);
    }
}

onChildAdded(dbRef, async (data) => {
    const msg = data.val();
    const name = msg.uname;
    const address = msg.prefecture + msg.city;

    if (!map) {
        await initMap(); // 初回だけ地図を初期化
    }

    addMarker(address, name);
});