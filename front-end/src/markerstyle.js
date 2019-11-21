const K_SIZE = 30;

const markerStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_SIZE,
  height: K_SIZE,
  left: -K_SIZE / 2,
  top: -K_SIZE / 2,
  lineHeight : `${K_SIZE}px`,

  borderRadius: K_SIZE,
  backgroundColor: 'red',
  textAlign: 'center',
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer',
};

// const greatPlaceStyleHover = {
//   ...greatPlaceStyle,
//   border: '5px solid #3f51b5',
//   color: '#f44336'
// };

export {markerStyle, K_SIZE};