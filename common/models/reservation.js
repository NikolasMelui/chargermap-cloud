'use strict';
const http = require('http');

module.exports = function(Reservation) {
  class ReservationError extends Error {
    constructor(message, code) {
      super();
      this.name = 'ReservationError';
      this.message = message;
      this.code = code;
      this.stack = new Error(message).stack;
    }
  }

  Reservation.reservation = async ctx => {
    const result = [];
    try {
      const requestData = await ctx.req.body;
      if (
        typeof requestData.startTime === 'string' &&
        requestData.startTime !== '' &&
        typeof requestData.endTime === 'string' &&
        requestData.endTime !== '' &&
        typeof requestData.reservationState === 'string' &&
        requestData.reservationState !== '' &&
        typeof requestData.vehicleDistance === 'number' &&
        requestData.vehicleDistance !== 0 &&
        typeof requestData.stateUpdateTime === 'string' &&
        requestData.stateUpdateTime !== ''
      ) {
        const curData = {
          startTime: new Date(requestData.startTime),
          endTime: new Date(requestData.endTime),
          reservationState: requestData.reservationState,
          vehicleDistance: requestData.vehicleDistance,
          stateUpdateTime: new Date(requestData.stateUpdateTime)
        };

        result.push(
          await Reservation.findOrCreate(
            {
              where: {
                or: [
                  {
                    startTime: {
                      between: [curData.startTime, curData.endTime]
                    }
                  },
                  {
                    endTime: {
                      between: [curData.startTime, curData.endTime]
                    }
                  }
                ]
              }
            },
            curData
          )
        );

        console.info(
          '\x1b[32m%s\x1b[0m',
          `The reservation was successfully added: ${JSON.stringify(
            result[0],
            null,
            4
          )}`
        );

        // const responseData = await new Promise((req, res) => {
        //   const options = {
        //     host: '',
        //     port: 2222,
        //     path: '',
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/x-www-form-urlencoded',
        //       'Content-Length': Buffer.byteLength(data)
        //     }
        //   };

        //   const httpreq = http.request(options, response => {
        //     response.setEncoding('utf8');
        //     response.on('data', chunk => console.info('body: ' + chunk));
        //     response.on('end', () => res.send('ok'));
        //     httpreq.write(data);
        //     httpreq.end();
        //   });
        // )};

        // const findedReservation = await Reservation.upsertWithWhere(
        //   { uuid: curData.uuid },
        //   curData
        // );

        // result.push({
        //   success: {
        //     statusCode: 200,
        //     message: 'The reservation was successfully added',
        //     uuid: curData.uuid,
        //     location: curData.location,
        //     hostname: curData.hostname,
        //     port: curData.port
        //   }
        // });
      } else {
        ctx.res.status(400);
        throw new ReservationError(
          'Request wrong data. Please change your data and try again',
          400
        );
      }
    } catch (err) {
      console.error('\x1b[31m%s\x1b[0m', err);
      result.push({
        error: {
          name: err.name,
          statusCode: err.code,
          message: err.message
        }
      });
      return result;
    }
    return result;
  };

  Reservation.remoteMethod('reservation', {
    description: 'Register the new reservation in the system.',
    accepts: [
      { arg: 'ctx', type: 'object', http: { source: 'context' } },
      { arg: 'data', type: 'object', http: { source: 'body' } }
    ],
    http: { path: '/post', verb: 'post' },
    returns: { arg: 'response', type: 'object', root: true }
  });
};
