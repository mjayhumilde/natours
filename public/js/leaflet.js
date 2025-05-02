export const displayMap = (locations) => {
  const map = L.map('map', {
    zoomControl: false,
    zoomAnimation: true,
    fadeAnimation: true,
    zoom: 1, // start zoomed out
    center: [0, 0], // arbitrary center before flying in
  });

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
      attribution:
        '&copy; <a href="https://carto.com/">CARTO</a> | © OpenStreetMap contributors',
      subdomains: 'abcd',
      maxZoom: 19,
    }
  ).addTo(map);

  const customIcon = L.divIcon({
    className: '',
    html: '<div class="marker"></div>',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });

  const points = [];

  locations.forEach((loc) => {
    points.push([loc.coordinates[1], loc.coordinates[0]]);

    L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
        closeonClick: false,
        offset: [0, -40],
      })
      .openPopup();
  });

  const bounds = L.latLngBounds(points).pad(0.5);

  // Add a delay to make it noticeable
  setTimeout(() => {
    map.flyToBounds(bounds, {
      duration: 2, // animation duration in seconds
    });
  }, 500); // delay to ensure map loads first

  map.scrollWheelZoom.disable();
};
