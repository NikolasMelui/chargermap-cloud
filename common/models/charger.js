'use strict';
const url = require('url');
const path = require('path');

module.exports = function(Charger) {
  class ChargerMapError extends Error {
    constructor(message, code) {
      super();
      this.name = 'ChargerMapError';
      this.message = message;
      this.code = code;
      this.stack = new Error(message).stack;
    }
  }

  Charger.charger = async ctx => {
    const result = [];
    try {
      const requestHostname = ctx.req.connection.remoteAddress;
      const requestData = await ctx.req.body;
      if (
        typeof requestData.uuid === 'string' &&
        requestData.uuid !== '' &&
        typeof requestData.location === 'object' &&
        requestData.location != {} &&
        typeof requestData.port === 'number' &&
        requestData.port > 0 &&
        requestData.port < 65537
      ) {
        const curData = {
          uuid: requestData.uuid,
          location: requestData.location,
          hostname: requestHostname,
          port: requestData.port
        };

        const findedCharger = await Charger.upsertWithWhere(
          { uuid: curData.uuid },
          curData
        );

        console.info(
          '\x1b[32m%s\x1b[0m',
          `The charger was successfully added: ${JSON.stringify(
            findedCharger,
            null,
            4
          )}`
        );

        result.push({
          success: {
            statusCode: 200,
            message: 'The charger was successfully added',
            uuid: curData.uuid,
            location: curData.location,
            hostname: curData.hostname,
            port: curData.port
          }
        });
      } else {
        ctx.res.status(400);
        throw new ChargerMapError(
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

  Charger.remoteMethod('charger', {
    description: 'Register the new charger in the system.',
    accepts: [
      { arg: 'ctx', type: 'object', http: { source: 'context' } },
      { arg: 'data', type: 'object', http: { source: 'body' } }
    ],
    http: { path: '/post', verb: 'post' },
    returns: { arg: 'response', type: 'object', root: true }
  });
};
