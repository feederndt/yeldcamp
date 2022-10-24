const huhu = JSON.parse(haha)

mapboxgl.accessToken = hihi;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: huhu.geometry.coordinates, // starting position [lng, lat]
zoom: 9, // starting zoom
projection: 'globe' // display the map as a 3D globe
});
 
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});


    
const markerHeight = 50;
const markerRadius = 10;
const linearOffset = 25;
const popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
    };
    const popup = new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
    .setLngLat(huhu.geometry.coordinates)
    .setHTML(`<h3>${huhu.title}</h3>`)
    .setMaxWidth("300px")
    .addTo(map);

const marker = new mapboxgl.Marker()
    .setLngLat(huhu.geometry.coordinates)
    .addTo(map)
    .setPopup(popup);