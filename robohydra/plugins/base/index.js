var heads               = require('robohydra').heads,
    RoboHydraHeadStatic = heads.RoboHydraHeadStatic;


exports.getBodyParts = function() {
  return {
    heads: [
      new RoboHydraHeadStatic({
          path: '/v1/public/yql',
          statusCode: 200,
          contentType: 'application/json',
          content: '{"query":{"count":15,"created":"2015-02-19T22:34:59Z","lang":"en-US","results":{"quote":[{"AskRealtime":"15.00","BidRealtime":"14.40","ChangeRealtime":"-0.11","ChangeinPercent":"-0.75%","Symbol":"QLGC"},{"AskRealtime":"110.40","BidRealtime":"108.65","ChangeRealtime":"+0.84","ChangeinPercent":"+0.77%","Symbol":"WDC"},{"AskRealtime":"82.43","BidRealtime":"82.38","ChangeRealtime":"+0.47","ChangeinPercent":"+0.57%","Symbol":"SNDK"},{"AskRealtime":"103.93","BidRealtime":"103.81","ChangeRealtime":"+0.03","ChangeinPercent":"+0.03%","Symbol":"DIS"},{"AskRealtime":null,"BidRealtime":null,"ChangeRealtime":"0.00","ChangeinPercent":null,"Symbol":"GH"},{"AskRealtime":"47.39","BidRealtime":"46.84","ChangeRealtime":"-0.27","ChangeinPercent":"-0.57%","Symbol":"GSK"},{"AskRealtime":"0.00","BidRealtime":"68.25","ChangeRealtime":"-0.385","ChangeinPercent":"-0.55%","Symbol":"SEU3.L"},{"AskRealtime":"43.75","BidRealtime":"43.25","ChangeRealtime":"+0.25","ChangeinPercent":"+0.58%","Symbol":"EPO.L"},{"AskRealtime":"564.50","BidRealtime":"563.50","ChangeRealtime":"+10.50","ChangeinPercent":"+1.90%","Symbol":"IAG.L"},{"AskRealtime":"1100.00","BidRealtime":"1098.00","ChangeRealtime":"0.00","ChangeinPercent":"0.00%","Symbol":"ARM.L"},{"AskRealtime":"128.46","BidRealtime":"128.45","ChangeRealtime":"-0.265","ChangeinPercent":"-0.21%","Symbol":"AAPL"},{"AskRealtime":"68.99","BidRealtime":"67.50","ChangeRealtime":"+0.38","ChangeinPercent":"+0.56%","Symbol":"AZN"},{"AskRealtime":null,"BidRealtime":null,"ChangeRealtime":"0.00","ChangeinPercent":null,"Symbol":"BP."},{"AskRealtime":null,"BidRealtime":null,"ChangeRealtime":"0.00","ChangeinPercent":null,"Symbol":"NETFLIX"},{"AskRealtime":"60.20","BidRealtime":"0.00","ChangeRealtime":"-0.14","ChangeinPercent":"-0.24%","Symbol":"SEUR.L"}]}}}'
      })
    ],
    scenarios: {
      up: {
        heads: [
          new RoboHydraHeadStatic({
              path: '/v1/public/yql',
              statusCode: 200,
              contentType: 'application/json',
              content: '{"query":{"count":15,"created":"2015-02-19T22:34:59Z","lang":"en-US","results":{"quote":[{"AskRealtime":"15.00","BidRealtime":"14.40","ChangeRealtime":"-0.11","ChangeinPercent":"-0.75%","Symbol":"QLGC"},{"AskRealtime":"110.40","BidRealtime":"108.65","ChangeRealtime":"+0.84","ChangeinPercent":"+0.77%","Symbol":"WDC"},{"AskRealtime":"82.43","BidRealtime":"82.38","ChangeRealtime":"+0.47","ChangeinPercent":"+0.57%","Symbol":"SNDK"},{"AskRealtime":"103.93","BidRealtime":"103.81","ChangeRealtime":"+0.03","ChangeinPercent":"+0.03%","Symbol":"DIS"},{"AskRealtime":null,"BidRealtime":null,"ChangeRealtime":"0.00","ChangeinPercent":null,"Symbol":"GH"},{"AskRealtime":"43.39","BidRealtime":"42.84","ChangeRealtime":"-4","ChangeinPercent":"-1%","Symbol":"GSK"},{"AskRealtime":"0.00","BidRealtime":"68.25","ChangeRealtime":"-0.385","ChangeinPercent":"-0.55%","Symbol":"SEU3.L"},{"AskRealtime":"47.75","BidRealtime":"47.25","ChangeRealtime":"+4","ChangeinPercent":"+1%","Symbol":"EPO.L"},{"AskRealtime":"564.50","BidRealtime":"563.50","ChangeRealtime":"+10.50","ChangeinPercent":"+1.90%","Symbol":"IAG.L"},{"AskRealtime":"1100.00","BidRealtime":"1098.00","ChangeRealtime":"0.00","ChangeinPercent":"0.00%","Symbol":"ARM.L"},{"AskRealtime":"128.46","BidRealtime":"128.45","ChangeRealtime":"-0.265","ChangeinPercent":"-0.21%","Symbol":"AAPL"},{"AskRealtime":"68.99","BidRealtime":"67.50","ChangeRealtime":"+0.38","ChangeinPercent":"+0.56%","Symbol":"AZN"},{"AskRealtime":null,"BidRealtime":null,"ChangeRealtime":"0.00","ChangeinPercent":null,"Symbol":"BP."},{"AskRealtime":null,"BidRealtime":null,"ChangeRealtime":"0.00","ChangeinPercent":null,"Symbol":"NETFLIX"},{"AskRealtime":"60.20","BidRealtime":"0.00","ChangeRealtime":"-0.14","ChangeinPercent":"-0.24%","Symbol":"SEUR.L"}]}}}'
          })
        ]
      }
    }
  }
}