'use strict';

module.exports = async app => {
  const install = true;

  if (install) {
    try {
      const _Reservation = app.models.Reservation;

      // Create new Admin user
      const reservations = await _Reservation.create([
        {
          startTime: new Date('March 31, 2012 03:24:00'),
          endTime: new Date('March 31, 2012 04:24:00'),
          reservationState: 'cool',
          vehicleDistance: 200,
          stateUpdateTime: new Date()
        }
      ]);

      reservations.forEach(reservation => {
        console.log(`${reservation} was created.`);
      });
    } catch (error) {
      console.log(error);
    }
  }
};
