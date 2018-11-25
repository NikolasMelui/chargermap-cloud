// 'use strict';

// module.exports = async app => {
//   const install = true;

//   if (install) {
//     try {
//       const _Charger = app.models.Charger;

//       // Create new Admin user
//       const chargers = await _Charger.create([
//         {
//           uuid: '12345',
//           port: 3324,
//           location: {
//             lat: 1,
//             lng: 2
//           }
//         }
//       ]);

//       chargers.forEach(charger => {
//         console.log(`${charger} was created.`);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };
